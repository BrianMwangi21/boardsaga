'use client'

import { useState, useEffect } from 'react'

interface FlashCardProps {
  title: string
  content: string
  icon?: string
  color?: string
}

interface StoryLoadingProps {
  isGenerating?: boolean
}

const PIECE_LORE = [
  {
    piece: '♙ Pawn',
    lore: '"One step at a time, toward glory." The humble soldiers who dream of becoming queens.',
    color: 'from-amber-100 to-amber-200'
  },
  {
    piece: '♜ Rook',
    lore: '"I hold the line." Guardians of territory, masters of straight lines and unwavering resolve.',
    color: 'from-stone-100 to-stone-200'
  },
  {
    piece: '♞ Knight',
    lore: '"Predictability is for the slow." The unpredictable warriors dancing through chaos in L-shaped leaps.',
    color: 'from-purple-100 to-purple-200'
  },
  {
    piece: '♝ Bishop',
    lore: '"I walk the diagonal path to truth." Spiritual guides gliding diagonally like mystics of the board.',
    color: 'from-blue-100 to-blue-200'
  },
  {
    piece: '♛ Queen',
    lore: '"My reach knows no boundaries." Sovereign power, flexible commander combining rook and bishop.',
    color: 'from-rose-100 to-rose-200'
  },
  {
    piece: '♚ King',
    lore: '"The battle is lost when I fall." The crown that must not fall, lonely burden of sixty-four squares.',
    color: 'from-yellow-100 to-yellow-200'
  }
]

const ANALYSIS_SNIPPETS = [
  {
    title: 'Analyzing Moves',
    content: 'Examining each strategic decision, from opening gambits to final checkmate.',
    icon: '🎯'
  },
  {
    title: 'Identifying Key Moments',
    content: 'Finding the turning points, brilliancies, and critical sacrifices.',
    icon: '⚡'
  },
  {
    title: 'Uncovering Player Styles',
    content: 'Reading the strategic fingerprints of white and black.',
    icon: '🧠'
  },
  {
    title: 'Weaving Narratives',
    content: 'Combining piece lore with game moments to craft compelling stories.',
    icon: '📖'
  },
  {
    title: 'Creating Characters',
    content: 'Each piece has a story - bringing their personalities to life.',
    icon: '🎭'
  },
  {
    title: 'Crafting Chapters',
    content: 'Building the epic tale from opening to endgame.',
    icon: '📚'
  }
]

function FlashCard({ title, content, icon, color = 'from-gray-100 to-gray-200' }: FlashCardProps) {
  return (
    <div className={`
      w-full max-w-md p-6 rounded-2xl shadow-lg 
      bg-gradient-to-br ${color}
      border-2 border-gray-300
      transform transition-all duration-300 hover:scale-105
      animate-pulse-slow
    `}>
      <div className="flex items-start gap-3">
        {icon && (
          <span className="text-3xl flex-shrink-0">{icon}</span>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  )
}

export default function StoryLoading({ isGenerating = true }: StoryLoadingProps) {
  const [currentCard, setCurrentCard] = useState(0)
  const [cardType, setCardType] = useState<'lore' | 'analysis'>('lore')
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!isGenerating) return

    const interval = setInterval(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        setCardType(prev => prev === 'lore' ? 'analysis' : 'lore')
        setCurrentCard(prev => {
          const maxLength = cardType === 'lore' ? PIECE_LORE.length : ANALYSIS_SNIPPETS.length
          return (prev + 1) % maxLength
        })
        setIsVisible(true)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [isGenerating, cardType])

  if (!isGenerating) return null

  const currentLore = PIECE_LORE[currentCard % PIECE_LORE.length]
  const currentAnalysis = ANALYSIS_SNIPPETS[currentCard % ANALYSIS_SNIPPETS.length]

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-block animate-spin mb-4">
          <svg className="w-12 h-12 text-amber-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Your Chess Story</h2>
        <p className="text-gray-600">The pieces are weaving their tale...</p>
      </div>

      <div className={`
        transition-all duration-300
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}>
        {cardType === 'lore' ? (
          <FlashCard
            title={currentLore.piece}
            content={currentLore.lore}
            color={currentLore.color}
          />
        ) : (
          <FlashCard
            title={currentAnalysis.title}
            content={currentAnalysis.content}
            icon={currentAnalysis.icon}
            color="from-indigo-100 to-indigo-200"
          />
        )}
      </div>

      <div className="mt-8 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${i === currentCard % 3 ? 'bg-amber-500 w-8' : 'bg-gray-300'}
            `}
          />
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        This may take a moment - great stories need time to unfold
      </p>
    </div>
  )
}
