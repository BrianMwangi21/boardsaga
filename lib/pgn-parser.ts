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
  opening?: string
}

export interface ParsedMove {
  san: string
  before: string
  after: string
  turn: 'w' | 'b'
  moveNumber: number
}

export interface ChessjsData {
  totalMoves: number
  checkEvents: number
  castling: {
    white: boolean
    black: boolean
  }
  promotions: Array<{
    moveNumber: number
    color: 'white' | 'black'
    from: string
    to: string
    piece: string
  }>
  captures: number
  finalState: string
}

export interface ParsedGame {
  metadata: GameMetadata
  moves: ParsedMove[]
  pgn: string
  chessjsData: ChessjsData
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

    let checkEvents = 0
    const castling = { white: false, black: false }
    const promotions: ChessjsData['promotions'] = []
    let captures = 0
    
    const verboseMoves = chess.history({ verbose: true })
    verboseMoves.forEach((move) => {
      if (move.san.includes('+') || move.san.includes('#')) {
        checkEvents++
      }
      if (move.san.includes('O-O')) {
        if (move.color === 'w') castling.white = true
        else castling.black = true
      }
      if (move.promotion) {
        promotions.push({
          moveNumber: moves.findIndex(m => m.san === move.san) + 1,
          color: move.color === 'w' ? 'white' : 'black',
          from: move.from,
          to: move.to,
          piece: move.promotion
        })
      }
      if (move.captured) {
        captures++
      }
    })

    const chessjsData: ChessjsData = {
      totalMoves: moves.length,
      checkEvents,
      castling,
      promotions,
      captures,
      finalState: chess.isCheckmate() ? 'checkmate' : chess.isDraw() ? 'draw' : chess.isStalemate() ? 'stalemate' : 'incomplete'
    }

    return {
      metadata,
      moves,
      pgn,
      chessjsData
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
