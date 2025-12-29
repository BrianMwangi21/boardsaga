import {
   determineStoryFormat,
   generateStoryPrompt,
   generateChapterPrompt
 } from '@/lib/prompts/story-prompts'
import { GameAnalysis } from '@/lib/prompts/prompts'

const mockAnalysis: GameAnalysis = {
  moves: [],
  gameMetadata: {
    whitePlayer: 'Magnus Carlsen',
    blackPlayer: 'Fabiano Caruana',
    whiteElo: '2882',
    blackElo: '2820',
    event: 'World Championship',
    result: '1-0',
    date: '2023.04.20',
    timeControl: '120+10',
    opening: 'Ruy Lopez'
  },
  chessjsData: {
    totalMoves: 60,
    checkEvents: 8,
    castling: {
      white: true,
      black: true
    },
    promotions: [],
    captures: 15,
    finalState: 'checkmate'
  },
  narrativeAnalysis: {
    overview: {
      phase: 'mixed',
      openingPlayed: 'Ruy Lopez',
      keyThemes: ['positional play', 'tactical shots'],
      tempoControl: 'white'
    },
    keyMoments: [
      {
        moveNumber: 23,
        type: 'brilliancy',
        description: 'Brilliant knight sacrifice on d5',
        impact: 'high',
        piecesInvolved: ['Knight', 'Queen']
      },
      {
        moveNumber: 45,
        type: 'turning-point',
        description: 'Decisive rook invasion',
        impact: 'game-deciding',
        piecesInvolved: ['Rook']
      }
    ],
    playerStrategies: {
      white: {
        style: ['aggressive', 'positional'],
        strengths: ['endgame technique', 'initiative'],
        weaknesses: ['slight overextension'],
        signatureMoves: ['Knight sacrifice']
      },
      black: {
        style: ['defensive', 'tactical'],
        strengths: ['defense', 'counterplay'],
        weaknesses: ['slow development'],
        signatureMoves: ['Pawn breaks']
      }
    },
    loreElements: {
      dominantPieces: ['Knight', 'Queen'],
      piecePersonalities: [
        {
          piece: 'Knight',
          personality: 'unpredictable warrior',
          catchphrase: 'Predictability is for the slow',
          role: 'created decisive counterattack'
        }
      ],
      storyThemes: ['sacrifice', 'redemption'],
      narrativeArc: 'Knight leads the charge from chaos to victory'
    }
  }
}

const shortGameAnalysis: GameAnalysis = {
  ...mockAnalysis,
  chessjsData: {
    ...mockAnalysis.chessjsData,
    totalMoves: 25,
    checkEvents: 2,
    captures: 5
  },
  narrativeAnalysis: {
    ...mockAnalysis.narrativeAnalysis,
    keyMoments: [
      mockAnalysis.narrativeAnalysis.keyMoments[0]
    ]
  }
}

describe('Story Generation Prompts', () => {
  describe('determineStoryFormat', () => {
    it('should determine "short" format for simple games', () => {
      const format = determineStoryFormat(shortGameAnalysis)
      expect(format).toBe('short')
    })

    it('should determine "detailed" format for medium games', () => {
      const mediumGameAnalysis: GameAnalysis = {
        ...mockAnalysis,
        chessjsData: {
          ...mockAnalysis.chessjsData,
          totalMoves: 40
        }
      }
      const format = determineStoryFormat(mediumGameAnalysis)
      expect(format).toBe('detailed')
    })

    it('should determine "epic" format for complex games', () => {
      const epicAnalysis: GameAnalysis = {
        ...mockAnalysis,
        chessjsData: {
          totalMoves: 55,
          checkEvents: 12,
          castling: { white: true, black: true },
          promotions: [],
          captures: 20,
          finalState: 'checkmate'
        },
        narrativeAnalysis: {
          ...mockAnalysis.narrativeAnalysis,
          keyMoments: [
            ...mockAnalysis.narrativeAnalysis.keyMoments,
            { moveNumber: 30, type: 'sacrifice', description: 'Queen sacrifice', impact: 'high', piecesInvolved: ['Queen', 'Bishop'] },
            { moveNumber: 35, type: 'blunder', description: 'King walk into check', impact: 'high', piecesInvolved: ['King'] },
            { moveNumber: 40, type: 'brilliancy', description: 'Bishop fork', impact: 'game-deciding', piecesInvolved: ['Bishop', 'Queen', 'Rook'] }
          ]
        }
      }
      const format = determineStoryFormat(epicAnalysis)
      expect(format).toBe('epic')
    })
  })

  describe('generateStoryPrompt', () => {
    it('should generate prompt with all required sections', () => {
      const prompt = generateStoryPrompt(mockAnalysis, 'short')
      expect(prompt).toContain('GAME METADATA')
      expect(prompt).toContain('CHESS.JS TACTICAL DATA')
      expect(prompt).toContain('NARRATIVE ANALYSIS')
      expect(prompt).toContain('KEY MOMENTS')
      expect(prompt).toContain('PLAYER STRATEGIES')
      expect(prompt).toContain('LORE ELEMENTS')
    })

    it('should include game metadata in prompt', () => {
      const prompt = generateStoryPrompt(mockAnalysis, 'detailed')
      expect(prompt).toContain('Magnus Carlsen')
      expect(prompt).toContain('Fabiano Caruana')
      expect(prompt).toContain('1-0')
      expect(prompt).toContain('Ruy Lopez')
    })

    it('should include chessjs data in prompt', () => {
      const prompt = generateStoryPrompt(mockAnalysis, 'epic')
      expect(prompt).toContain('Total Moves: 60')
      expect(prompt).toContain('Check Events: 8')
      expect(prompt).toContain('Captures: 15')
    })

    it('should include piece lore in prompt', () => {
      const prompt = generateStoryPrompt(mockAnalysis, 'detailed')
      expect(prompt).toContain('Knight')
      expect(prompt).toContain('Queen')
      expect(prompt).toContain('unpredictable warrior')
      expect(prompt).toContain('Predictability is for the slow')
    })

    it('should include story themes in prompt', () => {
      const prompt = generateStoryPrompt(mockAnalysis, 'short')
      expect(prompt).toContain('sacrifice')
      expect(prompt).toContain('redemption')
    })

    it('should specify format requirements', () => {
      const shortPrompt = generateStoryPrompt(mockAnalysis, 'short')
      expect(shortPrompt).toContain('SHORT')
      expect(shortPrompt).toContain('Maximum Chapters: 3')
      expect(shortPrompt).toContain('300-800 words')

      const detailedPrompt = generateStoryPrompt(mockAnalysis, 'detailed')
      expect(detailedPrompt).toContain('DETAILED')
      expect(detailedPrompt).toContain('Maximum Chapters: 6')
      expect(detailedPrompt).toContain('800-2000 words')

      const epicPrompt = generateStoryPrompt(mockAnalysis, 'epic')
      expect(epicPrompt).toContain('EPIC')
      expect(epicPrompt).toContain('Maximum Chapters: 10')
      expect(epicPrompt).toContain('2000-5000 words')
    })

    it('should include story structure requirements', () => {
      const prompt = generateStoryPrompt(mockAnalysis, 'detailed')
      expect(prompt).toContain('Narrative Style')
      expect(prompt).toContain('mixed first/third person')
      expect(prompt).toContain('Chapter Structure')
      expect(prompt).toContain('Chess Content Integration')
      expect(prompt).toContain('Piece Lore Integration')
      expect(prompt).toContain('JSON object')
    })
  })

  describe('generateChapterPrompt', () => {
    it('should generate prompt for chapter with sections', () => {
      const prompt = generateChapterPrompt(mockAnalysis, { chapterNumber: 1, sections: ['opening'] })
      expect(prompt).toContain('CHAPTER 1')
      expect(prompt).toContain('Focus Sections: opening')
      expect(prompt).toContain('Magnus Carlsen')
      expect(prompt).toContain('Fabiano Caruana')
    })

    it('should include available key moments in chapter prompt', () => {
      const prompt = generateChapterPrompt(mockAnalysis, { chapterNumber: 2, sections: ['middlegame'] })
      expect(prompt).toContain('Available Key Moments')
      expect(prompt).toContain('Move 23')
      expect(prompt).toContain('brilliancy')
    })

    it('should include piece personalities in chapter prompt', () => {
      const prompt = generateChapterPrompt(mockAnalysis, { chapterNumber: 3, sections: ['endgame'] })
      expect(prompt).toContain('Piece Personalities Available')
      expect(prompt).toContain('Knight')
      expect(prompt).toContain('unpredictable warrior')
    })
  })
})
