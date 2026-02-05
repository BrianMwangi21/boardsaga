'use client'

import { useState } from 'react'

export type DateRange = '7days' | '30days' | 'alltime' | 'custom'
export type ResultFilter = 'all' | '1-0' | '0-1' | '1/2-1/2'
export type FormatFilter = 'all' | 'short' | 'detailed' | 'epic'
export type SortOption = 'newest' | 'oldest'

export interface StoryFiltersState {
  search: string
  dateRange: DateRange
  customDateFrom: Date | null
  customDateTo: Date | null
  result: ResultFilter
  format: FormatFilter
  sort: SortOption
}

export interface StoryFiltersProps {
  filters: StoryFiltersState
  onFiltersChange: (filters: StoryFiltersState) => void
  onReset: () => void
}

export default function StoryFilters({
  filters,
  onFiltersChange,
  onReset,
}: StoryFiltersProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value })
  }

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      dateRange: e.target.value as DateRange,
    })
  }

  const handleResultChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      result: e.target.value as ResultFilter,
    })
  }

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      format: e.target.value as FormatFilter,
    })
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      sort: e.target.value as SortOption,
    })
  }

  const handleCustomDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      customDateFrom: e.target.value ? new Date(e.target.value) : null,
    })
  }

  const handleCustomDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      customDateTo: e.target.value ? new Date(e.target.value) : null,
    })
  }

  const activeFiltersCount = [
    filters.search,
    filters.dateRange !== 'alltime' ? filters.dateRange : '',
    filters.result !== 'all' ? filters.result : '',
    filters.format !== 'all' ? filters.format : '',
  ].filter(Boolean).length

  const inputStyle = {
    background: 'rgba(26, 26, 46, 0.6)',
    border: '1px solid rgba(0, 245, 255, 0.3)',
    color: 'var(--starlight)',
    backdropFilter: 'blur(10px)',
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-xl font-bold"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--neon-cyan)',
          }}
        >
          Filter Stories
        </h2>
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="md:hidden px-4 py-2 rounded-lg font-medium transition-all duration-300"
          style={{
            background: 'rgba(0, 245, 255, 0.1)',
            border: '1px solid rgba(0, 245, 255, 0.3)',
            color: 'var(--neon-cyan)',
          }}
        >
          {isMobileFiltersOpen ? 'Hide Filters' : `Filters ${activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}`}
        </button>
      </div>

      <div
        className={`${isMobileFiltersOpen ? 'block' : 'hidden'} md:block rounded-xl p-6`}
        style={{
          background: 'rgba(26, 26, 46, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 245, 255, 0.2)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="space-y-6">
          {/* Search */}
          <div>
            <label
              className="block mb-2 font-medium text-sm"
              style={{ color: 'var(--neon-cyan)' }}
            >
              Search
            </label>
            <input
              type="text"
              placeholder="Search players, titles, keywords..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--neon-cyan)'
                e.target.style.boxShadow = '0 0 20px rgba(0, 245, 255, 0.2)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(0, 245, 255, 0.3)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Filters Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div>
              <label
                className="block mb-2 font-medium text-sm"
                style={{ color: 'var(--neon-cyan)' }}
              >
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={handleDateRangeChange}
                className="w-full px-4 py-3 rounded-lg focus:outline-none cursor-pointer transition-all duration-300"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--neon-cyan)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 245, 255, 0.3)'
                }}
              >
                <option value="alltime" style={{ background: '#1a1a2e' }}>All Time</option>
                <option value="7days" style={{ background: '#1a1a2e' }}>Last 7 Days</option>
                <option value="30days" style={{ background: '#1a1a2e' }}>Last 30 Days</option>
                <option value="custom" style={{ background: '#1a1a2e' }}>Custom Range</option>
              </select>
            </div>

            {/* Result */}
            <div>
              <label
                className="block mb-2 font-medium text-sm"
                style={{ color: 'var(--neon-cyan)' }}
              >
                Result
              </label>
              <select
                value={filters.result}
                onChange={handleResultChange}
                className="w-full px-4 py-3 rounded-lg focus:outline-none cursor-pointer transition-all duration-300"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--neon-cyan)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 245, 255, 0.3)'
                }}
              >
                <option value="all" style={{ background: '#1a1a2e' }}>All Results</option>
                <option value="1-0" style={{ background: '#1a1a2e' }}>White Wins (1-0)</option>
                <option value="0-1" style={{ background: '#1a1a2e' }}>Black Wins (0-1)</option>
                <option value="1/2-1/2" style={{ background: '#1a1a2e' }}>Draw (1/2-1/2)</option>
              </select>
            </div>

            {/* Format */}
            <div>
              <label
                className="block mb-2 font-medium text-sm"
                style={{ color: 'var(--neon-cyan)' }}
              >
                Format
              </label>
              <select
                value={filters.format}
                onChange={handleFormatChange}
                className="w-full px-4 py-3 rounded-lg focus:outline-none cursor-pointer transition-all duration-300"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--neon-cyan)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 245, 255, 0.3)'
                }}
              >
                <option value="all" style={{ background: '#1a1a2e' }}>All Formats</option>
                <option value="short" style={{ background: '#1a1a2e' }}>Short</option>
                <option value="detailed" style={{ background: '#1a1a2e' }}>Detailed</option>
                <option value="epic" style={{ background: '#1a1a2e' }}>Epic</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label
                className="block mb-2 font-medium text-sm"
                style={{ color: 'var(--neon-cyan)' }}
              >
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={handleSortChange}
                className="w-full px-4 py-3 rounded-lg focus:outline-none cursor-pointer transition-all duration-300"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--neon-cyan)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 245, 255, 0.3)'
                }}
              >
                <option value="newest" style={{ background: '#1a1a2e' }}>Newest First</option>
                <option value="oldest" style={{ background: '#1a1a2e' }}>Oldest First</option>
              </select>
            </div>
          </div>

          {/* Custom Date Range */}
          {filters.dateRange === 'custom' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block mb-2 font-medium text-sm"
                  style={{ color: 'var(--neon-cyan)' }}
                >
                  From Date
                </label>
                <input
                  type="date"
                  value={
                    filters.customDateFrom
                      ? filters.customDateFrom.toISOString().split('T')[0]
                      : ''
                  }
                  onChange={handleCustomDateFromChange}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--neon-cyan)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0, 245, 255, 0.3)'
                  }}
                />
              </div>
              <div>
                <label
                  className="block mb-2 font-medium text-sm"
                  style={{ color: 'var(--neon-cyan)' }}
                >
                  To Date
                </label>
                <input
                  type="date"
                  value={
                    filters.customDateTo
                      ? filters.customDateTo.toISOString().split('T')[0]
                      : ''
                  }
                  onChange={handleCustomDateToChange}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--neon-cyan)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0, 245, 255, 0.3)'
                  }}
                />
              </div>
            </div>
          )}

          {/* Reset Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onReset}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(184, 41, 221, 0.1))',
                border: '1px solid var(--neon-cyan)',
                color: 'var(--neon-cyan)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 245, 255, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
