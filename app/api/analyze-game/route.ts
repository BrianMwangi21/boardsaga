import { streamText } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { parsePGN } from '@/lib/pgn-parser'
import { generateFullAnalysisPrompt, GameAnalysis } from '@/lib/prompts/prompts'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
})

const MODEL = 'openai/gpt-oss-120b:free'

const analysisCache = new Map<string, { data: GameAnalysis; timestamp: number }>()
const CACHE_TTL = 60 * 60 * 1000

const requestLog: Array<{ timestamp: number; endpoint: string }> = []
const RATE_LIMIT_WINDOW = 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 20

export async function POST(request: Request) {
  try {
    const now = Date.now()

    const recentRequests = requestLog.filter(r => now - r.timestamp < RATE_LIMIT_WINDOW)
    if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
      return Response.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }
    requestLog.push({ timestamp: now, endpoint: 'analyze-game' })

    const body = await request.json()
    const { pgn } = body

    if (!pgn || typeof pgn !== 'string') {
      return Response.json(
        { error: 'PGN is required and must be a string' },
        { status: 400 }
      )
    }

    const pgnHash = Buffer.from(pgn).toString('base64').slice(0, 32)
    const cached = analysisCache.get(pgnHash)
    if (cached && now - cached.timestamp < CACHE_TTL) {
      console.log(`[Cache Hit] Analysis found for PGN hash: ${pgnHash}`)
      return Response.json({
        data: cached.data,
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

    const result = streamText({
      model: openrouter.chat(MODEL),
      prompt,
      temperature: 0.7
    })

    const fullResponse = await result.text
    let analysisData: GameAnalysis

    try {
      const jsonMatch = fullResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      analysisData = JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('[Parse Error] Failed to parse LLM response:', error)
      console.error('[Raw Response]', fullResponse)
      return Response.json(
        { error: 'Failed to parse analysis response from AI' },
        { status: 500 }
      )
    }

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

    analysisCache.set(pgnHash, { data: gameAnalysis, timestamp: now })
    console.log(`[Cache Stored] Analysis saved for PGN hash: ${pgnHash}`)

    const usage = await result.usage
    console.log(`[Token Usage]`, JSON.stringify(usage))

    return Response.json({
      data: gameAnalysis,
      cached: false,
      tokenUsage: usage
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
      window: `${RATE_LIMIT_WINDOW / 1000}s`,
      maxRequests: RATE_LIMIT_MAX_REQUESTS
    },
    cache: {
      ttl: `${CACHE_TTL / 1000}s`
    }
  })
}
