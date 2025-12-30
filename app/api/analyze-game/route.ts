import { parsePGN } from '@/lib/pgn-parser'
import { GameAnalysis } from '@/lib/prompts/prompts'
import { type GameEngineData, type MoveAnalysis } from '@/lib/stockfish-client'
import { analyzeGameWithEngine } from '@/lib/engine-analyzer'
import { Cache, generateHash, CACHE_TTL } from '@/lib/cache'
import { DEFAULT_RATE_LIMITER } from '@/lib/rate-limit'

const analysisCache = new Cache<GameAnalysis>()

const DEFAULT_WINDOW = 60 * 1000
const DEFAULT_MAX_REQUESTS = 20

export async function POST(request: Request) {
  try {
    if (!DEFAULT_RATE_LIMITER.check('analyze-game')) {
      return Response.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { pgn, engineData: rawEngineData } = body

    if (!pgn || typeof pgn !== 'string') {
      return Response.json(
        { error: 'PGN is required and must be a string' },
        { status: 400 }
      )
    }

    const engineData: GameEngineData | null = rawEngineData ? {
      pgnHash: rawEngineData.pgnHash,
      positions: rawEngineData.positions,
      evaluations: new Map<number, MoveAnalysis>(
        Object.entries(rawEngineData.evaluations).map(([k, v]) => [parseInt(k), v as MoveAnalysis])
      ),
      keyPositions: rawEngineData.keyPositions,
    } : null

    const pgnHash = generateHash(pgn)
    const cached = analysisCache.get(pgnHash)

    if (cached) {
      if (engineData && !cached.engineData) {
        const updatedAnalysis: GameAnalysis = {
          ...cached,
          engineData: engineData
        }
        analysisCache.set(pgnHash, updatedAnalysis)
        return Response.json({
          data: updatedAnalysis,
          cached: true,
          tokenUsage: { promptTokens: 0, completionTokens: 0 }
        })
      }
      return Response.json({
        data: cached,
        cached: true,
        tokenUsage: { promptTokens: 0, completionTokens: 0 }
      })
    }

    const parsedGame = parsePGN(pgn)
    if (!parsedGame) {
      return Response.json(
        { error: 'Failed to parse PGN file' },
        { status: 400 }
      )
    }

    const narrativeAnalysis = analyzeGameWithEngine(parsedGame, engineData)

    console.log('[Stockfish Data]', {
      evaluationsCount: engineData?.evaluations.size || 0,
      keyPositionsCount: engineData?.keyPositions.length || 0,
      positionsCount: engineData?.positions.length || 0,
      evaluations: engineData?.evaluations
    })

    const gameAnalysis: GameAnalysis = {
      gameMetadata: {
        whitePlayer: parsedGame.metadata.white || 'Unknown',
        blackPlayer: parsedGame.metadata.black || 'Unknown',
        whiteElo: parsedGame.metadata.whiteElo,
        blackElo: parsedGame.metadata.blackElo,
        event: parsedGame.metadata.event,
        result: parsedGame.metadata.result,
        date: parsedGame.metadata.date,
        timeControl: parsedGame.metadata.timeControl,
        opening: parsedGame.metadata.opening
      },
      moves: parsedGame.moves,
      chessjsData: parsedGame.chessjsData,
      engineData: engineData || undefined,
      narrativeAnalysis
    }

    analysisCache.set(pgnHash, gameAnalysis)

    return Response.json({
      data: gameAnalysis,
      cached: false,
      tokenUsage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      }
    })

  } catch (error) {
    console.error('[Analysis Error]', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze game' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    endpoint: 'Analyze Game',
    method: 'POST',
    description: 'Analyzes a chess PGN and returns narrative analysis using Stockfish engine',
    body: {
      pgn: 'string - PGN content to analyze',
      engineData: 'optional - Stockfish engine analysis data'
    },
    rateLimit: {
      window: `${DEFAULT_WINDOW / 1000}s`,
      maxRequests: DEFAULT_MAX_REQUESTS
    },
    cache: {
      ttl: `${CACHE_TTL / 1000}s`
    }
  })
}
