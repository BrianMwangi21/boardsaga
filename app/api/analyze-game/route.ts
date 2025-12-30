import { streamText } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { parsePGN } from '@/lib/pgn-parser'
import { generateFullAnalysisPrompt, GameAnalysis } from '@/lib/prompts/prompts'
import { Cache, generateHash, CACHE_TTL } from '@/lib/cache'
import { DEFAULT_RATE_LIMITER } from '@/lib/rate-limit'
import { withRetry } from '@/lib/retry'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
})

const MODEL = 'meta-llama/llama-3.3-70b-instruct:free'

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
    const { pgn } = body

    if (!pgn || typeof pgn !== 'string') {
      return Response.json(
        { error: 'PGN is required and must be a string' },
        { status: 400 }
      )
    }

    const pgnHash = generateHash(pgn)
    const cached = analysisCache.get(pgnHash)
    if (cached) {
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

    const prompt = generateFullAnalysisPrompt(parsedGame)

    const gameAnalysis = await withRetry(async () => {
      const result = streamText({
        model: openrouter.chat(MODEL),
        prompt,
        temperature: 0.7,
        maxOutputTokens: 4096
      })

      const fullResponse = await result.text

      let jsonMatch = fullResponse.match(/```json\s*([\s\S]*?)\s*```/)
      if (!jsonMatch) {
        jsonMatch = fullResponse.match(/\{[\s\S]*\}/)
      }

      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const jsonContent = jsonMatch[1] || jsonMatch[0]
      const analysisData = JSON.parse(jsonContent)

      return {
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
        narrativeAnalysis: {
          overview: analysisData.narrativeAnalysis?.overview || {
            phase: 'mixed',
            openingPlayed: 'Unknown',
            keyThemes: [],
            tempoControl: 'balanced'
          },
          keyMoments: analysisData.narrativeAnalysis?.keyMoments || [],
          playerStrategies: analysisData.narrativeAnalysis?.playerStrategies || {
            white: { style: [], strengths: [], weaknesses: [], signatureMoves: [] },
            black: { style: [], strengths: [], weaknesses: [], signatureMoves: [] }
          },
          loreElements: analysisData.narrativeAnalysis?.loreElements || {
            dominantPieces: [],
            piecePersonalities: [],
            storyThemes: [],
            narrativeArc: ''
          }
        }
      }
    })

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
    description: 'Analyzes a chess PGN and returns narrative analysis with lore integration',
    body: {
      pgn: 'string - PGN content to analyze'
    },
    model: MODEL,
    rateLimit: {
      window: `${DEFAULT_WINDOW / 1000}s`,
      maxRequests: DEFAULT_MAX_REQUESTS
    },
    cache: {
      ttl: `${CACHE_TTL / 1000}s`
    }
  })
}
