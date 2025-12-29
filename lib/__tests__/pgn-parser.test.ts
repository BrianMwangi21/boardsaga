import { parsePGN, validatePGN } from '@/lib/pgn-parser'

describe('PGN Parser', () => {
  describe('validatePGN', () => {
    it('should validate a correct PGN', () => {
      const validPGN = `[Event "Test"]
[White "Player1"]
[Black "Player2"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 *`

      const result = validatePGN(validPGN)
      expect(result.valid).toBe(true)
    })

    it('should reject an empty PGN', () => {
      const result = validatePGN('')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject an invalid PGN', () => {
      const invalidPGN = `[Event "Test"]`

      const result = validatePGN(invalidPGN)
      expect(result.valid).toBe(false)
    })
  })

  describe('parsePGN', () => {
    it('should parse a valid PGN and return game data', () => {
      const pgn = `[Event "Test"]
[White "White"]
[Black "Black"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 O-O 7. c3 d6 8. d4 Nxd6`

      const result = parsePGN(pgn)

      expect(result).not.toBeNull()
      expect(result?.metadata.white).toBe('White')
      expect(result?.metadata.black).toBe('Black')
      expect(result?.metadata.result).toBe('1-0')
      expect(result?.moves.length).toBeGreaterThan(0)
    })

    it('should return null for invalid PGN', () => {
      const result = parsePGN('invalid pgn data')
      expect(result).toBeNull()
    })

    it('should include chessjsData with tactical information', () => {
      const pgn = `[Event "Test"]
[White "White"]
[Black "Black"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 O-O 7. c3 d6 8. d4 Nxd6`

      const result = parsePGN(pgn)

      expect(result).not.toBeNull()
      expect(result?.chessjsData).toBeDefined()
      expect(result?.chessjsData.totalMoves).toBeGreaterThan(0)
      expect(result?.chessjsData.castling.white).toBe(true)
      expect(result?.chessjsData.castling.black).toBe(true)
      expect(result?.chessjsData.captures).toBeGreaterThan(0)
    })
  })
})
