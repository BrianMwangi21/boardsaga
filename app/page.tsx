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
  const [story, setStory] = useState<Story | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (file: File) => {
    setAppState('analyzing')
    setError(null)
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
    setStory(null)
  }

  if (appState === 'story' && story) {
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
      </div>
    </div>
  )
}
