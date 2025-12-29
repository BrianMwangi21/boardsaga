'use client'

import { useEffect, useRef } from 'react'
import { Chess } from 'chess.js'
import Chessground from '@bezalel6/react-chessground'
import { ChessBoardState } from '@/lib/story-types'

interface ChessBoardProps {
  boardState: ChessBoardState
  size?: 'small' | 'medium' | 'large'
}

const SIZE_CONFIGS = {
  small: { width: '320px', height: '320px' },
  medium: { width: '448px', height: '448px' },
  large: { width: '576px', height: '576px' }
}

const CRITICAL_REASON_COLORS = {
  'turning-point': 'bg-amber-100 border-amber-400',
  'blunder': 'bg-red-100 border-red-400',
  'brilliancy': 'bg-green-100 border-green-400',
  'sacrifice': 'bg-purple-100 border-purple-400',
  'check': 'bg-blue-100 border-blue-400',
  'promotion': 'bg-yellow-100 border-yellow-400'
}

export default function ChessBoard({ boardState, size = 'medium' }: ChessBoardProps) {
  const config = SIZE_CONFIGS[size]
  const criticalColor = CRITICAL_REASON_COLORS[boardState.criticalReason as keyof typeof CRITICAL_REASON_COLORS] || 'bg-gray-100 border-gray-400'

  const chess = new Chess(boardState.fen)
  const turn = chess.turn()
  const turnColor = turn === 'w' ? 'white' : 'black'

  const moves = chess.moves({ verbose: true })
  const dests = moves.reduce((acc, move) => {
    if (!acc[move.from]) {
      acc[move.from] = []
    }
    acc[move.from].push(move.to)
    return acc
  }, {} as Record<string, string[]>)

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="border-4 rounded-lg shadow-xl"
        style={{
          borderColor: '#8B4513',
          backgroundColor: '#D4A373'
        }}
      >
        <Chessground
          fen={boardState.fen}
          turnColor={turnColor}
          movable={{
            free: false,
            color: turnColor,
            dests: dests as any
          }}
          highlight={{
            lastMove: false,
            check: true
          }}
          animation={{
            enabled: true,
            duration: 200
          }}
          orientation={turnColor}
          style={{
            width: config.width,
            height: config.height
          }}
        />
      </div>

      <div className={`w-full p-3 rounded-lg border-2 ${criticalColor}`}>
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-gray-600 mb-1">Move {boardState.moveNumber}</p>
          <p className="text-lg font-bold text-gray-900 mb-1">{boardState.san}</p>
          <p className="text-sm text-gray-700">{boardState.description}</p>
        </div>
      </div>
    </div>
  )
}
