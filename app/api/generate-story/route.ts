import { streamText } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { GameAnalysis, ParsedMove } from '@/lib/prompts/prompts'
import { generateStoryPrompt, determineStoryFormat } from '@/lib/prompts/story-prompts'
import { Story, StoryFormat, StoryGenerationRequest, StoryGenerationResponse } from '@/lib/story-types'
import { Cache, generateHashFromObject, CACHE_TTL } from '@/lib/cache'
import { DEFAULT_RATE_LIMITER } from '@/lib/rate-limit'
import { withRetry } from '@/lib/retry'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
})

const MODEL = 'meta-llama/llama-3.3-70b-instruct:free'

const storyCache = new Cache<Story>()

const DEFAULT_WINDOW = 60 * 1000
const DEFAULT_MAX_REQUESTS = 20

function getFenForMove(moves: ParsedMove[], moveNumber: number, san?: string): string | null {
  if (!moves || moves.length === 0) {
    return null
  }

  let moveIndex = moves.findIndex(m =>
    m.moveNumber === moveNumber && (!san || m.san === san)
  )

  if (moveIndex === -1) {
    if (moveNumber > moves.length) {
      const clampedIndex = Math.min(moveNumber - 1, moves.length - 1)
      moveIndex = clampedIndex
    } else {
      const closestMove = moves.reduce((closest, move) => {
        if (Math.abs(move.moveNumber - moveNumber) < Math.abs(closest.moveNumber - moveNumber)) {
          return move
        }
        return closest
      }, moves[0])

      moveIndex = moves.indexOf(closestMove)
    }
  }

  if (moveIndex === -1 || moveIndex >= moves.length) {
    return null
  }

  const move = moves[moveIndex]
  return move.after
}

function fixChessBoardsInStory(story: Story, moves: ParsedMove[]): Story {
  story.chapters.forEach(chapter => {
    if (chapter.chessBoards && chapter.chessBoards.length > 0) {
      chapter.chessBoards.forEach((board) => {
        const actualFen = getFenForMove(moves, board.moveNumber, board.san)

        if (actualFen) {
          board.fen = actualFen
        } else {
          board.fen = moves.length > 0 ? moves[0].before : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
        }
      })
    }
  })

  return story
}

async function generateStoryWithRetry(analysisData: GameAnalysis, format: StoryFormat): Promise<Story> {
  return withRetry(async () => {
    const prompt = generateStoryPrompt(analysisData, format)

    const result = streamText({
      model: openrouter.chat(MODEL),
      prompt,
      temperature: 0.8,
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

    return story

  }, 3, 1000)
}

export async function POST(request: Request) {
  try {
    if (!DEFAULT_RATE_LIMITER.check('generate-story')) {
      return Response.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

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

    const analysisHash = generateHashFromObject(analysisData)
    const cached = storyCache.get(analysisHash)
    if (cached) {
      const fixedCachedStory = fixChessBoardsInStory(cached, analysisData.moves)
      return Response.json({
        story: fixedCachedStory,
        cached: true,
        tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
      })
    }

    const story = await generateStoryWithRetry(analysisData, storyFormat)
    const fixedStory = fixChessBoardsInStory(story, analysisData.moves)

    storyCache.set(analysisHash, fixedStory)

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
      window: `${DEFAULT_WINDOW / 1000}s`,
      maxRequests: DEFAULT_MAX_REQUESTS
    },
    cache: {
      ttl: `${CACHE_TTL / 1000}s`
    },
    retry: {
      maxAttempts: 3,
      delay: '1000ms'
    }
  })
}
