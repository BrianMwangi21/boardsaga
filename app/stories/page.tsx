'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StoryMetadata } from '@/lib/story-schema'
import StoryFilters, {
  type StoryFiltersState,
  type ResultFilter,
  type FormatFilter,
  type SortOption,
} from '@/app/components/ui/StoryFilters'

function normalizeForSearch(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function matchesSearch(query: string, story: StoryMetadata): boolean {
  if (!query.trim()) return true

  const normalizedQuery = normalizeForSearch(query)
  const searchTerms = normalizedQuery.split(/\s+/).filter(Boolean)

  const searchTexts = [
    story.story.title,
    story.story.gameMetadata.whitePlayer || '',
    story.story.gameMetadata.blackPlayer || '',
    story.story.gameMetadata.opening || '',
    story.story.summary || '',
  ].map(normalizeForSearch)

  const matches = searchTexts.some((text) =>
    searchTerms.some((term) => text.includes(term))
  )

  return matches
}

function matchesDateRange(
  dateRange: StoryFiltersState['dateRange'],
  customDateFrom: Date | null,
  customDateTo: Date | null,
  story: StoryMetadata
): boolean {
  const storyDate = new Date(story.createdAt)
  const now = new Date()

  if (dateRange === 'alltime') return true

  if (dateRange === '7days') {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return storyDate >= sevenDaysAgo
  }

  if (dateRange === '30days') {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    return storyDate >= thirtyDaysAgo
  }

  if (dateRange === 'custom' && customDateFrom && customDateTo) {
    return storyDate >= customDateFrom && storyDate <= customDateTo
  }

  return true
}

function matchesResult(result: ResultFilter, story: StoryMetadata): boolean {
  if (result === 'all') return true
  return story.story.gameMetadata.result === result
}

function matchesFormat(format: FormatFilter, story: StoryMetadata): boolean {
  if (format === 'all') return true
  return story.story.format === format
}

function sortStories(sort: SortOption, stories: StoryMetadata[]): StoryMetadata[] {
  return [...stories].sort((a, b) => {
    const dateA = new Date(a.createdAt)
    const dateB = new Date(b.createdAt)

    if (sort === 'newest') {
      return dateB.getTime() - dateA.getTime()
    }
    return dateA.getTime() - dateB.getTime()
  })
}

export default function HistoryPage() {
  const [allStories, setAllStories] = useState<StoryMetadata[]>([])
  const [stories, setStories] = useState<StoryMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filters, setFilters] = useState<StoryFiltersState>({
    search: '',
    dateRange: 'alltime',
    customDateFrom: null,
    customDateTo: null,
    result: 'all',
    format: 'all',
    sort: 'newest',
  })

  useEffect(() => {
    async function fetchStories() {
      try {
        setLoading(true)
        const response = await fetch('/api/stories')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch stories')
        }

        setAllStories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  useEffect(() => {
    if (allStories.length === 0) {
      setStories([])
      return
    }

    const filtered = allStories.filter((story) => {
      if (!matchesSearch(filters.search, story)) return false
      if (!matchesDateRange(filters.dateRange, filters.customDateFrom, filters.customDateTo, story)) return false
      if (!matchesResult(filters.result, story)) return false
      if (!matchesFormat(filters.format, story)) return false
      return true
    })

    const sorted = sortStories(filters.sort, filtered)
    setStories(sorted)
  }, [allStories, filters])

  const handleResetFilters = () => {
    setFilters({
      search: '',
      dateRange: 'alltime',
      customDateFrom: null,
      customDateTo: null,
      result: 'all',
      format: 'all',
      sort: 'newest',
    })
  }

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
              Story Gallery
            </h1>
            <p
              className="text-lg"
              style={{
                color: '#6B3410',
              }}
            >
              Explore the community's chess stories
            </p>
          </div>

          <StoryFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={handleResetFilters}
          />

          <div className="text-center py-12">
            <div className="mb-4 text-6xl">🔍</div>
            <h2
              className="mb-2"
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontSize: 'var(--text-2xl)',
                fontWeight: 700,
                color: '#2C1810',
              }}
            >
              No stories match your filters
            </h2>
            <p
              className="mb-6"
              style={{
                fontSize: 'var(--text-base)',
                color: '#6B3410',
              }}
            >
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #C19A6B 0%, #A0522D 100%)',
                color: '#F5F0E6',
                boxShadow: '0 4px 16px rgba(44, 24, 16, 0.2)',
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    )
  }

  const featuredStories = stories.slice(0, 3)
  const regularStories = stories.slice(3)

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
            Story Gallery
          </h1>
          <p
            className="text-lg"
            style={{
              color: '#6B3410',
            }}
          >
            Explore the community's chess stories ({stories.length} total)
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

        <StoryFilters
          filters={filters}
          onFiltersChange={setFilters}
          onReset={handleResetFilters}
        />

        {featuredStories.length > 0 && (
          <div className="mb-12">
            <h2
              className="mb-6"
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontSize: 'var(--text-2xl)',
                fontWeight: 700,
                color: '#2C1810',
              }}
            >
              ✨ Featured Stories
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredStories.map((story) => (
                <Link
                  key={story._id.toString()}
                  href={`/stories/${story._id.toString()}`}
                  className="group block"
                >
                  <div
                    className="rounded-xl overflow-hidden transition-all duration-300 h-full hover:-translate-y-2 hover:shadow-2xl"
                    style={{
                      background: '#FFFFFF',
                      boxShadow: '0 8px 32px rgba(44, 24, 16, 0.15)',
                      border: '3px solid #C19A6B',
                    }}
                  >
                    <div
                      className="p-6 text-white"
                      style={{
                        background: 'linear-gradient(135deg, #D4A373 0%, #C19A6B 50%, #8B4513 100%)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">⭐</span>
                        <span className="text-sm font-medium">Featured</span>
                      </div>
                      <h2
                        className="mb-2 line-clamp-2"
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
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            background: 'rgba(255, 255, 255, 0.25)',
                          }}
                        >
                          {story.story.format}
                        </span>
                        {story.story.gameMetadata.result && (
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              background:
                                story.story.gameMetadata.result === '1-0'
                                  ? 'rgba(34, 197, 94, 0.3)'
                                  : story.story.gameMetadata.result === '0-1'
                                  ? 'rgba(220, 38, 38, 0.3)'
                                  : 'rgba(234, 179, 8, 0.3)',
                            }}
                          >
                            {story.story.gameMetadata.result}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2" style={{ fontSize: 'var(--text-sm)' }}>
                          <div className="flex-1">
                            <div className="font-medium" style={{ color: '#2C1810' }}>
                              White
                            </div>
                            <div style={{ color: '#6B3410' }}>{story.story.gameMetadata.whitePlayer}</div>
                          </div>
                          <div style={{ color: '#C19A6B' }}>vs</div>
                          <div className="flex-1 text-right">
                            <div className="font-medium" style={{ color: '#2C1810' }}>
                              Black
                            </div>
                            <div style={{ color: '#6B3410' }}>{story.story.gameMetadata.blackPlayer}</div>
                          </div>
                        </div>

                        {story.story.gameMetadata.opening && (
                          <div
                            className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: 'linear-gradient(135deg, #E8C9A0 0%, #D4A373 100%)',
                              color: '#2C1810',
                            }}
                          >
                            ♟️ {story.story.gameMetadata.opening}
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
                          className="pt-2"
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
                          className="mt-4 line-clamp-3"
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
        )}

        {regularStories.length > 0 && (
          <div>
            <h2
              className="mb-6"
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontSize: 'var(--text-2xl)',
                fontWeight: 700,
                color: '#2C1810',
              }}
            >
              All Stories ({regularStories.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularStories.map((story) => (
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
                        {story.story.gameMetadata.result && (
                          <span
                            className="px-2 py-1 rounded text-xs font-medium transition-all duration-300"
                            style={{
                              background:
                                story.story.gameMetadata.result === '1-0'
                                  ? 'rgba(34, 197, 94, 0.3)'
                                  : story.story.gameMetadata.result === '0-1'
                                  ? 'rgba(220, 38, 38, 0.3)'
                                  : 'rgba(234, 179, 8, 0.3)',
                            }}
                          >
                            {story.story.gameMetadata.result}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2" style={{ fontSize: 'var(--text-sm)' }}>
                          <div className="flex-1">
                            <div className="font-medium" style={{ color: '#2C1810' }}>
                              White
                            </div>
                            <div style={{ color: '#6B3410' }}>{story.story.gameMetadata.whitePlayer}</div>
                          </div>
                          <div style={{ color: '#C19A6B' }}>vs</div>
                          <div className="flex-1 text-right">
                            <div className="font-medium" style={{ color: '#2C1810' }}>
                              Black
                            </div>
                            <div style={{ color: '#6B3410' }}>{story.story.gameMetadata.blackPlayer}</div>
                          </div>
                        </div>

                        {story.story.gameMetadata.opening && (
                          <div
                            className="inline-block px-3 py-1 rounded-full text-xs"
                            style={{
                              background: 'linear-gradient(135deg, #E8C9A0 0%, #D4A373 100%)',
                              color: '#2C1810',
                            }}
                          >
                            ♟️ {story.story.gameMetadata.opening}
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
        )}
      </div>
    </div>
  )
}
