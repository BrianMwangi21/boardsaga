import { 
  generateOverviewPrompt,
  generateKeyMomentsPrompt,
  generatePlayerStrategyPrompt,
  generateLoreIntegrationPrompt,
  generateFullAnalysisPrompt
} from '@/lib/prompts/prompts'

import { ParsedGame } from '@/lib/pgn-parser'

const mockGame: ParsedGame = {
  metadata: {
    white: 'Magnus Carlsen',
    black: 'Fabiano Caruana',
    whiteElo: '2882',
    blackElo: '2820',
    event: 'World Championship',
    result: '1-0',
    date: '2023.04.20'
  },
  moves: [
    { san: 'e4', before: 'rnbqKBNR/pppppppp/8/8/8/8/PPPPPPPP/RNBQKB1R', after: 'rnbQKBNR/pppppppp/8/8/8/8/4P3/PPPP1PPP/RNBQKB1R', turn: 'w', moveNumber: 1 },
    { san: 'e5', before: 'rnbQKBNR/pppppppp/8/8/8/8/4P3/PPPP1PPP/RNBQKB1R', after: 'rnbqKBNR/pppp1ppp/8/8/8/8/4p3/PPPP1PPP/RNBQKB1R', turn: 'b', moveNumber: 2 }
  ],
  pgn: '',
  chessjsData: {
    totalMoves: 2,
    checkEvents: 0,
    castling: { white: false, black: false },
    promotions: [],
    captures: 0,
    finalState: 'incomplete'
  }
}

describe('Prompt Generation', () => {
  describe('generateOverviewPrompt', () => {
    it('should generate a brief overview prompt', () => {
      const prompt = generateOverviewPrompt(mockGame, 'brief')
      expect(prompt).toContain('Magnus Carlsen')
      expect(prompt).toContain('Fabiano Caruana')
      expect(prompt).toContain('brief 2-3 sentence overview')
    })

    it('should generate a detailed overview prompt', () => {
      const prompt = generateOverviewPrompt(mockGame, 'detailed')
      expect(prompt).toContain('Magnus Carlsen')
      expect(prompt).toContain('2882')
      expect(prompt).toContain('opening')
      expect(prompt).toContain('strategic themes')
    })
  })

  describe('generateKeyMomentsPrompt', () => {
    it('should generate prompt with default 5 moments', () => {
      const prompt = generateKeyMomentsPrompt(mockGame)
      expect(prompt).toContain('5 most critical moments')
      expect(prompt).toContain('Check Events: 0')
    })

    it('should generate prompt with custom moment count', () => {
      const prompt = generateKeyMomentsPrompt(mockGame, 3)
      expect(prompt).toContain('3 most critical moments')
    })
  })

  describe('generatePlayerStrategyPrompt', () => {
    it('should generate prompt for white player', () => {
      const prompt = generatePlayerStrategyPrompt(mockGame, 'white')
      expect(prompt).toContain('Magnus Carlsen')
      expect(prompt).toContain('2882')
      expect(prompt).toContain('Playing style')
      expect(prompt).toContain('strengths')
    })

    it('should generate prompt for black player', () => {
      const prompt = generatePlayerStrategyPrompt(mockGame, 'black')
      expect(prompt).toContain('Fabiano Caruana')
      expect(prompt).toContain('2820')
    })
  })

  describe('generateLoreIntegrationPrompt', () => {
    it('should generate prompt with piece lore context', () => {
      const prompt = generateLoreIntegrationPrompt(mockGame)
      expect(prompt).toContain('Magnus Carlsen')
      expect(prompt).toContain('Fabiano Caruana')
      expect(prompt).toContain('BoardSaga piece lore')
      expect(prompt).toContain('dominant pieces')
      expect(prompt).toContain('story themes')
    })
  })

  describe('generateFullAnalysisPrompt', () => {
    it('should generate comprehensive analysis prompt', () => {
      const prompt = generateFullAnalysisPrompt(mockGame)
      expect(prompt).toContain('GAME METADATA')
      expect(prompt).toContain('CHESS.JS TACTICAL DATA')
      expect(prompt).toContain('MOVE SEQUENCE')
      expect(prompt).toContain('overview')
      expect(prompt).toContain('keyMoments')
      expect(prompt).toContain('playerStrategies')
      expect(prompt).toContain('loreElements')
      expect(prompt).toContain('JSON response')
    })

    it('should include all chessjs data in prompt', () => {
      const prompt = generateFullAnalysisPrompt(mockGame)
      expect(prompt).toContain('Total Moves: 2')
      expect(prompt).toContain('Check Events: 0')
      expect(prompt).toContain('Castling (White/Black): No / No')
      expect(prompt).toContain('Captures: 0')
    })
  })
})
