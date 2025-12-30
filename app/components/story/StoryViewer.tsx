'use client'

import { useState } from 'react'
import { Story, ChapterSection } from '@/lib/story-types'
import ChessBoard from '../chess/ChessBoard'

interface StoryViewerProps {
  story: Story
}

type ViewMode = 'chapter' | 'scroll'

const SECTION_LABELS: Record<ChapterSection, string> = {
  'opening': 'Opening',
  'middlegame': 'Middlegame',
  'endgame': 'Endgame',
  'key-moments': 'Key Moments'
}

export default function StoryViewer({ story }: StoryViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('chapter')
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [hoveredParagraph, setHoveredParagraph] = useState<number | null>(null)

  const handleParagraphHover = (index: number) => {
    setHoveredParagraph(index)
  }

  const handleParagraphLeave = () => {
    setHoveredParagraph(null)
  }

  if (!story || !story.chapters || story.chapters.length === 0) {
    return (
      <div
        className="min-h-screen py-12 px-4"
        style={{
          background: 'linear-gradient(to bottom, #F5F0E6 0%, #EEE8D3 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="mb-4"
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: '#2C1810',
            }}
          >
            Story Not Available
          </h2>
          <p
            className="mb-6"
            style={{
              fontSize: 'var(--text-base)',
              color: '#6B3410',
            }}
          >
            The story could not be displayed. Please try uploading your PGN file again.
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
            Upload New Game
          </button>
        </div>
      </div>
    )
  }

  const currentChapterIndexSafe = currentChapterIndex >= 0 && currentChapterIndex < story.chapters.length ? currentChapterIndex : 0
  const currentChapter = story.chapters[currentChapterIndexSafe]

  const nextChapter = () => {
    if (currentChapterIndexSafe < story.chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevChapter = () => {
    if (currentChapterIndexSafe > 0) {
      setCurrentChapterIndex(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderChapterContent = (chapter: typeof story.chapters[0]) => {
    if (!chapter) {
      return <div className="text-center py-12">Chapter not found</div>
    }

    return (
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {chapter.isFlashback && (
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #D4A373 0%, #C19A6B 100%)',
                    color: '#F5F0E6',
                  }}
                >
                  Flashback
                </span>
              )}
              <span
                className="uppercase tracking-wide"
                style={{
                  fontSize: 'var(--text-sm)',
                  color: '#6B3410',
                  fontWeight: 600,
                  letterSpacing: 'var(--tracking-wide)',
                }}
              >
                Chapter {chapter.chapterNumber}
              </span>
            </div>

            <h2
              className="mb-4"
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontSize: 'var(--text-3xl)',
                fontWeight: 700,
                color: '#2C1810',
                letterSpacing: 'var(--tracking-tight)',
              }}
            >
              {chapter.title}
            </h2>

          {chapter.sections.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {chapter.sections.map(section => (
                <span
                  key={section}
                  className="px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-110 hover:shadow-md cursor-default"
                  style={{
                    background: 'linear-gradient(135deg, #C19A6B 0%, #A0522D 100%)',
                    color: '#F5F0E6',
                  }}
                >
                  {SECTION_LABELS[section]}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-none">
          {chapter.content && chapter.content.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              onMouseEnter={() => handleParagraphHover(index)}
              onMouseLeave={handleParagraphLeave}
              className="mb-4 leading-relaxed transition-all duration-300 rounded-lg px-2"
              style={{
                fontSize: 'var(--text-lg)',
                color: '#2C1810',
                lineHeight: 'var(--leading-loose)',
                backgroundColor: hoveredParagraph === index ? 'rgba(193, 154, 107, 0.15)' : 'transparent',
                transform: hoveredParagraph === index ? 'translateX(8px)' : 'translateX(0)',
                borderLeft: hoveredParagraph === index ? '3px solid #C19A6B' : '3px solid transparent',
                cursor: 'pointer',
              }}
            >
              {paragraph}
            </p>
          ))}
          {!chapter.content && (
            <p style={{ fontSize: 'var(--text-base)', color: '#6B3410' }}>
              No content available for this chapter.
            </p>
          )}
        </div>

        {chapter.chessBoards && chapter.chessBoards.length > 0 && (
          <div className="mt-8 mb-6">
            <h3
              className="mb-4"
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontSize: 'var(--text-xl)',
                fontWeight: 700,
                color: '#2C1810',
              }}
            >
              Critical Position
            </h3>
            <div className="flex justify-center">
              <ChessBoard boardState={chapter.chessBoards[0]} />
            </div>
          </div>
        )}

        {chapter.keyMoveReferences && chapter.keyMoveReferences.length > 0 && (
          <div
            className="mt-8 p-4 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, #EEE8D3 0%, #E8C9A0 100%)',
              border: '2px solid #C19A6B',
              boxShadow: '0 4px 16px rgba(44, 24, 16, 0.1)',
            }}
          >
            <h4
              className="mb-3 uppercase tracking-wide"
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                color: '#6B3410',
                letterSpacing: 'var(--tracking-wide)',
              }}
            >
              Key Move References
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {chapter.keyMoveReferences.map((ref, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 rounded transition-all duration-300 hover:bg-white/50 hover:shadow-sm"
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  <span
                    className="mt-0.5"
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: '#C19A6B',
                    }}
                  >
                    {ref.moveNumber}{ref.san}
                  </span>
                  <span style={{ color: '#2C1810' }}>{ref.context}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{
        background: 'linear-gradient(to bottom, #F5F0E6 0%, #EEE8D3 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: '#FFFFFF',
            boxShadow: '0 8px 32px rgba(44, 24, 16, 0.15)',
          }}
        >
          <div
            className="p-8"
            style={{
              background: 'linear-gradient(135deg, #C19A6B 0%, #8B4513 100%)',
              color: '#F5F0E6',
            }}
          >
            <h1
              className="mb-2"
              style={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontSize: 'var(--text-4xl)',
                fontWeight: 700,
                letterSpacing: 'var(--tracking-tight)',
                lineHeight: 'var(--leading-tight)',
              }}
            >
              {story.title}
            </h1>
            <p
              className="mb-4"
              style={{
                fontSize: 'var(--text-lg)',
                color: 'rgba(245, 240, 230, 0.9)',
                lineHeight: 'var(--leading-relaxed)',
              }}
            >
              {story.summary}
            </p>

            <div
              className="flex flex-wrap items-center gap-4"
              style={{ fontSize: 'var(--text-sm)', color: 'rgba(245, 240, 230, 0.8)' }}
            >
              <span
                className="px-3 py-1 rounded-full"
                style={{ background: 'rgba(255, 255, 255, 0.2)' }}
              >
                {story.chapters.length} chapters
              </span>
              <span
                className="px-3 py-1 rounded-full"
                style={{ background: 'rgba(255, 255, 255, 0.2)' }}
              >
                {story.format}
              </span>
              <span>
                {story.gameMetadata.whitePlayer} vs {story.gameMetadata.blackPlayer}
              </span>
              {story.gameMetadata.result && (
                <span style={{ fontWeight: 700 }}>{story.gameMetadata.result}</span>
              )}
            </div>

            {story.storyThemes.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {story.storyThemes.map(theme => (
                  <span
                    key={theme}
                    className="px-3 py-1 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/20 cursor-default"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      fontSize: 'var(--text-sm)',
                    }}
                  >
                    {theme}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div
            className="p-4"
            style={{
              borderBottom: '2px solid #C19A6B',
              background: 'linear-gradient(135deg, #F5F0E6 0%, #EEE8D3 100%)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('chapter')}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    background: viewMode === 'chapter'
                      ? 'linear-gradient(135deg, #C19A6B 0%, #A0522D 100%)'
                      : 'transparent',
                    color: viewMode === 'chapter' ? '#F5F0E6' : '#6B3410',
                    border: '2px solid #C19A6B',
                  }}
                >
                  Chapter Mode
                </button>
                <button
                  onClick={() => setViewMode('scroll')}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    background: viewMode === 'scroll'
                      ? 'linear-gradient(135deg, #C19A6B 0%, #A0522D 100%)'
                      : 'transparent',
                    color: viewMode === 'scroll' ? '#F5F0E6' : '#6B3410',
                    border: '2px solid #C19A6B',
                  }}
                >
                  Full Scroll
                </button>
              </div>

              {viewMode === 'chapter' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevChapter}
                    disabled={currentChapterIndex === 0}
                    className="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'transparent',
                      color: '#6B3410',
                      border: '2px solid #C19A6B',
                    }}
                  >
                    ← Previous
                  </button>
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: '#6B3410',
                      fontWeight: 600,
                    }}
                  >
                    {currentChapterIndex + 1} / {story.chapters.length}
                  </span>
                  <button
                    onClick={nextChapter}
                    disabled={currentChapterIndex === story.chapters.length - 1}
                    className="px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'transparent',
                      color: '#6B3410',
                      border: '2px solid #C19A6B',
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            {viewMode === 'chapter' ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {renderChapterContent(currentChapter)}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {story.chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    style={{
                      borderBottom: '2px solid #E8C9A0',
                      paddingBottom: '3rem',
                    }}
                    className="last:border-0 last:pb-0"
                  >
                    {renderChapterContent(chapter)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {story.pieceLoreUsed.length > 0 && (
            <div
              className="p-8"
              style={{
                background: 'linear-gradient(135deg, #F5F0E6 0%, #EEE8D3 100%)',
                borderTop: '2px solid #C19A6B',
              }}
            >
              <h3
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  color: '#2C1810',
                }}
              >
                Piece Characters
              </h3>
              <div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                style={{ gap: '1rem' }}
              >
                {story.pieceLoreUsed.map((piece, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#8B4513]"
                    style={{
                      background: '#FFFFFF',
                      border: '2px solid #C19A6B',
                      boxShadow: '0 2px 8px rgba(44, 24, 16, 0.08)',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      className="mb-2"
                      style={{
                        fontWeight: 700,
                        color: '#2C1810',
                        fontSize: 'var(--text-base)',
                      }}
                    >
                      {piece.piece}
                    </div>
                    <div
                      className="mb-1"
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: '#6B3410',
                      }}
                    >
                      {piece.personality}
                    </div>
                    {piece.catchphrase && (
                      <div
                        className="mb-2 italic"
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: '#C19A6B',
                        }}
                      >
                        &quot;{piece.catchphrase}&quot;
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: '#8B4513',
                      }}
                    >
                      {piece.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #C19A6B 0%, #A0522D 100%)',
              color: '#F5F0E6',
              boxShadow: '0 4px 16px rgba(44, 24, 16, 0.2)',
            }}
          >
            Back to Top
          </button>
        </div>
      </div>
    </div>
  )
}
