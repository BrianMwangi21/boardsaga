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

  const currentChapter = story.chapters[currentChapterIndex]

  const nextChapter = () => {
    if (currentChapterIndex < story.chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderChapterContent = (chapter: typeof story.chapters[0]) => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {chapter.isFlashback && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              Flashback
            </span>
          )}
          <span className="text-sm text-gray-500 uppercase tracking-wide">
            Chapter {chapter.chapterNumber}
          </span>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {chapter.title}
        </h2>
        
        {chapter.sections.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {chapter.sections.map(section => (
              <span
                key={section}
                className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
              >
                {SECTION_LABELS[section]}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="prose prose-lg prose-amber max-w-none">
        {chapter.content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {chapter.chessBoards && chapter.chessBoards.length > 0 && (
        <div className="mt-8 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Critical Position</h3>
          <div className="flex justify-center">
            <ChessBoard boardState={chapter.chessBoards[0]} />
          </div>
        </div>
      )}

      {chapter.keyMoveReferences && chapter.keyMoveReferences.length > 0 && (
        <div className="mt-8 p-4 bg-stone-100 rounded-lg border-2 border-stone-300">
          <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
            Key Move References
          </h4>
          <div className="space-y-2">
            {chapter.keyMoveReferences.map((ref, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <span className="font-mono font-bold text-amber-600 mt-0.5">
                  {ref.moveNumber}{ref.san}
                </span>
                <span className="text-gray-600">{ref.context}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{story.title}</h1>
            <p className="text-lg text-amber-100 mb-4">{story.summary}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-amber-100">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {story.chapters.length} chapters
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {story.format}
              </span>
              <span>
                {story.gameMetadata.whitePlayer} vs {story.gameMetadata.blackPlayer}
              </span>
              {story.gameMetadata.result && (
                <span className="font-bold">{story.gameMetadata.result}</span>
              )}
            </div>

            {story.storyThemes.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {story.storyThemes.map(theme => (
                  <span
                    key={theme}
                    className="px-3 py-1 bg-white/10 rounded-full text-sm"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('chapter')}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-colors
                    ${viewMode === 'chapter'
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                  `}
                >
                  Chapter Mode
                </button>
                <button
                  onClick={() => setViewMode('scroll')}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-colors
                    ${viewMode === 'scroll'
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                  `}
                >
                  Full Scroll
                </button>
              </div>

              {viewMode === 'chapter' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevChapter}
                    disabled={currentChapterIndex === 0}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentChapterIndex + 1} / {story.chapters.length}
                  </span>
                  <button
                    onClick={nextChapter}
                    disabled={currentChapterIndex === story.chapters.length - 1}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              <div className="space-y-12">
                {story.chapters.map((chapter, index) => (
                  <div key={chapter.id} className="border-b border-gray-200 pb-12 last:border-0 last:pb-0">
                    {renderChapterContent(chapter)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {story.pieceLoreUsed.length > 0 && (
            <div className="p-8 bg-stone-50 border-t border-stone-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Piece Characters
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {story.pieceLoreUsed.map((piece, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-lg border-2 border-stone-300 shadow-sm"
                  >
                    <div className="font-bold text-gray-900 mb-2">{piece.piece}</div>
                    <div className="text-sm text-gray-700 mb-1">{piece.personality}</div>
                    {piece.catchphrase && (
                      <div className="text-xs text-amber-700 italic mb-2">
                        "{piece.catchphrase}"
                      </div>
                    )}
                    <div className="text-sm text-gray-600">{piece.role}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Back to Top
          </button>
        </div>
      </div>
    </div>
  )
}
