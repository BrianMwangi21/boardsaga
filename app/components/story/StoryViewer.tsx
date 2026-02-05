'use client'

import { useState } from 'react'
import { Story, ChapterSection } from '@/lib/story-types'
import ChessBoard from '../chess/ChessBoard'
import ShareButtons from '../ui/ShareButtons'

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

const SECTION_ICONS: Record<ChapterSection, string> = {
  'opening': '🌅',
  'middlegame': '⚔️',
  'endgame': '♟️',
  'key-moments': '⭐'
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
      <div className="min-h-screen py-12 pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
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
            Story Lost in the Void
          </h2>
          <p
            className="mb-8"
            style={{
              color: 'var(--moon-glow)',
            }}
          >
            The story could not be displayed. Please try uploading your PGN file again.
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
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 245, 255, 0.2)'
              e.currentTarget.style.transform = 'translateY(0)'
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
      return (
        <div 
          className="text-center py-12"
          style={{ color: 'var(--moon-glow)' }}
        >
          Chapter not found
        </div>
      )
    }

    return (
      <div className="max-w-4xl mx-auto">
        {/* Chapter Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {chapter.isFlashback && (
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  background: 'linear-gradient(135deg, rgba(184, 41, 221, 0.3), rgba(255, 215, 0, 0.2))',
                  border: '1px solid rgba(184, 41, 221, 0.5)',
                  color: 'var(--neon-purple)',
                }}
              >
                <span className="mr-1">🌙</span> Flashback
              </span>
            )}
            <span
              className="uppercase tracking-widest text-sm font-bold"
              style={{
                color: 'var(--neon-cyan)',
              }}
            >
              Chapter {chapter.chapterNumber}
            </span>
          </div>

          <h2
            className="mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: 'var(--starlight)',
              letterSpacing: '-0.02em',
            }}
          >
            {chapter.title}
          </h2>

          {chapter.sections.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {chapter.sections.map(section => (
                <span
                  key={section}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    background: 'rgba(0, 245, 255, 0.1)',
                    border: '1px solid rgba(0, 245, 255, 0.3)',
                    color: 'var(--neon-cyan)',
                  }}
                >
                  <span className="mr-1">{SECTION_ICONS[section]}</span>
                  {SECTION_LABELS[section]}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Chapter Content */}
        <div className="max-w-none">
          {chapter.content && chapter.content.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              onMouseEnter={() => handleParagraphHover(index)}
              onMouseLeave={handleParagraphLeave}
              className="mb-6 leading-relaxed transition-all duration-300 rounded-lg px-4 py-2"
              style={{
                fontSize: '1.125rem',
                color: 'var(--moon-glow)',
                lineHeight: '1.8',
                backgroundColor: hoveredParagraph === index ? 'rgba(0, 245, 255, 0.05)' : 'transparent',
                borderLeft: hoveredParagraph === index ? '3px solid var(--neon-cyan)' : '3px solid transparent',
                transform: hoveredParagraph === index ? 'translateX(8px)' : 'translateX(0)',
                cursor: 'pointer',
              }}
            >
              {paragraph}
            </p>
          ))}
          {!chapter.content && (
            <p style={{ fontSize: '1rem', color: 'var(--moon-glow)' }}>
              No content available for this chapter.
            </p>
          )}
        </div>

        {/* Chess Board */}
        {chapter.chessBoards && chapter.chessBoards.length > 0 && (
          <div className="mt-12 mb-8">
            <h3
              className="mb-6 flex items-center gap-2"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--neon-gold)',
              }}
            >
              <span>♟️</span> Critical Position
            </h3>
            <div className="flex justify-center">
              <ChessBoard boardState={chapter.chessBoards[0]} />
            </div>
          </div>
        )}

        {/* Key Move References */}
        {chapter.keyMoveReferences && chapter.keyMoveReferences.length > 0 && (
          <div
            className="mt-12 p-6 rounded-xl"
            style={{
              background: 'rgba(0, 245, 255, 0.05)',
              border: '1px solid rgba(0, 245, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h4
              className="mb-4 uppercase tracking-widest text-sm font-bold flex items-center gap-2"
              style={{
                color: 'var(--neon-cyan)',
              }}
            >
              <span>⚡</span> Key Move References
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {chapter.keyMoveReferences.map((ref, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg transition-all duration-300"
                  style={{ 
                    fontSize: '0.95rem',
                    background: 'rgba(0, 245, 255, 0.05)',
                  }}
                >
                  <span
                    className="mt-0.5 px-2 py-1 rounded font-mono font-bold"
                    style={{
                      background: 'rgba(0, 245, 255, 0.2)',
                      color: 'var(--neon-cyan)',
                    }}
                  >
                    {ref.moveNumber}{ref.san}
                  </span>
                  <span style={{ color: 'var(--moon-glow)' }}>{ref.context}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Story Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(26, 26, 46, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 245, 255, 0.2)',
            boxShadow: '0 0 60px rgba(0, 245, 255, 0.1)',
          }}
        >
          {/* Story Header */}
          <div
            className="p-8 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(184, 41, 221, 0.1) 50%, rgba(255, 215, 0, 0.05) 100%)',
              borderBottom: '1px solid rgba(0, 245, 255, 0.2)',
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 shimmer opacity-20" />
            
            <div className="relative z-10">
              <h1
                className="mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2',
                  background: 'linear-gradient(135deg, var(--starlight) 0%, var(--neon-cyan) 50%, var(--neon-gold) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {story.title}
              </h1>
              
              <p
                className="mb-6"
                style={{
                  fontSize: '1.125rem',
                  color: 'var(--moon-glow)',
                  lineHeight: '1.8',
                }}
              >
                {story.summary}
              </p>

              <div
                className="flex flex-wrap items-center gap-4"
                style={{ fontSize: '0.875rem' }}
              >
                <span
                  className="px-3 py-1 rounded-full"
                  style={{ 
                    background: 'rgba(0, 245, 255, 0.1)',
                    border: '1px solid rgba(0, 245, 255, 0.3)',
                    color: 'var(--neon-cyan)',
                  }}
                >
                  {story.chapters.length} chapters
                </span>
                <span
                  className="px-3 py-1 rounded-full"
                  style={{ 
                    background: 'rgba(184, 41, 221, 0.1)',
                    border: '1px solid rgba(184, 41, 221, 0.3)',
                    color: 'var(--neon-purple)',
                  }}
                >
                  {story.format}
                </span>
                <span style={{ color: 'var(--moon-glow)' }}>
                  <span style={{ color: 'var(--neon-cyan)' }}>{story.gameMetadata.whitePlayer}</span>
                  {' '}vs{' '}
                  <span style={{ color: 'var(--neon-purple)' }}>{story.gameMetadata.blackPlayer}</span>
                </span>
                {story.gameMetadata.result && (
                  <span 
                    className="px-3 py-1 rounded-full font-bold"
                    style={{ 
                      background: story.gameMetadata.result === '1-0' 
                        ? 'rgba(0, 245, 255, 0.2)' 
                        : story.gameMetadata.result === '0-1'
                          ? 'rgba(184, 41, 221, 0.2)'
                          : 'rgba(255, 215, 0, 0.2)',
                      color: story.gameMetadata.result === '1-0' 
                        ? 'var(--neon-cyan)' 
                        : story.gameMetadata.result === '0-1'
                          ? 'var(--neon-purple)'
                          : 'var(--neon-gold)',
                    }}
                  >
                    {story.gameMetadata.result}
                  </span>
                )}
              </div>

              {story.storyThemes.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {story.storyThemes.map(theme => (
                    <span
                      key={theme}
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        background: 'rgba(255, 215, 0, 0.1)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                        color: 'var(--neon-gold)',
                      }}
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* View Mode Controls */}
          <div
            className="p-4"
            style={{
              borderBottom: '1px solid rgba(0, 245, 255, 0.1)',
              background: 'rgba(15, 15, 26, 0.5)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('chapter')}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
                  style={{
                    background: viewMode === 'chapter'
                      ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(184, 41, 221, 0.2))'
                      : 'transparent',
                    color: viewMode === 'chapter' ? 'var(--neon-cyan)' : 'var(--moon-glow)',
                    border: viewMode === 'chapter' ? '1px solid var(--neon-cyan)' : '1px solid rgba(0, 245, 255, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    if (viewMode !== 'chapter') {
                      e.currentTarget.style.borderColor = 'var(--neon-cyan)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (viewMode !== 'chapter') {
                      e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.2)'
                    }
                  }}
                >
                  📖 Chapter Mode
                </button>
                <button
                  onClick={() => setViewMode('scroll')}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
                  style={{
                    background: viewMode === 'scroll'
                      ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(184, 41, 221, 0.2))'
                      : 'transparent',
                    color: viewMode === 'scroll' ? 'var(--neon-cyan)' : 'var(--moon-glow)',
                    border: viewMode === 'scroll' ? '1px solid var(--neon-cyan)' : '1px solid rgba(0, 245, 255, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    if (viewMode !== 'scroll') {
                      e.currentTarget.style.borderColor = 'var(--neon-cyan)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (viewMode !== 'scroll') {
                      e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.2)'
                    }
                  }}
                >
                  📜 Full Scroll
                </button>
              </div>

              {viewMode === 'chapter' && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={prevChapter}
                    disabled={currentChapterIndex === 0}
                    className="px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'transparent',
                      color: 'var(--neon-cyan)',
                      border: '1px solid rgba(0, 245, 255, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      if (currentChapterIndex !== 0) {
                        e.currentTarget.style.background = 'rgba(0, 245, 255, 0.1)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    ← Previous
                  </button>
                  <span
                    className="font-bold"
                    style={{
                      color: 'var(--neon-cyan)',
                    }}
                  >
                    {currentChapterIndex + 1} / {story.chapters.length}
                  </span>
                  <button
                    onClick={nextChapter}
                    disabled={currentChapterIndex === story.chapters.length - 1}
                    className="px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'transparent',
                      color: 'var(--neon-cyan)',
                      border: '1px solid rgba(0, 245, 255, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      if (currentChapterIndex !== story.chapters.length - 1) {
                        e.currentTarget.style.background = 'rgba(0, 245, 255, 0.1)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Story Content */}
          <div className="p-8">
            {viewMode === 'chapter' ? (
              <div 
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                key={currentChapterIndex}
              >
                {renderChapterContent(currentChapter)}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                {story.chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    style={{
                      borderBottom: '1px solid rgba(0, 245, 255, 0.1)',
                      paddingBottom: '4rem',
                    }}
                    className="last:border-0 last:pb-0"
                  >
                    {renderChapterContent(chapter)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Piece Lore Section */}
          {story.pieceLoreUsed.length > 0 && (
            <div
              className="p-8"
              style={{
                background: 'rgba(15, 15, 26, 0.5)',
                borderTop: '1px solid rgba(0, 245, 255, 0.1)',
              }}
            >
              <h3
                className="mb-6 text-xl font-bold flex items-center gap-2"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'var(--neon-gold)',
                }}
              >
                <span>🎭</span> Piece Characters
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {story.pieceLoreUsed.map((piece, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'rgba(26, 26, 46, 0.6)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 245, 255, 0.2)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--neon-cyan)'
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 245, 255, 0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.2)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div
                      className="mb-2 font-bold"
                      style={{
                        color: 'var(--neon-cyan)',
                        fontSize: '1rem',
                      }}
                    >
                      {piece.piece}
                    </div>
                    <div
                      className="mb-1"
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--moon-glow)',
                      }}
                    >
                      {piece.personality}
                    </div>
                    {piece.catchphrase && (
                      <div
                        className="mb-2 italic text-xs"
                        style={{
                          color: 'var(--neon-gold)',
                        }}
                      >
                        &quot;{piece.catchphrase}&quot;
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--moon-glow)',
                        opacity: 0.8,
                      }}
                    >
                      {piece.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="p-8" style={{ borderTop: '1px solid rgba(0, 245, 255, 0.1)' }}>
            <ShareButtons
              title={story.title}
              summary={story.summary}
              size="page"
            />
          </div>

          {/* AI Disclaimer */}
          <div
            className="p-6 mx-auto max-w-4xl"
            style={{
              background: 'rgba(0, 245, 255, 0.05)',
              borderTop: '1px solid rgba(0, 245, 255, 0.1)',
              borderRadius: '1rem',
              margin: '2rem',
            }}
          >
            <div className="flex items-start gap-3">
              <span 
                className="text-2xl"
                style={{ filter: 'drop-shadow(0 0 10px var(--neon-gold))' }}
              >
                ⚠️
              </span>
              <div>
                <h4
                  className="mb-2 font-semibold"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: 'var(--neon-gold)',
                    fontSize: '1rem',
                  }}
                >
                  AI-Generated Content
                </h4>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--moon-glow)',
                    lineHeight: '1.6',
                    opacity: 0.8,
                  }}
                >
                  This story is generated by AI. While we use Stockfish chess engine for move analysis and evaluations, 
                  AI can occasionally make mistakes or misinterpret tactical themes. The story should be enjoyed as a 
                  creative interpretation, not a definitive analysis.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1), rgba(184, 41, 221, 0.1))',
              border: '1px solid var(--neon-cyan)',
              color: 'var(--neon-cyan)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 245, 255, 0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            ↑ Back to Top
          </button>
        </div>
      </div>
    </div>
  )
}
