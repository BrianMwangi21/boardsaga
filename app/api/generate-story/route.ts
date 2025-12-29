import { streamText } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { GameAnalysis } from '@/lib/prompts/prompts'
import { generateStoryPrompt, determineStoryFormat } from '@/lib/prompts/story-prompts'
import { Story, StoryFormat, StoryGenerationRequest, StoryGenerationResponse } from '@/lib/story-types'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
})

const MODEL = 'meta-llama/llama-3.3-70b-instruct:free'

const storyCache = new Map<string, { data: Story; timestamp: number }>()
const CACHE_TTL = 60 * 60 * 1000

const requestLog: Array<{ timestamp: number; endpoint: string }> = []
const RATE_LIMIT_WINDOW = 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 20

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function generateStoryWithRetry(analysisData: GameAnalysis, format: StoryFormat): Promise<Story> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Story Generation] Attempt ${attempt}/${MAX_RETRIES}`)

      const prompt = generateStoryPrompt(analysisData, format)

      const result = streamText({
        model: openrouter.chat(MODEL),
        prompt,
        temperature: 0.8,
        maxOutputTokens: 4096
      })

      const fullResponse = await result.text

      try {
        let jsonMatch = fullResponse.match(/```json\s*([\s\S]*?)\s*```/)
        if (!jsonMatch) {
          jsonMatch = fullResponse.match(/\{[\s\S]*\}/)
        }
        
        if (!jsonMatch) {
          throw new Error('No JSON found in response')
        }

        const jsonContent = jsonMatch[1] || jsonMatch[0]
        const storyData = JSON.parse(jsonContent)

        const story: Story = {
          id: `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: storyData.title || 'Untitled Chess Story',
          format,
          chapters: storyData.chapters?.map((chapter: unknown, index: number) => {
            const ch = chapter as Record<string, unknown>
            return {
              id: ch.id as string || `chapter-${index + 1}`,
              title: ch.title as string || `Chapter ${index + 1}`,
              chapterNumber: ch.chapterNumber as number || index + 1,
              sections: (ch.sections as string[]) || [],
              content: (ch.content as string) || '',
              narrativeStyle: (ch.narrativeStyle as string) || 'mixed',
              chessBoards: (ch.chessBoards as Array<Record<string, unknown>>) || [],
              keyMoveReferences: (ch.keyMoveReferences as Array<Record<string, unknown>>) || [],
              isFlashback: (ch.isFlashback as boolean) || false
            }
          }) || [],
          summary: storyData.summary || '',
          gameMetadata: {
            whitePlayer: analysisData.gameMetadata.whitePlayer,
            blackPlayer: analysisData.gameMetadata.blackPlayer,
            whiteElo: analysisData.gameMetadata.whiteElo,
            blackElo: analysisData.gameMetadata.blackElo,
            event: analysisData.gameMetadata.event,
            result: analysisData.gameMetadata.result,
            date: analysisData.gameMetadata.date,
            opening: analysisData.gameMetadata.opening
          },
          pieceLoreUsed: storyData.pieceLoreUsed || [],
          storyThemes: storyData.storyThemes || [],
          narrativeArc: storyData.narrativeArc || '',
          totalWordCount: storyData.totalWordCount || 0,
          createdAt: new Date()
        }

        if (story.chapters.length === 0) {
          console.warn('[Validation] No chapters in story, creating fallback chapter')
          story.chapters = [{
            id: 'chapter-1',
            title: 'The Game',
            chapterNumber: 1,
            sections: ['opening', 'middlegame', 'endgame'],
            content: `A chess game between ${analysisData.gameMetadata.whitePlayer} and ${analysisData.gameMetadata.blackPlayer}. The opening was ${analysisData.gameMetadata.opening || 'varied'}. Key moments emerged throughout the ${analysisData.chessjsData.totalMoves} moves. The final result was ${analysisData.gameMetadata.result}.`,
            narrativeStyle: 'mixed',
            chessBoards: [],
            keyMoveReferences: [],
            isFlashback: false
          }]
        }

        console.log(`[Story Generation] Success on attempt ${attempt}`)
        return story

      } catch (parseError) {
        console.error('[Parse Error] Failed to parse LLM response:', parseError)
        console.error('[Raw Response]', fullResponse)
        throw new Error('Failed to parse story response from AI')
      }

    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      console.error(`[Story Generation] Attempt ${attempt} failed:`, lastError.message)

      if (attempt < MAX_RETRIES) {
        console.log(`[Story Generation] Waiting ${RETRY_DELAY}ms before retry...`)
        await sleep(RETRY_DELAY)
      }
    }
  }

  throw lastError || new Error('Failed to generate story after all retries')
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
    requestLog.push({ timestamp: now, endpoint: 'generate-story' })

    const body = await request.json()
    const { analysisData, format } = body as StoryGenerationRequest

    if (!analysisData || typeof analysisData !== 'object') {
      return Response.json(
        { error: 'analysisData is required and must be an object' },
        { status: 400 }
      )
    }

    if (!analysisData.gameMetadata || !analysisData.narrativeAnalysis) {
      return Response.json(
        { error: 'Invalid analysisData structure. Missing required fields.' },
        { status: 400 }
      )
    }

    const storyFormat: StoryFormat = format || determineStoryFormat(analysisData)

    const analysisHash = Buffer.from(JSON.stringify(analysisData)).toString('base64').slice(0, 32)
    const cached = storyCache.get(analysisHash)
    if (cached && now - cached.timestamp < CACHE_TTL) {
      console.log(`[Cache Hit] Story found for analysis hash: ${analysisHash}`)
      return Response.json({
        story: cached.data,
        cached: true,
        tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
      })
    }

    const story = await generateStoryWithRetry(analysisData, storyFormat)

    storyCache.set(analysisHash, { data: story, timestamp: now })
    console.log(`[Cache Stored] Story saved for analysis hash: ${analysisHash}`)

    const response: StoryGenerationResponse = {
      story,
      tokenUsage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      }
    }

    return Response.json(response)

  } catch (error) {
    console.error('[Story Generation Error]', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Failed to parse story response') || 
          error.message.includes('No JSON found in response')) {
        return Response.json(
          { 
            error: 'Oops! Story generation had some issues. This is still a work in progress - please try again.',
            details: error.message
          },
          { status: 500 }
        )
      }
    }

    return Response.json(
      { 
        error: 'Oops! Story generation had some issues. This is still a work in progress - please try again.',
        details: error instanceof Error ? error.message : 'Failed to generate story'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    endpoint: 'Generate Story',
    method: 'POST',
    description: 'Generates an engaging chess story from analyzed game data',
    body: {
      analysisData: 'GameAnalysis object from /api/analyze-game',
      format: 'optional: "short" | "detailed" | "epic" - auto-determined if not provided'
    },
    model: MODEL,
    rateLimit: {
      window: `${RATE_LIMIT_WINDOW / 1000}s`,
      maxRequests: RATE_LIMIT_MAX_REQUESTS
    },
    cache: {
      ttl: `${CACHE_TTL / 1000}s`
    },
    retry: {
      maxAttempts: MAX_RETRIES,
      delay: `${RETRY_DELAY}ms`
    }
  })
}
