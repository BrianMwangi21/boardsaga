'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StoryMetadata } from '@/lib/story-schema'

export default function HistoryPage() {
  const [stories, setStories] = useState<StoryMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStories() {
      try {
        setLoading(true)
        const response = await fetch('/api/stories')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch stories')
        }

        setStories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  if (loading) {
    return (
      <div
        className="container mx-auto px-4 py-12"
        style={{
          background: 'linear-gradient(to bottom, #F5F0E6 0%, #EEE8D3 100%)',
          minHeight: '100vh',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div
              className="inline-block animate-spin rounded-full h-12 w-12"
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
                fontSize: 'var(--text-base)',
                color: '#6B3410',
              }}
            >
              Loading stories...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="container mx-auto px-4 py-12"
        style={{
          background: 'linear-gradient(to bottom, #F5F0E6 0%, #EEE8D3 100%)',
          minHeight: '100vh',
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
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
            Error loading stories
          </h2>
          <p
            className="mb-6"
            style={{
              fontSize: 'var(--text-base)',
              color: '#6B3410',
            }}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #C19A6B 0%, #A0522D 100%)',
              color: '#F5F0E6',
              boxShadow: '0 4px 16px rgba(44, 24, 16, 0.2)',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div
        className="container mx-auto px-4 py-12"
        style={{
          background: 'linear-gradient(to bottom, #F5F0E6 0%, #EEE8D3 100%)',
          minHeight: '100vh',
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-4 text-6xl">📚</div>
          <h2
            className="mb-2"
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: '#2C1810',
            }}
          >
            No stories yet
          </h2>
          <p
            className="mb-6"
            style={{
              fontSize: 'var(--text-base)',
              color: '#6B3410',
            }}
          >
            Upload your first PGN file to generate a chess story!
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #C19A6B 0%, #A0522D 100%)',
              color: '#F5F0E6',
              boxShadow: '0 4px 16px rgba(44, 24, 16, 0.2)',
            }}
          >
            Create Your First Story
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="container mx-auto px-4 py-12"
      style={{
        background: 'linear-gradient(to bottom, #F5F0E6 0%, #EEE8D3 100%)',
        minHeight: '100vh',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
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
            Story History
          </h1>
          <p
            className="text-lg"
            style={{
              color: '#6B3410',
            }}
          >
            Browse your generated chess stories
          </p>
          <p
            className="text-sm mt-2 italic"
            style={{
              color: '#8B4513',
            }}
          >
            All stories are AI-generated with Stockfish engine analysis for move accuracy
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Link
              key={story._id.toString()}
              href={`/stories/${story._id.toString()}`}
              className="group block"
            >
              <div
                className="rounded-xl overflow-hidden transition-all duration-300 h-full hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  background: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(44, 24, 16, 0.12)',
                  border: '2px solid #E8C9A0',
                }}
              >
                <div
                  className="p-6 text-white transition-all duration-300 group-hover:shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #C19A6B 0%, #8B4513 100%)',
                  }}
                >
                  <h2
                    className="mb-2 line-clamp-2 transition-colors"
                    style={{
                      fontFamily: 'var(--font-serif), Georgia, serif',
                      fontSize: 'var(--text-xl)',
                      fontWeight: 700,
                    }}
                  >
                    {story.story.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="px-2 py-1 rounded text-xs transition-all duration-300 group-hover:bg-white/30"
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {story.story.format}
                    </span>
                    <span
                      className="px-2 py-1 rounded text-xs transition-all duration-300 group-hover:bg-white/30"
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {story.story.gameMetadata.result || 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2" style={{ fontSize: 'var(--text-sm)' }}>
                      <div className="flex-1">
                        <div
                          className="font-medium"
                          style={{
                            color: '#2C1810',
                          }}
                        >
                          White
                        </div>
                        <div style={{ color: '#6B3410' }}>
                          {story.story.gameMetadata.whitePlayer}
                        </div>
                      </div>
                      <div style={{ color: '#C19A6B' }}>vs</div>
                      <div className="flex-1 text-right">
                        <div
                          className="font-medium"
                          style={{
                            color: '#2C1810',
                          }}
                        >
                          Black
                        </div>
                        <div style={{ color: '#6B3410' }}>
                          {story.story.gameMetadata.blackPlayer}
                        </div>
                      </div>
                    </div>

                    {story.story.gameMetadata.opening && (
                      <div style={{ fontSize: 'var(--text-sm)', color: '#6B3410' }}>
                        <span className="font-medium" style={{ color: '#2C1810' }}>
                          Opening:
                        </span>{' '}
                        {story.story.gameMetadata.opening}
                      </div>
                    )}

                    {story.story.gameMetadata.date && (
                      <div style={{ fontSize: 'var(--text-sm)', color: '#6B3410' }}>
                        <span className="font-medium" style={{ color: '#2C1810' }}>
                          Date:
                        </span>{' '}
                        {new Date(story.story.gameMetadata.date).toLocaleDateString()}
                      </div>
                    )}

                    <div
                      className="pt-2 transition-colors"
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: '#8B4513',
                        borderTop: '1px solid #E8C9A0',
                      }}
                    >
                      {new Date(story.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {story.story.summary && (
                    <p
                      className="mt-4 line-clamp-3 transition-colors duration-300 group-hover:text-gray-700"
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: '#6B3410',
                      }}
                    >
                      {story.story.summary}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
