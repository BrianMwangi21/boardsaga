import { GameAnalysis } from './prompts'
import { StoryFormat, STORY_FORMAT_CRITERIA } from '../story-types'

export function determineStoryFormat(analysisData: GameAnalysis): StoryFormat {
  const { chessjsData, narrativeAnalysis } = analysisData
  const keyMoments = narrativeAnalysis.keyMoments

  const highImpactMoments = keyMoments.filter((m: { impact: string }) => m.impact === 'high' || m.impact === 'game-deciding').length
  const complexPieces = keyMoments.filter((m: { piecesInvolved: unknown[] }) => m.piecesInvolved.length > 1).length

  const criteria: StoryFormat =
    (chessjsData.totalMoves > 50 || highImpactMoments >= 4 || complexPieces >= 3) ? 'epic' :
    (chessjsData.totalMoves > 30 || highImpactMoments >= 2) ? 'detailed' :
    'short'

  return criteria
}

export function generateStoryPrompt(analysisData: GameAnalysis, format: StoryFormat): string {
  const formatCriteria = STORY_FORMAT_CRITERIA[format]

  return `Generate a compelling chess game story in ${format} format based on this analysis.

GAME METADATA:
- White: ${analysisData.gameMetadata.whitePlayer} ${analysisData.gameMetadata.whiteElo ? `(${analysisData.gameMetadata.whiteElo})` : ''}
- Black: ${analysisData.gameMetadata.blackPlayer} ${analysisData.gameMetadata.blackElo ? `(${analysisData.gameMetadata.blackElo})` : ''}
- Result: ${analysisData.gameMetadata.result}
- Event: ${analysisData.gameMetadata.event || 'Unknown'}
- Date: ${analysisData.gameMetadata.date || 'Unknown'}
- Opening: ${analysisData.gameMetadata.opening || 'Unknown'}

CHESS.JS TACTICAL DATA:
- Total Moves: ${analysisData.chessjsData.totalMoves}
- Check Events: ${analysisData.chessjsData.checkEvents}
- Castling: White ${analysisData.chessjsData.castling.white ? 'Yes' : 'No'}, Black ${analysisData.chessjsData.castling.black ? 'Yes' : 'No'}
- Captures: ${analysisData.chessjsData.captures}
- Promotions: ${analysisData.chessjsData.promotions.length}
- Final State: ${analysisData.chessjsData.finalState}

IMPORTANT - MOVE NUMBERING:
In chess, "move 1" means BOTH White's first move AND Black's response.
However, the system tracks each half-move individually (what we call "ply"):
- Move 1 = White's first move (e.g., e4)
- Move 2 = Black's response (e.g., e5)
- Move 3 = White's second move (e.g., Nf3)
- Move 4 = Black's second response (e.g., Nc6)
And so on...

So when you see "Move 15" in this system, it refers to the 15th half-move in the game sequence.
For a game with ${analysisData.chessjsData.totalMoves} half-moves total, valid move numbers are 1 to ${analysisData.chessjsData.totalMoves}.
DO NOT exceed ${analysisData.chessjsData.totalMoves}.

NARRATIVE ANALYSIS:
- Phase: ${analysisData.narrativeAnalysis.overview.phase}
- Opening Played: ${analysisData.narrativeAnalysis.overview.openingPlayed}
- Key Themes: ${analysisData.narrativeAnalysis.overview.keyThemes.join(', ')}
- Tempo Control: ${analysisData.narrativeAnalysis.overview.tempoControl}

KEY MOMENTS:
${analysisData.narrativeAnalysis.keyMoments.map(m => 
  `- Move ${m.moveNumber}: ${m.type} - ${m.description} (${m.impact}) - ${m.piecesInvolved.join(', ')}`
).join('\n')}

PLAYER STRATEGIES:
White:
- Style: ${analysisData.narrativeAnalysis.playerStrategies.white.style.join(', ')}
- Strengths: ${analysisData.narrativeAnalysis.playerStrategies.white.strengths.join(', ')}
- Weaknesses: ${analysisData.narrativeAnalysis.playerStrategies.white.weaknesses.join(', ')}
- Signature Moves: ${analysisData.narrativeAnalysis.playerStrategies.white.signatureMoves.join(', ')}

Black:
- Style: ${analysisData.narrativeAnalysis.playerStrategies.black.style.join(', ')}
- Strengths: ${analysisData.narrativeAnalysis.playerStrategies.black.strengths.join(', ')}
- Weaknesses: ${analysisData.narrativeAnalysis.playerStrategies.black.weaknesses.join(', ')}
- Signature Moves: ${analysisData.narrativeAnalysis.playerStrategies.black.signatureMoves.join(', ')}

LORE ELEMENTS:
- Dominant Pieces: ${analysisData.narrativeAnalysis.loreElements.dominantPieces.join(', ')}
- Piece Personalities:
${analysisData.narrativeAnalysis.loreElements.piecePersonalities.map(p => 
  `  - ${p.piece}: ${p.personality}${p.catchphrase ? ` ("${p.catchphrase}")` : ''} - ${p.role}`
).join('\n')}
- Story Themes: ${analysisData.narrativeAnalysis.loreElements.storyThemes.join(', ')}
- Narrative Arc: ${analysisData.narrativeAnalysis.loreElements.narrativeArc}

FORMAT REQUIREMENTS (${format.toUpperCase()}):
- Maximum Chapters: ${formatCriteria.maxChapters}
- Word Count: ${formatCriteria.minWordCount}-${formatCriteria.maxWordCount} words
- Include Chess Board Visualizations: ${formatCriteria.boardVisualization ? 'Yes' : 'No'}
- Include Move References: ${formatCriteria.includeMoveReferences ? 'Yes' : 'No'}

STORY REQUIREMENTS:

1. Narrative Style: Use a mix of first-person and third-person narration
   - First-person: Use for piece perspectives, thoughts, and emotions (e.g., "I, the Queen, watched the chaos unfold...")
   - Third-person: Use for bird's-eye view, objective description (e.g., "The battle across sixty-four squares intensified...")

2. Chapter Structure:
    - Organize into ${formatCriteria.maxChapters} chapters maximum
    - Each chapter should have a clear focus (Opening, Middlegame, Endgame, or Key Moments)
    - Include both linear progression and strategic flashbacks for dramatic effect
    - Each chapter must have a compelling title

3. Chess Content Integration:
    - Include actual move references when describing key moments (e.g., "On move 23, the Knight sprang to f5...")
    - IMPORTANT: Move numbers MUST correspond to actual moves in the game (move 1 = first move, move 2 = second move, etc.)
    - Do not hallucinate move numbers - only use moves that actually exist in the game
    - For critical moments, indicate the move number and san notation for board visualization

4. Piece Lore Integration (~70% inclusion):
   - Incorporate piece personalities and catchphrases from BoardSaga lore
   - Use piece characteristics to drive their actions and dialogue
   - Reference opening concepts (e.g., "The open game called for courage...")
   - Weave in special moments (forks, pins, discoveries) with lore flair

5. Key Moments Integration:
   - Blend key moments into the narrative flow naturally
   - Use both narrative description and separate highlighted moments
   - Focus on emotional impact of turning points, blunders, brilliancies

6. Story Structure JSON Response:

Return ONLY a JSON object with this structure:

{
  "title": "Engaging story title (10-15 words)",
  "summary": "2-3 sentence summary of the story",
  "chapters": [
    {
      "id": "chapter-1",
      "title": "Chapter title",
      "chapterNumber": 1,
      "sections": ["opening"],
      "content": "Full chapter narrative with mixed first/third person narration...",
      "narrativeStyle": "mixed",
      "chessBoards": [
        {
          "moveNumber": 15,
          "san": "move notation",
          "description": "What makes this position critical",
          "criticalReason": "turning-point"
        }
      ],
      "keyMoveReferences": [
        {
          "moveNumber": 23,
          "san": "Nf5",
          "context": "Context for why this move matters"
        }
      ],
      "isFlashback": false
    }
  ],
  "pieceLoreUsed": [
    {
      "piece": "Knight",
      "personality": "unpredictable warrior",
      "catchphrase": "Predictability is for the slow",
      "role": "created decisive counterattack"
    }
  ],
  "storyThemes": ["sacrifice", "redemption"],
  "narrativeArc": "Brief description of the story's narrative arc",
  "totalWordCount": ${formatCriteria.maxWordCount}
}

WRITING GUIDELINES:
- Create engaging, vivid prose that brings the chess game to life
- Balance piece dialogue with strategic narration
- Use BoardSaga lore naturally, not forced
- Make key moments feel dramatic and meaningful
- Keep chapters focused and compelling
- Use varied sentence lengths for dramatic effect
- End each chapter with a hook or revelation

Generate the story now. Return ONLY the JSON object, no additional text.`
}

export function generateChapterPrompt(analysisData: GameAnalysis, chapterInfo: { chapterNumber: number, sections: string[] }): string {
  return `Generate a single chapter for a chess story.

CHAPTER ${chapterInfo.chapterNumber}
Focus Sections: ${chapterInfo.sections.join(', ')}

Game Context:
${analysisData.gameMetadata.whitePlayer} vs ${analysisData.gameMetadata.blackPlayer}
Result: ${analysisData.gameMetadata.result}

Available Key Moments:
${analysisData.narrativeAnalysis.keyMoments.map(m => `Move ${m.moveNumber}: ${m.type} - ${m.description}`).join('\n')}

Piece Personalities Available:
${analysisData.narrativeAnalysis.loreElements.piecePersonalities.map(p => `${p.piece}: ${p.personality}${p.catchphrase ? ` ("${p.catchphrase}")` : ''}`).join('\n')}

Generate chapter content with mixed first/third-person narration, piece perspectives, and strategic description. Include move references and critical board positions for key moments. Make it dramatic and engaging.

Return ONLY the chapter content text.`
}

export function generateChessBoardStatePrompt(keyMoment: { moveNumber: number, san: string, description: string, criticalReason: string }, analysisData: GameAnalysis): string {
  return `Generate the chess board state metadata for this key moment (FEN will be computed from actual game).

Key Moment:
- Move: ${keyMoment.moveNumber} ${keyMoment.san}
- Description: ${keyMoment.description}
- Critical Reason: ${keyMoment.criticalReason}

Game Context:
${analysisData.gameMetadata.whitePlayer} vs ${analysisData.gameMetadata.blackPlayer}
Total Moves: ${analysisData.chessjsData.totalMoves}

Provide metadata for this position. Also provide:
1. Brief description of why this position is critical
2. Which pieces are under attack or in danger
3. What makes this moment a turning point, blunder, or brilliancy

Return ONLY a JSON object:
{
  "fen": "placeholder-will-be-replaced-with-actual-fen",
  "moveNumber": ${keyMoment.moveNumber},
  "san": "${keyMoment.san}",
  "description": "Why this position is critical",
  "criticalReason": "${keyMoment.criticalReason}"
}`
}
