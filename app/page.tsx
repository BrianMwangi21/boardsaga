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

      const checkPgnResponse = await fetch('/api/stories/check-pgn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pgn: text }),
      })

      const checkPgnResult = await checkPgnResponse.json()

      if (checkPgnResult.exists && checkPgnResult.story) {
        window.location.href = `/stories/${checkPgnResult.story._id}`
        return
      }

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

      const saveStoryResponse = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rawPGN: gameData.pgn,
          analysis: analysisData,
          story: storyResult.story,
        }),
      })

      const saveStoryResult = await saveStoryResponse.json()

      if (!saveStoryResponse.ok) {
        throw new Error(saveStoryResult.error || 'Failed to save story')
      }

      window.location.href = `/stories/${saveStoryResult._id}`
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
    <div
      className="container mx-auto px-4"
      style={{
        minHeight: 'calc(100vh - 180px)',
      }}
    >
      <div className="max-w-4xl mx-auto py-6">
        <div className="text-center mb-6">
          <h1
            className="mb-2"
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 'var(--text-4xl)',
              fontWeight: 700,
              color: '#2C1810',
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            BoardSaga
          </h1>
          <p
            className="text-lg"
            style={{
              color: '#6B3410',
            }}
          >
            Transform your chess games into captivating stories
          </p>
        </div>

        {appState === 'upload' && (
          <div>
            <PGNUploader onFileSelect={handleFileSelect} />
            {error && (
              <div
                className="mt-4 p-4 rounded-lg"
                style={{
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '2px solid rgba(220, 38, 38, 0.5)',
                  color: '#991B1B',
                }}
              >
                {error}
              </div>
            )}
          </div>
        )}

        {appState === 'analyzing' && (
          <div className="text-center py-8">
            <div
              className="inline-block animate-spin rounded-full h-12 w-12 mx-auto"
              style={{
                borderTop: '3px solid #C19A6B',
                borderRight: '3px solid transparent',
                borderBottom: '3px solid #8B4513',
                borderLeft: '3px solid transparent',
              }}
            ></div>
            <p
              className="mt-4"
              style={{
                color: '#6B3410',
              }}
            >
              Analyzing your game...
            </p>
          </div>
        )}

        {appState === 'generating' && (
          <StoryLoading isGenerating={true} />
        )}

        {appState === 'error' && (
          <div className="text-center py-8">
            <div className="mb-4 text-6xl">⚠️</div>
            <h2
              className="mb-2"
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontSize: 'var(--text-2xl)',
                fontWeight: 700,
                color: '#2C1810',
              }}
            >
              Something went wrong
            </h2>
            <p
              className="mb-6"
              style={{
                color: '#6B3410',
              }}
            >
              {error}
            </p>
            <button
              onClick={resetUpload}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #C19A6B 0%, #A0522D 100%)',
                color: '#F5F0E6',
                boxShadow: '0 4px 16px rgba(44, 24, 16, 0.2)',
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
