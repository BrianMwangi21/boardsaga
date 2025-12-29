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
      const pgn = `[Event "January 07 Late 2025"]
[Site ""]
[Date "2025.01.07"]
[Round "?"]
[White "Magnus Carlsen"]
[Black "Jose Carlos Ibarra Jerez"]
[Result "1-0"]
[TimeControl ""]
[Link "https://www.chess.com/games/view/17623055"]

1. h4 e5 2. c4 Nf6 3. e3 c6 4. g4 g6 5. d4 d6 6. g5 Nh5 7. dxe5 dxe5 8. Qxd8+ Kxd8 9. Nf3 Bg7 10. Nc3 Bg4 11. Be2 Nd7 12. Nd2 Bxe2 13. Kxe2 h6 14. Nde4 hxg5 15. Nxg5 Ke7 16. b3 Ke8 17. Nce4 Bf8 18. Bb2 f5 19. Ng3 Bd6 20. Rad1 Ke7 21. Rd2 Nxg3+ 22. fxg3 Bb4 23. Rd3 e4 24. Rd4 Rh5 25. Rhd1 Nf6 26. a3 Bc5 27. R4d2 Re8 28. b4 Bb6 29. Rd6 Rf8 30. Re6# 1-0`

      const result = parsePGN(pgn)

      expect(result).not.toBeNull()
      expect(result?.metadata.white).toBe('Magnus Carlsen')
      expect(result?.metadata.black).toBe('Jose Carlos Ibarra Jerez')
      expect(result?.metadata.result).toBe('1-0')
      expect(result?.moves.length).toBeGreaterThan(0)
    })

    it('should return null for invalid PGN', () => {
      const result = parsePGN('invalid pgn data')
      expect(result).toBeNull()
    })

    it('should include chessjsData with tactical information', () => {
      const pgn = `[Event "January 07 Late 2025"]
[Site ""]
[Date "2025.01.07"]
[Round "?"]
[White "Magnus Carlsen"]
[Black "Jose Carlos Ibarra Jerez"]
[Result "1-0"]
[TimeControl ""]
[Link "https://www.chess.com/games/view/17623055"]

1. h4 e5 2. c4 Nf6 3. e3 c6 4. g4 g6 5. d4 d6 6. g5 Nh5 7. dxe5 dxe5 8. Qxd8+ Kxd8 9. Nf3 Bg7 10. Nc3 Bg4 11. Be2 Nd7 12. Nd2 Bxe2 13. Kxe2 h6 14. Nde4 hxg5 15. Nxg5 Ke7 16. b3 Ke8 17. Nce4 Bf8 18. Bb2 f5 19. Ng3 Bd6 20. Rad1 Ke7 21. Rd2 Nxg3+ 22. fxg3 Bb4 23. Rd3 e4 24. Rd4 Rh5 25. Rhd1 Nf6 26. a3 Bc5 27. R4d2 Re8 28. b4 Bb6 29. Rd6 Rf8 30. Re6# 1-0`

      const result = parsePGN(pgn)

      expect(result).not.toBeNull()
      expect(result?.chessjsData).toBeDefined()
      expect(result?.chessjsData.totalMoves).toBeGreaterThan(0)
      expect(result?.chessjsData.checkEvents).toBeGreaterThan(0)
      expect(result?.chessjsData.finalState).toBe('checkmate')
    })
  })
})
