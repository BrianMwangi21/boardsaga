'use client'

import { useState } from 'react'
import { COLORS, GRADIENTS, SHADOWS } from '@/lib/theme'

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

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2
          style={{
            fontFamily: 'var(--font-serif), Georgia, serif',
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: COLORS.veryDarkBrown,
          }}
        >
          Filter Stories
        </h2>
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="md:hidden px-4 py-2 rounded-lg font-medium"
          style={{
            background: GRADIENTS.button,
            color: COLORS.cream,
            boxShadow: SHADOWS.small,
          }}
        >
          {isMobileFiltersOpen ? 'Hide Filters' : `Filters ${activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}`}
        </button>
      </div>

      <div
        className={`${isMobileFiltersOpen ? 'block' : 'hidden'} md:block rounded-xl p-6`}
        style={{
          background: COLORS.white,
          boxShadow: SHADOWS.medium,
          border: '2px solid COLORS.lightParchment'.replace('COLORS.', COLORS.lightParchment),
        }}
      >
        <div className="space-y-4">
          <div>
            <label
              className="block mb-2 font-medium"
              style={{ color: COLORS.veryDarkBrown }}
            >
              Search
            </label>
            <input
              type="text"
              placeholder="Search players, titles, keywords..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
              style={{
                borderColor: COLORS.lightParchment,
                color: COLORS.veryDarkBrown,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.darkWood
              }}
              onBlur={(e) => {
                e.target.style.borderColor = COLORS.lightParchment
              }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                className="block mb-2 font-medium"
                style={{ color: COLORS.veryDarkBrown }}
              >
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={handleDateRangeChange}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none cursor-pointer transition-colors"
                style={{
                  borderColor: COLORS.lightParchment,
                  color: COLORS.veryDarkBrown,
                  backgroundColor: COLORS.white,
                }}
              >
                <option value="alltime">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div>
              <label
                className="block mb-2 font-medium"
                style={{ color: COLORS.veryDarkBrown }}
              >
                Result
              </label>
              <select
                value={filters.result}
                onChange={handleResultChange}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none cursor-pointer transition-colors"
                style={{
                  borderColor: COLORS.lightParchment,
                  color: COLORS.veryDarkBrown,
                  backgroundColor: COLORS.white,
                }}
              >
                <option value="all">All Results</option>
                <option value="1-0">White Wins (1-0)</option>
                <option value="0-1">Black Wins (0-1)</option>
                <option value="1/2-1/2">Draw (1/2-1/2)</option>
              </select>
            </div>

            <div>
              <label
                className="block mb-2 font-medium"
                style={{ color: COLORS.veryDarkBrown }}
              >
                Format
              </label>
              <select
                value={filters.format}
                onChange={handleFormatChange}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none cursor-pointer transition-colors"
                style={{
                  borderColor: COLORS.lightParchment,
                  color: COLORS.veryDarkBrown,
                  backgroundColor: COLORS.white,
                }}
              >
                <option value="all">All Formats</option>
                <option value="short">Short</option>
                <option value="detailed">Detailed</option>
                <option value="epic">Epic</option>
              </select>
            </div>

            <div>
              <label
                className="block mb-2 font-medium"
                style={{ color: COLORS.veryDarkBrown }}
              >
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={handleSortChange}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none cursor-pointer transition-colors"
                style={{
                  borderColor: COLORS.lightParchment,
                  color: COLORS.veryDarkBrown,
                  backgroundColor: COLORS.white,
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {filters.dateRange === 'custom' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block mb-2 font-medium"
                  style={{ color: COLORS.veryDarkBrown }}
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
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                  style={{
                    borderColor: COLORS.lightParchment,
                    color: COLORS.veryDarkBrown,
                  }}
                />
              </div>
              <div>
                <label
                  className="block mb-2 font-medium"
                  style={{ color: COLORS.veryDarkBrown }}
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
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                  style={{
                    borderColor: COLORS.lightParchment,
                    color: COLORS.veryDarkBrown,
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={onReset}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: GRADIENTS.button,
                color: COLORS.cream,
                boxShadow: SHADOWS.small,
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
