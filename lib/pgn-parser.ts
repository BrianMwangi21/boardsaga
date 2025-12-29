import { Chess } from 'chess.js'

export interface GameMetadata {
  event?: string
  site?: string
  date?: string
  round?: string
  white?: string
  black?: string
  result?: string
  whiteElo?: string
  blackElo?: string
  timeControl?: string
  termination?: string
}

export interface ParsedMove {
  san: string
  before: string
  after: string
  turn: 'w' | 'b'
  moveNumber: number
}

export interface ParsedGame {
  metadata: GameMetadata
  moves: ParsedMove[]
  pgn: string
}

export function parsePGN(pgn: string): ParsedGame | null {
  try {
    const chess = new Chess()
    
    chess.loadPgn(pgn)
    
    if (chess.history().length === 0) {
      return null
    }

    const header = chess.header()
    const metadata: GameMetadata = {
      event: header['Event'] || undefined,
      site: header['Site'] || undefined,
      date: header['Date'] || undefined,
      round: header['Round'] || undefined,
      white: header['White'] || undefined,
      black: header['Black'] || undefined,
      result: header['Result'] || undefined,
      whiteElo: header['WhiteElo'] || undefined,
      blackElo: header['BlackElo'] || undefined,
      timeControl: header['TimeControl'] || undefined,
      termination: header['Termination'] || undefined,
    }

    const moves: ParsedMove[] = chess.history({
      verbose: true
    }).map((move, index) => ({
      san: move.san,
      before: move.before,
      after: move.after,
      turn: move.color,
      moveNumber: index + 1,
    }))

    return {
      metadata,
      moves,
      pgn,
    }
  } catch (error) {
    console.error('Error parsing PGN:', error)
    return null
  }
}

export function validatePGN(pgn: string): { valid: boolean; error?: string } {
  try {
    const chess = new Chess()
    chess.loadPgn(pgn)
    
    if (chess.history().length === 0) {
      return { valid: false, error: 'No moves found in PGN' }
    }

    return { valid: true }
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
