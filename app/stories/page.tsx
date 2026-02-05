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
import ShareButtons from '@/app/components/ui/ShareButtons'

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

// Cosmic loader component
function CosmicLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-20 h-20 mb-6">
        {/* Spinning rings */}
        <div 
          className="absolute inset-0 rounded-full border-2 border-cyan-500/30"
          style={{ animation: 'spin 3s linear infinite' }}
        />
        <div 
          className="absolute inset-2 rounded-full border-2 border-purple-500/30"
          style={{ animation: 'spin 2s linear infinite reverse' }}
        />
        <div 
          className="absolute inset-4 rounded-full border-2 border-gold-500/30"
          style={{ animation: 'spin 4s linear infinite' }}
        />
        <div 
          className="absolute inset-0 flex items-center justify-center text-3xl"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          ✨
        </div>
      </div>
      <p 
        className="text-lg"
        style={{ 
          color: 'var(--moon-glow)',
          fontFamily: "'Playfair Display', serif",
        }}
      >
        Summoning stories from the void...
      </p>
    </div>
  )
}

// Story card component
function StoryCard({ story, featured = false }: { story: StoryMetadata; featured?: boolean }) {
  const resultColors: Record<string, string> = {
    '1-0': 'rgba(0, 245, 255, 0.3)',
    '0-1': 'rgba(184, 41, 221, 0.3)',
    '1/2-1/2': 'rgba(255, 215, 0, 0.3)',
  }

  return (
    <div
      className={`group rounded-xl overflow-hidden transition-all duration-500 h-full hover:-translate-y-2 ${
        featured ? 'hover:shadow-2xl' : 'hover:shadow-xl'
      }`}
      style={{
        background: 'rgba(26, 26, 46, 0.6)',
        backdropFilter: 'blur(20px)',
        border: featured 
          ? '2px solid rgba(0, 245, 255, 0.5)' 
          : '1px solid rgba(0, 245, 255, 0.2)',
        boxShadow: featured 
          ? '0 0 40px rgba(0, 245, 255, 0.15)' 
          : '0 10px 40px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Link
        href={`/stories/${story._id.toString()}`}
        className="block"
      >
        {/* Header */}
        <div
          className="p-6 text-white relative overflow-hidden"
          style={{
            background: featured
              ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.3) 0%, rgba(184, 41, 221, 0.3) 50%, rgba(255, 215, 0, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(184, 41, 221, 0.1) 100%)',
            borderBottom: '1px solid rgba(0, 245, 255, 0.2)',
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer opacity-20" />
          
          {featured && (
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <span className="text-xl">🌟</span>
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--neon-gold)' }}
              >
                Featured
              </span>
            </div>
          )}
          
          <h2
            className="mb-3 line-clamp-2 relative z-10"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--starlight)',
            }}
          >
            {story.story.title}
          </h2>
          
          <div className="flex flex-wrap gap-2 relative z-10">
            <span
              className="px-2 py-1 rounded text-xs"
              style={{
                background: 'rgba(0, 245, 255, 0.2)',
                color: 'var(--neon-cyan)',
              }}
            >
              {story.story.format}
            </span>
            {story.story.gameMetadata.result && (
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  background: resultColors[story.story.gameMetadata.result] || 'rgba(0, 245, 255, 0.2)',
                  color: 'var(--starlight)',
                }}
              >
                {story.story.gameMetadata.result}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Players */}
            <div className="flex items-center gap-2" style={{ fontSize: '0.875rem' }}>
              <div className="flex-1">
                <div 
                  className="font-medium" 
                  style={{ color: 'var(--neon-cyan)' }}
                >
                  {story.story.gameMetadata.whitePlayer || 'White'}
                </div>
              </div>
              <div 
                className="px-2 py-1 rounded text-xs font-bold"
                style={{ 
                  background: 'rgba(255, 215, 0, 0.2)',
                  color: 'var(--neon-gold)',
                }}
              >
                VS
              </div>
              <div className="flex-1 text-right">
                <div 
                  className="font-medium" 
                  style={{ color: 'var(--neon-purple)' }}
                >
                  {story.story.gameMetadata.blackPlayer || 'Black'}
                </div>
              </div>
            </div>

            {/* Opening */}
            {story.story.gameMetadata.opening && (
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs"
                style={{
                  background: 'rgba(184, 41, 221, 0.1)',
                  border: '1px solid rgba(184, 41, 221, 0.3)',
                  color: 'var(--neon-purple)',
                }}
              >
                <span>♟️</span>
                {story.story.gameMetadata.opening}
              </div>
            )}

            {/* Date */}
            <div 
              className="pt-3 text-xs"
              style={{
                color: 'var(--moon-glow)',
                opacity: 0.7,
                borderTop: '1px solid rgba(0, 245, 255, 0.1)',
              }}
            >
              {new Date(story.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>

          {/* Summary */}
          {story.story.summary && (
            <p
              className="mt-4 line-clamp-3"
              style={{
                fontSize: '0.875rem',
                color: 'var(--moon-glow)',
                lineHeight: '1.6',
              }}
            >
              {story.story.summary}
            </p>
          )}
        </div>
      </Link>

      {/* Share buttons */}
      <div 
        className="px-6 pb-4 pt-2 flex justify-between items-center"
        style={{ borderTop: '1px solid rgba(0, 245, 255, 0.1)' }}
      >
        <ShareButtons
          title={story.story.title}
          url={`${typeof window !== 'undefined' ? window.location.origin : ''}/stories/${story._id.toString()}`}
          summary={story.story.summary}
          size="icon"
        />
      </div>
    </div>
  )
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
      <div className="container mx-auto px-4 py-12 pt-24 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <CosmicLoader />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 pt-24 min-h-screen">
        <div className="max-w-6xl mx-auto text-center">
          <div 
            className="mb-6 text-6xl"
            style={{ filter: 'drop-shadow(0 0 20px var(--neon-pink))' }}
          >
            🌑
          </div>
          <h2
            className="mb-4 text-3xl font-bold"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--neon-pink)',
            }}
          >
            The Void is Silent
          </h2>
          <p
            className="mb-8"
            style={{
              color: 'var(--moon-glow)',
            }}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 rounded-xl font-semibold transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(184, 41, 221, 0.1))',
              border: '1px solid var(--neon-cyan)',
              color: 'var(--neon-cyan)',
              boxShadow: '0 0 20px rgba(0, 245, 255, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 245, 255, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 245, 255, 0.2)'
            }}
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 pt-24 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1
              className="mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 700,
                background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 50%, var(--neon-gold) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Story Archive
            </h1>
            <p
              className="text-xl"
              style={{
                color: 'var(--moon-glow)',
              }}
            >
              Browse the cosmic collection of chess tales
            </p>
          </div>

          <StoryFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={handleResetFilters}
          />

          <div className="text-center py-16">
            <div 
              className="mb-6 text-6xl"
              style={{ filter: 'drop-shadow(0 0 20px var(--neon-purple))' }}
            >
              🔭
            </div>
            <h2
              className="mb-4 text-2xl font-bold"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--neon-cyan)',
              }}
            >
              No Stories Match Your Filters
            </h2>
            <p
              className="mb-8"
              style={{
                color: 'var(--moon-glow)',
              }}
            >
              Try adjusting your filters to explore other constellations
            </p>
            <button
              onClick={handleResetFilters}
              className="px-8 py-4 rounded-xl font-semibold transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(184, 41, 221, 0.1))',
                border: '1px solid var(--neon-cyan)',
                color: 'var(--neon-cyan)',
                boxShadow: '0 0 20px rgba(0, 245, 255, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 245, 255, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 245, 255, 0.2)'
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
    <div className="container mx-auto px-4 py-12 pt-24 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1
            className="mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 50%, var(--neon-gold) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Story Archive
          </h1>
          <p
            className="text-xl mb-2"
            style={{
              color: 'var(--moon-glow)',
            }}
          >
            Browse the cosmic collection of chess tales
          </p>
          <p
            className="text-sm italic"
            style={{
              color: 'var(--moon-glow)',
              opacity: 0.7,
            }}
          >
            {stories.length} stories in the constellation
          </p>
        </div>

        <StoryFilters
          filters={filters}
          onFiltersChange={setFilters}
          onReset={handleResetFilters}
        />

        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <div className="mb-16">
            <h2
              className="mb-8 text-2xl font-bold"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--neon-gold)',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
              }}
            >
              ✨ Featured Stories
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredStories.map((story) => (
                <StoryCard key={story._id.toString()} story={story} featured />
              ))}
            </div>
          </div>
        )}

        {/* Regular Stories */}
        {regularStories.length > 0 && (
          <div>
            <h2
              className="mb-8 text-2xl font-bold"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--neon-cyan)',
              }}
            >
              All Stories ({regularStories.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularStories.map((story) => (
                <StoryCard key={story._id.toString()} story={story} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
