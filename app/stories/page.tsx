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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <p className="mt-4 text-muted-foreground">Loading stories...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-4 text-destructive text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error loading stories</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-4 text-6xl">📚</div>
          <h2 className="text-2xl font-bold mb-2">No stories yet</h2>
          <p className="text-muted-foreground mb-6">
            Upload your first PGN file to generate a chess story!
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Create Your First Story
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Story History</h1>
          <p className="text-lg text-muted-foreground">
            Browse your generated chess stories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Link
              key={story._id.toString()}
              href={`/stories/${story._id.toString()}`}
              className="group block"
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-stone-200 group-hover:border-amber-400 h-full">
                <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-6 text-white">
                  <h2 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-amber-100 transition-colors">
                    {story.story.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-white/20 rounded text-xs">
                      {story.story.format}
                    </span>
                    <span className="px-2 py-1 bg-white/20 rounded text-xs">
                      {story.story.gameMetadata.result || 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">White</div>
                        <div className="text-gray-600">{story.story.gameMetadata.whitePlayer}</div>
                      </div>
                      <div className="text-gray-400">vs</div>
                      <div className="flex-1 text-right">
                        <div className="font-medium text-gray-900">Black</div>
                        <div className="text-gray-600">{story.story.gameMetadata.blackPlayer}</div>
                      </div>
                    </div>

                    {story.story.gameMetadata.opening && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Opening:</span>{' '}
                        {story.story.gameMetadata.opening}
                      </div>
                    )}

                    {story.story.gameMetadata.date && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Date:</span>{' '}
                        {new Date(story.story.gameMetadata.date).toLocaleDateString()}
                      </div>
                    )}

                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                      {new Date(story.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {story.story.summary && (
                    <p className="mt-4 text-sm text-gray-600 line-clamp-3">
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
