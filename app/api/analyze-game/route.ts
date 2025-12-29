import { streamText } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { parsePGN } from '@/lib/pgn-parser'
import { generateFullAnalysisPrompt, GameAnalysis } from '@/lib/prompts/prompts'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
})

const MODEL = 'meta-llama/llama-3.3-70b-instruct:free'

const analysisCache = new Map<string, { data: GameAnalysis; timestamp: number }>()
const CACHE_TTL = 60 * 60 * 1000

const requestLog: Array<{ timestamp: number; endpoint: string }> = []
const RATE_LIMIT_WINDOW = 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 20

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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

    let lastError: Error | null = null

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[Analyze Game] Attempt ${attempt}/${MAX_RETRIES}`)

        const result = streamText({
          model: openrouter.chat(MODEL),
          prompt,
          temperature: 0.7,
          maxOutputTokens: 4096
        })

        const fullResponse = await result.text
        let analysisData: GameAnalysis

        try {
          let jsonMatch = fullResponse.match(/```json\s*([\s\S]*?)\s*```/)
          if (!jsonMatch) {
            jsonMatch = fullResponse.match(/\{[\s\S]*\}/)
          }
          
          if (!jsonMatch) {
            throw new Error('No JSON found in response')
          }

          const jsonContent = jsonMatch[1] || jsonMatch[0]
          analysisData = JSON.parse(jsonContent)

          console.log(`[Analyze Game] Success on attempt ${attempt}`)
          
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

          return Response.json({
            data: gameAnalysis,
            cached: false,
            tokenUsage: {
              promptTokens: 0,
              completionTokens: 0,
              totalTokens: 0
            }
          })

        } catch (parseError) {
          console.error('[Parse Error] Failed to parse LLM response:', parseError)
          console.error('[Response Length]:', fullResponse.length, 'chars')
          console.error('[Last 300 chars]:', fullResponse.slice(-300))
          throw new Error('AI response was incomplete or malformed')
        }

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        console.error(`[Analyze Game] Attempt ${attempt} failed:`, lastError.message)

        if (attempt < MAX_RETRIES) {
          console.log(`[Analyze Game] Waiting ${RETRY_DELAY}ms before retry...`)
          await sleep(RETRY_DELAY)
        }
      }
    }

    return Response.json(
      { 
        error: 'Failed to analyze game after all retries. Please try again.' 
      },
      { status: 500 }
    )

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
