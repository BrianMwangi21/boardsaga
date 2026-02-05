'use client'

import { useState, useEffect } from 'react'
import PGNUploader from './components/pgn/PGNUploader'
import { ParsedGame } from '@/lib/pgn-parser'
import { StockfishClient, type GameEngineData } from '@/lib/stockfish-client'
import StoryLoading from './components/ui/StoryLoading'

type AppState = 'upload' | 'analyzing-engine' | 'analyzing' | 'generating' | 'story' | 'error'
type EngineStatus = 'running' | 'failed' | 'completed'

// Animated text component for the tagline
function AnimatedTagline() {
  const [text, setText] = useState('')
  const fullText = 'Where every move becomes mythology'
  
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <span className="relative">
      {text}
      <span 
        className="inline-block w-0.5 h-5 ml-1 align-middle"
        style={{
          background: 'var(--neon-cyan)',
          animation: 'blink 1s infinite',
          boxShadow: '0 0 10px var(--neon-cyan)',
        }}
      />
    </span>
  )
}

// Floating chess pieces component - deterministic values to prevent hydration mismatch
function FloatingPieces() {
  const pieces = [
    { symbol: '♔', size: 3.2, left: 10, top: 20 },
    { symbol: '♕', size: 2.8, left: 25, top: 45 },
    { symbol: '♖', size: 3.5, left: 40, top: 25 },
    { symbol: '♗', size: 2.5, left: 55, top: 50 },
    { symbol: '♘', size: 3.0, left: 70, top: 30 },
    { symbol: '♙', size: 2.7, left: 85, top: 55 },
  ]
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {pieces.map((piece, i) => (
        <div
          key={i}
          className={i % 2 === 0 ? 'float' : 'float-delayed'}
          style={{
            position: 'absolute',
            fontSize: `${piece.size}rem`,
            left: `${piece.left}%`,
            top: `${piece.top}%`,
            color: i % 2 === 0 ? 'rgba(0, 245, 255, 0.1)' : 'rgba(184, 41, 221, 0.1)',
            textShadow: i % 2 === 0 
              ? '0 0 30px rgba(0, 245, 255, 0.3)' 
              : '0 0 30px rgba(184, 41, 221, 0.3)',
            animationDelay: `${i * 0.5}s`,
          }}
        >
          {piece.symbol}
        </div>
      ))}
    </div>
  )
}

// Analysis step indicator
function AnalysisStep({ step, currentStep, label }: { step: number; currentStep: number; label: string }) {
  const isActive = step === currentStep
  const isCompleted = step < currentStep
  
  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500"
        style={{
          background: isActive 
            ? 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))'
            : isCompleted 
              ? 'rgba(0, 245, 255, 0.2)' 
              : 'rgba(255, 255, 255, 0.1)',
          border: isActive 
            ? '2px solid var(--neon-cyan)' 
            : isCompleted 
              ? '2px solid rgba(0, 245, 255, 0.5)' 
              : '2px solid rgba(255, 255, 255, 0.2)',
          color: isActive || isCompleted ? 'var(--starlight)' : 'var(--moon-glow)',
          boxShadow: isActive ? '0 0 20px rgba(0, 245, 255, 0.5)' : 'none',
        }}
      >
        {isCompleted ? '✓' : step}
      </div>
      <span 
        className="text-sm transition-all duration-300"
        style={{
          color: isActive ? 'var(--neon-cyan)' : isCompleted ? 'var(--moon-glow)' : 'rgba(201, 198, 224, 0.5)',
        }}
      >
        {label}
      </span>
    </div>
  )
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>('upload')
  const [error, setError] = useState<string | null>(null)
  const [engineStatus, setEngineStatus] = useState<EngineStatus>('running')
  const [analysisStep, setAnalysisStep] = useState(0)

  const handleFileSelect = async (file: File) => {
    setAppState('analyzing')
    setError(null)
    setAnalysisStep(1)

    try {
      const text = await file.text()

      const parseResponse = await fetch('/api/parse-pgn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pgn: text }),
      })

      const parseResult = await parseResponse.json()

      if (!parseResponse.ok) {
        throw new Error(parseResult.error || 'Failed to parse PGN')
      }

      const gameData = parseResult.data

      const checkPgnResponse = await fetch('/api/stories/check-pgn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pgn: text }),
      })

      const checkPgnResult = await checkPgnResponse.json()

      if (checkPgnResult.exists && checkPgnResult.story) {
        window.location.href = `/stories/${checkPgnResult.story._id}`
        return
      }

      setAppState('analyzing-engine')
      setEngineStatus('running')
      setAnalysisStep(2)

      const stockfishClient = new StockfishClient()

      try {
        const engineTimeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Stockfish analysis timeout')), 60000)
        )

        const engineData = await Promise.race([
          stockfishClient.analyzeGame(gameData),
          engineTimeout
        ])

        setEngineStatus('completed')
        await generateStory(gameData, engineData)
      } catch (engineError) {
        console.warn('Stockfish analysis failed, continuing without engine data:', engineError)
        setEngineStatus('failed')
        await generateStory(gameData, null)
      } finally {
        stockfishClient.terminate()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setAppState('error')
    }
  }

  const generateStory = async (gameData: ParsedGame, engineData: GameEngineData | null) => {
    try {
      const serializedEngineData = engineData ? {
        pgnHash: engineData.pgnHash,
        positions: engineData.positions,
        evaluations: engineData.evaluations,
        keyPositions: engineData.keyPositions,
      } : null

      setAnalysisStep(3)
      const analyzeResponse = await fetch('/api/analyze-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pgn: gameData.pgn,
          engineData: serializedEngineData,
        }),
      })

      const analyzeResult = await analyzeResponse.json()

      if (!analyzeResponse.ok) {
        throw new Error(analyzeResult.error || 'Failed to analyze game')
      }

      const analysisData = analyzeResult.data
      setAppState('generating')
      setAnalysisStep(4)

      const storyResponse = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysisData }),
      })

      const storyResult = await storyResponse.json()

      if (!storyResponse.ok) {
        throw new Error(storyResult.error || 'Failed to generate story')
      }

      setAnalysisStep(5)
      const saveStoryResponse = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rawPGN: gameData.pgn,
          analysis: analysisData,
          story: storyResult.story,
        }),
      })

      const saveStoryResult = await saveStoryResponse.json()

      if (!saveStoryResponse.ok) {
        throw new Error(saveStoryResult.error || 'Failed to save story')
      }

      window.location.href = `/stories/${saveStoryResult._id}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setAppState('error')
    }
  }

  const resetUpload = () => {
    setAppState('upload')
    setError(null)
    setAnalysisStep(0)
  }

  return (
    <div className="relative min-h-screen pt-20">
      {/* Floating Background Pieces */}
      <FloatingPieces />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 float"
            style={{
              background: 'rgba(0, 245, 255, 0.1)',
              border: '1px solid rgba(0, 245, 255, 0.3)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span 
              className="text-sm font-medium"
              style={{ color: 'var(--neon-cyan)' }}
            >
              Powered by Stockfish Engine + AI
            </span>
          </div>

          {/* Main Title */}
          <h1 
            className="mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 1.1,
            }}
          >
            <span className="gradient-text">Board</span>
            <span style={{ color: 'var(--neon-gold)' }}>Saga</span>
          </h1>

          {/* Tagline */}
          <p 
            className="text-xl md:text-2xl mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--moon-glow)',
            }}
          >
            <AnimatedTagline />
          </p>

          {/* Description */}
          <p 
            className="max-w-2xl mx-auto text-base md:text-lg"
            style={{
              color: 'var(--moon-glow)',
              opacity: 0.8,
              lineHeight: 1.8,
            }}
          >
            Transform your chess games into cosmic narratives. Upload a PGN file and watch as 
            our AI weaves your strategic battles into legends written in the stars.
          </p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div 
              className="h-px w-16"
              style={{
                background: 'linear-gradient(90deg, transparent, var(--neon-cyan))',
              }}
            />
            <div 
              className="w-2 h-2 rounded-full"
              style={{
                background: 'var(--neon-cyan)',
                boxShadow: '0 0 10px var(--neon-cyan)',
              }}
            />
            <div 
              className="h-px w-16"
              style={{
                background: 'linear-gradient(90deg, var(--neon-cyan), transparent)',
              }}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-3xl mx-auto">
          {appState === 'upload' && (
            <div className="space-y-8">
              <PGNUploader onFileSelect={handleFileSelect} />
              
              {error && (
                <div
                  className="mt-6 p-6 rounded-xl"
                  style={{
                    background: 'rgba(255, 0, 170, 0.1)',
                    border: '1px solid rgba(255, 0, 170, 0.3)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <p style={{ color: 'var(--neon-pink)' }}>
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                {[
                  {
                    icon: '📖',
                    title: 'AI-Powered Stories',
                    description: 'Advanced language models craft unique narratives from your games',
                  },
                  {
                    icon: '🎯',
                    title: 'Engine Analysis',
                    description: 'Stockfish evaluates positions for accurate strategic insights',
                  },
                  {
                    icon: '✨',
                    title: 'Mythic Lore',
                    description: 'Each piece becomes a character in your cosmic chess tale',
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-xl transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'rgba(26, 26, 46, 0.6)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 245, 255, 0.2)',
                    }}
                  >
                    <div className="text-3xl mb-3">{feature.icon}</div>
                    <h3 
                      className="text-lg font-semibold mb-2"
                      style={{ color: 'var(--neon-cyan)' }}
                    >
                      {feature.title}
                    </h3>
                    <p 
                      className="text-sm"
                      style={{ color: 'var(--moon-glow)', opacity: 0.8 }}
                    >
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Progress */}
          {(appState === 'analyzing' || appState === 'analyzing-engine') && (
            <div className="text-center py-12">
              {/* Progress Steps */}
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                <AnalysisStep step={1} currentStep={analysisStep} label="Parse PGN" />
                <AnalysisStep step={2} currentStep={analysisStep} label="Engine Analysis" />
                <AnalysisStep step={3} currentStep={analysisStep} label="AI Analysis" />
                <AnalysisStep step={4} currentStep={analysisStep} label="Generate Story" />
                <AnalysisStep step={5} currentStep={analysisStep} label="Save & Redirect" />
              </div>

              {/* Loading Animation */}
              <div className="relative inline-block mb-8">
                <div 
                  className="w-24 h-24 rounded-full border-2 border-cyan-500/30"
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
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ animation: 'float 3s ease-in-out infinite' }}
                >
                  <span className="text-2xl">♟️</span>
                </div>
              </div>

              <h2 
                className="text-2xl font-bold mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'var(--neon-cyan)',
                  textShadow: '0 0 20px rgba(0, 245, 255, 0.3)',
                }}
              >
                {appState === 'analyzing' ? 'Parsing Your Game...' : 'Consulting the Cosmic Engine...'}
              </h2>
              <p style={{ color: 'var(--moon-glow)', opacity: 0.8 }}>
                {appState === 'analyzing' 
                  ? 'Decoding the strategic language of your moves...' 
                  : 'Stockfish is calculating the geometry of the infinite...'}
              </p>

              {engineStatus === 'failed' && (
                <div
                  className="mt-6 p-4 rounded-xl max-w-md mx-auto"
                  style={{
                    background: 'rgba(255, 170, 0, 0.1)',
                    border: '1px solid rgba(255, 170, 0, 0.3)',
                  }}
                >
                  <p style={{ color: 'var(--neon-gold)', fontSize: '0.9rem' }}>
                    ⚠️ Engine analysis encountered a singularity. Continuing with AI analysis only...
                  </p>
                </div>
              )}
            </div>
          )}

          {appState === 'generating' && (
            <StoryLoading isGenerating={true} />
          )}

          {appState === 'error' && (
            <div className="text-center py-12">
              {/* Error Icon */}
              <div 
                className="inline-block mb-6 relative"
                style={{ animation: 'float 3s ease-in-out infinite' }}
              >
                <div 
                  className="text-6xl"
                  style={{ filter: 'drop-shadow(0 0 20px var(--neon-pink))' }}
                >
                  🌑
                </div>
              </div>

              <h2 
                className="text-3xl font-bold mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'var(--neon-pink)',
                  textShadow: '0 0 20px rgba(255, 0, 170, 0.3)',
                }}
              >
                A Singularity Occurred
              </h2>
              <p 
                className="mb-8 max-w-md mx-auto"
                style={{ color: 'var(--moon-glow)', opacity: 0.8 }}
              >
                {error}
              </p>
              
              <button
                onClick={resetUpload}
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
                Return to the Void
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-20" />
    </div>
  )
}
