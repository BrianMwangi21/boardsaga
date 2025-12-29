'use client'

import { useState } from 'react'
import PGNUploader from './components/pgn/PGNUploader'
import { ParsedGame } from '@/lib/pgn-parser'

export default function Home() {
  const [parsedGame, setParsedGame] = useState<ParsedGame | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (file: File) => {
    setLoading(true)
    setError(null)
    setParsedGame(null)

    try {
      const text = await file.text()
      const response = await fetch('/api/parse-pgn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pgn: text }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse PGN')
      }

      setParsedGame(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const resetUpload = () => {
    setParsedGame(null)
    setError(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">BoardSaga</h1>
          <p className="text-lg text-muted-foreground">
            Transform your chess games into captivating stories
          </p>
        </div>

        {!parsedGame && !loading && (
          <div>
            <PGNUploader onFileSelect={handleFileSelect} />
            {error && (
              <div className="mt-4 p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-lg">
                {error}
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Parsing your game...</p>
          </div>
        )}

        {parsedGame && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Game Analysis</h2>
              <button
                onClick={resetUpload}
                className="px-4 py-2 text-sm border rounded hover:bg-muted"
              >
                Upload New Game
              </button>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Game Information</h3>
              <dl className="grid grid-cols-2 gap-4">
                {parsedGame.metadata.white && (
                  <div>
                    <dt className="text-sm text-muted-foreground">White</dt>
                    <dd className="font-medium">{parsedGame.metadata.white}</dd>
                  </div>
                )}
                {parsedGame.metadata.black && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Black</dt>
                    <dd className="font-medium">{parsedGame.metadata.black}</dd>
                  </div>
                )}
                {parsedGame.metadata.whiteElo && (
                  <div>
                    <dt className="text-sm text-muted-foreground">White Elo</dt>
                    <dd className="font-medium">{parsedGame.metadata.whiteElo}</dd>
                  </div>
                )}
                {parsedGame.metadata.blackElo && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Black Elo</dt>
                    <dd className="font-medium">{parsedGame.metadata.blackElo}</dd>
                  </div>
                )}
                {parsedGame.metadata.event && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Event</dt>
                    <dd className="font-medium">{parsedGame.metadata.event}</dd>
                  </div>
                )}
                {parsedGame.metadata.result && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Result</dt>
                    <dd className="font-medium">{parsedGame.metadata.result}</dd>
                  </div>
                )}
                {parsedGame.metadata.date && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Date</dt>
                    <dd className="font-medium">{parsedGame.metadata.date}</dd>
                  </div>
                )}
                {parsedGame.metadata.timeControl && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Time Control</dt>
                    <dd className="font-medium">{parsedGame.metadata.timeControl}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Moves</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {parsedGame.moves.reduce<React.ReactNode[]>((acc, move, index) => {
                  if (move.turn === 'w') {
                    const blackMove = parsedGame.moves[index + 1]
                    acc.push(
                      <div key={index} className="flex gap-4 p-2 hover:bg-muted/50 rounded">
                        <span className="text-sm text-muted-foreground w-12">
                          {Math.ceil(move.moveNumber / 2)}.
                        </span>
                        <span className="font-medium flex-1">{move.san}</span>
                        {blackMove && (
                          <span className="font-medium flex-1">{blackMove.san}</span>
                        )}
                      </div>
                    )
                  }
                  return acc
                }, [])}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
