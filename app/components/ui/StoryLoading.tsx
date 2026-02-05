'use client'

import { useState, useEffect } from 'react'

interface FlashCardProps {
  title: string
  content: string
  icon?: string
  gradient?: string
}

interface StoryLoadingProps {
  isGenerating?: boolean
}

const PIECE_LORE = [
  {
    piece: '♙ Pawn',
    lore: '"From the depths of the void, we ascend." The humble souls who dream of becoming stars.',
    gradient: 'from-cyan-500/20 to-purple-500/20'
  },
  {
    piece: '♜ Rook',
    lore: '"I am the wall against entropy." Guardians of cosmic order, masters of infinite straight lines.',
    gradient: 'from-purple-500/20 to-pink-500/20'
  },
  {
    piece: '♞ Knight',
    lore: '"Chaos is merely pattern unrecognized." The quantum dancers moving through probability.',
    gradient: 'from-pink-500/20 to-gold-500/20'
  },
  {
    piece: '♝ Bishop',
    lore: '"The diagonal path reveals truth." Mystics who walk between dimensions on sacred angles.',
    gradient: 'from-gold-500/20 to-cyan-500/20'
  },
  {
    piece: '♛ Queen',
    lore: '"My dominion spans all directions." Sovereign of spacetime, wielder of infinite possibility.',
    gradient: 'from-cyan-500/20 via-purple-500/20 to-pink-500/20'
  },
  {
    piece: '♚ King',
    lore: '"The universe trembles when I fall." The singularity around which all orbits.',
    gradient: 'from-gold-400/30 to-yellow-500/30'
  }
]

const ANALYSIS_SNIPPETS = [
  {
    title: 'Analyzing Moves',
    content: 'Decoding strategic decisions across the spacetime of 64 squares.',
    icon: '🔭'
  },
  {
    title: 'Identifying Key Moments',
    content: 'Detecting singularities, brilliancies, and critical gravitational shifts.',
    icon: '⚡'
  },
  {
    title: 'Uncovering Player Styles',
    content: 'Reading the unique cosmic signatures of white and black.',
    icon: '🌌'
  },
  {
    title: 'Weaving Narratives',
    content: 'Combining piece lore with stellar events to craft cosmic tales.',
    icon: '📖'
  },
  {
    title: 'Creating Characters',
    content: 'Each piece is a constellation - bringing their stories to life.',
    icon: '✨'
  },
  {
    title: 'Crafting Chapters',
    content: 'Building the epic from the Big Bang opening to the endgame singularity.',
    icon: '🌠'
  }
]

function FlashCard({ title, content, icon, gradient = 'from-cyan-500/20 to-purple-500/20' }: FlashCardProps) {
  return (
    <div
      className={`w-full max-w-md p-8 rounded-2xl transform transition-all duration-500 hover:scale-105 relative overflow-hidden bg-gradient-to-br ${gradient}`}
      style={{
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 245, 255, 0.3)',
        boxShadow: '0 0 40px rgba(0, 245, 255, 0.1), inset 0 0 40px rgba(255,255,255,0.02)',
      }}
    >
      {/* Animated shimmer overlay */}
      <div className="absolute inset-0 shimmer opacity-30" />
      
      <div className="flex items-start gap-4 relative z-10">
        {icon && (
          <span className="text-4xl flex-shrink-0" style={{ filter: 'drop-shadow(0 0 10px rgba(0,245,255,0.5))' }}>
            {icon}
          </span>
        )}
        <div className="flex-1">
          <h3
            className="mb-3 text-xl font-semibold"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--neon-cyan)',
              textShadow: '0 0 20px rgba(0, 245, 255, 0.3)',
            }}
          >
            {title}
          </h3>
          <p
            className="leading-relaxed"
            style={{
              color: 'var(--moon-glow)',
              fontSize: '0.95rem',
            }}
          >
            {content}
          </p>
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
      {/* Cosmic Spinner */}
      <div className="relative mb-8">
        {/* Outer glow */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,245,255,0.3) 0%, transparent 70%)',
            transform: 'scale(2)',
            filter: 'blur(10px)',
          }}
        />
        
        {/* Spinning rings */}
        <div className="relative w-20 h-20">
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
          
          {/* Center icon */}
          <div 
            className="absolute inset-0 flex items-center justify-center text-3xl"
            style={{ animation: 'float 3s ease-in-out infinite' }}
          >
            ✨
          </div>
        </div>
      </div>

      {/* Title */}
      <h2
        className="mb-3 text-3xl font-bold text-center"
        style={{
          fontFamily: "'Playfair Display', serif",
          background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 50%, var(--neon-gold) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Generating Your Chess Story
      </h2>
      <p
        className="mb-8 text-center"
        style={{
          color: 'var(--moon-glow)',
          fontSize: '1.1rem',
        }}
      >
        The constellations are aligning...
      </p>

      {/* Flash Card */}
      <div
        className="transition-all duration-500"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        }}
      >
        {cardType === 'lore' ? (
          <FlashCard
            title={currentLore.piece}
            content={currentLore.lore}
            gradient={currentLore.gradient}
          />
        ) : (
          <FlashCard
            title={currentAnalysis.title}
            content={currentAnalysis.content}
            icon={currentAnalysis.icon}
          />
        )}
      </div>

      {/* Progress Indicators */}
      <div className="mt-8 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width: i === currentCard % 6 ? '32px' : '8px',
              height: '8px',
              background: i === currentCard % 6 
                ? 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))' 
                : 'rgba(0, 245, 255, 0.2)',
              boxShadow: i === currentCard % 6 ? '0 0 10px var(--neon-cyan)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Subtitle */}
      <p
        className="mt-6 text-sm italic text-center"
        style={{
          color: 'var(--moon-glow)',
          opacity: 0.7,
          fontFamily: "'Playfair Display', serif",
        }}
      >
        Great stories, like stars, need time to shine
      </p>

      {/* Disclaimer */}
      <div
        className="mt-6 p-4 rounded-xl max-w-md mx-auto"
        style={{
          background: 'rgba(0, 245, 255, 0.05)',
          border: '1px solid rgba(0, 245, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="flex items-start gap-3">
          <span className="text-lg" style={{ filter: 'drop-shadow(0 0 5px var(--neon-gold))' }}>⚠️</span>
          <div>
            <p
              className="text-xs leading-relaxed"
              style={{
                color: 'var(--moon-glow)',
                opacity: 0.8,
              }}
            >
              AI may occasionally drift through nebulae of inaccuracy, but Stockfish engine analysis keeps us grounded in truth.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
