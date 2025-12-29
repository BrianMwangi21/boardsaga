'use client'

import { useState } from 'react'
import PGNUploader from './components/pgn/PGNUploader'
import { ParsedGame } from '@/lib/pgn-parser'
import { Story } from '@/lib/story-types'
import StoryLoading from './components/ui/StoryLoading'
import StoryViewer from './components/story/StoryViewer'

type AppState = 'upload' | 'analyzing' | 'generating' | 'story' | 'error'

export default function Home() {
  const [appState, setAppState] = useState<AppState>('upload')
  const [parsedGame, setParsedGame] = useState<ParsedGame | null>(null)
  const [story, setStory] = useState<Story | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (file: File) => {
    setAppState('analyzing')
    setError(null)
    setParsedGame(null)
    setStory(null)

    try {
      const text = await file.text()

      const parseResponse = await fetch('/api/parse-pgn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pgn: text }),
      })

      const parseResult = await parseResponse.json()

      if (!parseResponse.ok) {
        throw new Error(parseResult.error || 'Failed to parse PGN')
      }

      const gameData = parseResult.data
      setParsedGame(gameData)

      await generateStory(gameData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setAppState('error')
    }
  }

  const generateStory = async (gameData: ParsedGame) => {
    try {
      const analyzeResponse = await fetch('/api/analyze-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pgn: gameData.pgn }),
      })

      const analyzeResult = await analyzeResponse.json()

      if (!analyzeResponse.ok) {
        throw new Error(analyzeResult.error || 'Failed to analyze game')
      }

      const analysisData = analyzeResult.data
      setAppState('generating')

      const storyResponse = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysisData }),
      })

      const storyResult = await storyResponse.json()

      if (!storyResponse.ok) {
        throw new Error(storyResult.error || 'Failed to generate story')
      }

      console.log('[Story Generated] Full response:', storyResult)
      console.log('[Story Generated] Story object:', storyResult.story)
      console.log('[Story Generated] Chapter count:', storyResult.story?.chapters?.length)
      
      setStory(storyResult.story)
      setAppState('story')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setAppState('error')
    }
  }

  const resetUpload = () => {
    setAppState('upload')
    setError(null)
    setParsedGame(null)
    setStory(null)
  }

  const testStoryViewer = () => {
    setStory({
      id: "test-story-1",
      title: "Test Story - The Silent Knight",
      format: "short" as const,
      chapters: [
        {
          id: "chapter-1",
          title: "The Opening",
          chapterNumber: 1,
          sections: ["opening" as const],
          content: "This is a test chapter with some content. The knight moved from g1 to f3, establishing control over the center. From my perspective as the knight, I felt ready to leap into action.",
          narrativeStyle: "mixed" as const,
          chessBoards: [],
          keyMoveReferences: [],
          isFlashback: false
        }
      ],
      summary: "A test story to verify UI rendering",
      gameMetadata: {
        whitePlayer: "Test Player 1",
        blackPlayer: "Test Player 2",
        result: "1-0"
      },
      pieceLoreUsed: [],
      storyThemes: [],
      narrativeArc: "Test arc",
      createdAt: new Date()
    })
    setAppState('story')
  }

  if (appState === 'story' && story) {
    console.log('[Rendering Story Viewer]', story)
    console.log('[Story Chapters]', story.chapters)
    console.log('[Story Chapters Length]', story.chapters?.length)
    return <StoryViewer story={story} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">BoardSaga</h1>
          <p className="text-lg text-muted-foreground">
            Transform your chess games into captivating stories
          </p>
        </div>

        {appState === 'upload' && (
          <div>
            <PGNUploader onFileSelect={handleFileSelect} />
            {error && (
              <div className="mt-4 p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-lg">
                {error}
              </div>
            )}
            <div className="mt-4 text-center">
              <button
                onClick={testStoryViewer}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Test Story Viewer (Debug)
              </button>
            </div>
          </div>
        )}

        {appState === 'analyzing' && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Analyzing your game...</p>
          </div>
        )}

        {appState === 'generating' && (
          <StoryLoading isGenerating={true} />
        )}

        {appState === 'error' && (
          <div className="text-center py-12">
            <div className="mb-4 text-destructive text-6xl">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={resetUpload}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {appState === 'analyzing' && parsedGame && (
          <div className="mt-8 space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Game Information</h3>
              <dl className="grid grid-cols-2 gap-4">
                {parsedGame.metadata.white && (
                  <div>
                    <dt className="text-sm text-muted-foreground">White</dt>
                    <dd className="font-medium">{parsedGame.metadata.white}</dd>
                  </div>
                )}
                {parsedGame.metadata.black && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Black</dt>
                    <dd className="font-medium">{parsedGame.metadata.black}</dd>
                  </div>
                )}
                {parsedGame.metadata.result && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Result</dt>
                    <dd className="font-medium">{parsedGame.metadata.result}</dd>
                  </div>
                )}
                {parsedGame.metadata.date && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Date</dt>
                    <dd className="font-medium">{parsedGame.metadata.date}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
