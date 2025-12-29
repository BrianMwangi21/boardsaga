import { ParsedGame } from '@/lib/pgn-parser'

export interface GameAnalysis {
  gameMetadata: {
    whitePlayer: string
    blackPlayer: string
    whiteElo?: string
    blackElo?: string
    event?: string
    result?: string
    date?: string
    timeControl?: string
    opening?: string
  }
  chessjsData: {
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
  narrativeAnalysis: {
    overview: {
      phase: 'opening' | 'middlegame' | 'endgame' | 'mixed'
      openingPlayed: string
      keyThemes: string[]
      tempoControl: 'white' | 'black' | 'balanced'
    }
    keyMoments: Array<{
      moveNumber: number
      type: 'blunder' | 'brilliancy' | 'turning-point' | 'sacrifice' | 'check' | 'promotion'
      description: string
      impact: 'low' | 'medium' | 'high' | 'game-deciding'
      piecesInvolved: string[]
    }>
    playerStrategies: {
      white: {
        style: string[]
        strengths: string[]
        weaknesses: string[]
        signatureMoves: string[]
      }
      black: {
        style: string[]
        strengths: string[]
        weaknesses: string[]
        signatureMoves: string[]
      }
    }
    loreElements: {
      dominantPieces: string[]
      piecePersonalities: Array<{
        piece: string
        personality: string
        catchphrase?: string
        role: string
      }>
      storyThemes: string[]
      narrativeArc: string
    }
  }
}

export function generateOverviewPrompt(game: ParsedGame, depth: 'brief' | 'detailed' = 'detailed'): string {
  return `Analyze this chess game and provide an overview.

Game Information:
- White: ${game.metadata.white || 'Unknown'} ${game.metadata.whiteElo ? `(${game.metadata.whiteElo})` : ''}
- Black: ${game.metadata.black || 'Unknown'} ${game.metadata.blackElo ? `(${game.metadata.blackElo})` : ''}
- Result: ${game.metadata.result || 'Unknown'}
- Event: ${game.metadata.event || 'Unknown'}
- Date: ${game.metadata.date || 'Unknown'}
- Time Control: ${game.metadata.timeControl || 'Unknown'}
- Total Moves: ${game.moves.length}

Chess.js Analysis Data:
- Check Events: ${game.chessjsData?.checkEvents || 0}
- Castling (White/Black): ${game.chessjsData?.castling?.white ? 'Yes' : 'No'} / ${game.chessjsData?.castling?.black ? 'Yes' : 'No'}
- Captures: ${game.chessjsData?.captures || 0}
- Final State: ${game.chessjsData?.finalState || 'Unknown'}

${depth === 'detailed' ? `
Provide a comprehensive analysis including:
1. The opening played and key ideas
2. Phase breakdown (opening, middlegame, endgame characteristics)
3. Who controlled the tempo and when it shifted
4. Key strategic themes that emerged
5. Overall narrative of the game

Keep analysis engaging and suitable for chess storytelling.` : `
Provide a brief 2-3 sentence overview of the game's narrative and key themes.`}
`
}

export function generateKeyMomentsPrompt(game: ParsedGame, maxMoments: number = 5): string {
  return `Identify the ${maxMoments} most critical moments in this chess game.

Game Context:
- ${game.metadata.white || 'Unknown'} vs ${game.metadata.black || 'Unknown'}
- Result: ${game.metadata.result || 'Unknown'}
- Total Moves: ${game.moves.length}

Chess.js Data Points:
- Check Events: ${game.chessjsData?.checkEvents || 0}
- Castling: White ${game.chessjsData?.castling?.white ? 'Yes' : 'No'}, Black ${game.chessjsData?.castling?.black ? 'Yes' : 'No'}
- Promotions: ${game.chessjsData?.promotions?.length || 0}
- Captures: ${game.chessjsData?.captures || 0}

Move sequence (abbreviated):
${game.moves.slice(0, 20).map(m => m.san).join(', ')}${game.moves.length > 20 ? '...' : ''}

For each key moment, provide:
1. Move number (e.g., 15. for White, 15... for Black)
2. Type of moment (blunder, brilliancy, turning-point, sacrifice, critical check, promotion)
3. What happened (brief description)
4. Impact on the game (low, medium, high, game-deciding)
5. Which pieces were involved

Focus on moments that changed the course of the game, created decisive advantages, or were particularly beautiful or tragic.
`
}

export function generatePlayerStrategyPrompt(game: ParsedGame, color: 'white' | 'black'): string {
  const player = color === 'white' ? game.metadata.white : game.metadata.black
  const elo = color === 'white' ? game.metadata.whiteElo : game.metadata.blackElo
  const resultMap: Record<string, 'win' | 'loss' | 'draw' | 'unknown'> = {
    '1-0': color === 'white' ? 'win' : 'loss',
    '0-1': color === 'white' ? 'loss' : 'win',
    '1/2-1/2': 'draw',
    '*': 'unknown'
  }
  const result = game.metadata.result ? resultMap[game.metadata.result] : 'unknown'

  return `Analyze the playing style and strategy of ${player || 'Unknown'} (${elo || 'ELO unknown'}) in this game.

Game Result for ${player || 'Unknown'}: ${result}

Chess.js Data for ${color}:
- Castled: ${game.chessjsData?.castling?.[color] ? 'Yes' : 'No'}
- Promotions: ${game.chessjsData?.promotions?.filter(p => p.color === color).length || 0}

Provide analysis of:
1. Playing style (aggressive, positional, tactical, balanced, defensive, etc.)
2. Key strengths demonstrated in this game
3. Weaknesses or mistakes made
4. Signature moves or patterns that characterize their approach
5. How ${color === 'white' ? 'White' : 'Black'}'s strategy evolved throughout the game

Keep the analysis insightful and suitable for narrative storytelling.
`
}

export function generateLoreIntegrationPrompt(game: ParsedGame): string {
  return `Using the BoardSaga piece lore framework, analyze this chess game to extract narrative elements.

Game: ${game.metadata.white || 'Unknown'} vs ${game.metadata.black || 'Unknown'} (${game.metadata.result || 'Unknown'})

Chess.js Data:
- Dominant pieces (based on captures and promotions): 
${game.chessjsData?.promotions?.length ? `  - Promotions: ${game.chessjsData.promotions.map(p => p.piece).join(', ')}` : ''}
- Check events: ${game.chessjsData?.checkEvents || 0}
- Castling: White ${game.chessjsData?.castling?.white ? 'Yes' : 'No'}, Black ${game.chessjsData?.castling?.black ? 'Yes' : 'No'}

Identify and describe:
1. Which pieces were the heroes/villains of this game (dominant pieces)
2. For key pieces, assign a personality trait and catchphrase from BoardSaga lore
3. What role did each significant piece play in the game's story?
4. What story themes emerged from this game? (sacrifice, redemption, underdog journey, strategy vs. chaos, etc.)
5. Provide a brief narrative arc that describes the game's story

Reference BoardSaga piece characteristics:
- Pawn: Humble, ambitious, dreams of promotion
- Rook: Guardian of territory, unwavering resolve
- Knight: Unpredictable, strategic trickster
- Bishop: Spiritual guide, mystic insight
- Queen: Sovereign power, flexible commander
- King: Crown that must not fall, lonely burden

Keep the analysis engaging and story-focused.
`
}

export function generateFullAnalysisPrompt(game: ParsedGame): string {
  return `Analyze this chess game comprehensively using BoardSaga's narrative framework.

GAME METADATA:
- White: ${game.metadata.white || 'Unknown'} ${game.metadata.whiteElo ? `(${game.metadata.whiteElo})` : ''}
- Black: ${game.metadata.black || 'Unknown'} ${game.metadata.blackElo ? `(${game.metadata.blackElo})` : ''}
- Result: ${game.metadata.result || 'Unknown'}
- Event: ${game.metadata.event || 'Unknown'}
- Date: ${game.metadata.date || 'Unknown'}
- Time Control: ${game.metadata.timeControl || 'Unknown'}
- Opening: ${game.metadata.opening || 'Unknown'}

CHESS.JS TACTICAL DATA:
- Total Moves: ${game.moves.length}
- Check Events: ${game.chessjsData?.checkEvents || 0}
- Castling (White/Black): ${game.chessjsData?.castling?.white ? 'Yes' : 'No'} / ${game.chessjsData?.castling?.black ? 'Yes' : 'No'}
- Captures: ${game.chessjsData?.captures || 0}
- Promotions: ${game.chessjsData?.promotions?.length || 0}
  ${game.chessjsData?.promotions?.map(p => `- Move ${p.moveNumber}: ${p.color} pawn promoted to ${p.piece}`).join('\n') || ''}
- Final State: ${game.chessjsData?.finalState || 'Unknown'}

MOVE SEQUENCE:
${game.moves.map(m => m.san).join(' ')}

Provide a JSON response with this structure:
{
  "overview": {
    "phase": "opening|middlegame|endgame|mixed",
    "openingPlayed": "name of opening",
    "keyThemes": ["theme1", "theme2"],
    "tempoControl": "white|black|balanced"
  },
  "keyMoments": [
    {
      "moveNumber": number,
      "type": "blunder|brilliancy|turning-point|sacrifice|check|promotion",
      "description": "what happened",
      "impact": "low|medium|high|game-deciding",
      "piecesInvolved": ["piece1", "piece2"]
    }
  ],
  "playerStrategies": {
    "white": {
      "style": ["style1", "style2"],
      "strengths": ["strength1"],
      "weaknesses": ["weakness1"],
      "signatureMoves": ["move description"]
    },
    "black": {
      "style": ["style1", "style2"],
      "strengths": ["strength1"],
      "weaknesses": ["weakness1"],
      "signatureMoves": ["move description"]
    }
  },
  "loreElements": {
    "dominantPieces": ["Knight", "Queen"],
    "piecePersonalities": [
      {
        "piece": "Knight",
        "personality": "unpredictable warrior",
        "catchphrase": "Predictability is for the slow",
        "role": "created decisive counterattack"
      }
    ],
    "storyThemes": ["sacrifice", "redemption"],
    "narrativeArc": "brief description of game's story"
  }
}

Keep descriptions concise but engaging, suitable for storytelling.
`
}
