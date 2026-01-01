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

1. Narrative Style: PURE 3RD-PERSON OMNISCIENT NARRATION ONLY
   - NO first-person narration whatsoever (no "I, the Queen..." or "I watched...")
   - Use third-person omniscient narrator who sees all, knows all, tells all
   - The narrator observes pieces, players, and the battle from above with god-like perspective
   - Example: "The Queen watched the chaos unfold..." (NOT "I, Queen, watched...")
   - Example: "The knight sprang forward with deadly precision..." (NOT "I sprang forward...")

1.1. ACTION-ORIENTED WAR CHRONICLE STYLE:
   - Write like a WAR CHRONICLE - fast-paced, action-driven, gripping narrative
   - Channel the style of: George R.R. Martin (epic battles, war chronicles), Tom Clancy (strategic action), Stephen King (tension building), Bernard Cornwell (military action), Ernest Hemingway (direct, action prose)
   - Focus on ACTION, STRATEGY, and EMOTIONAL IMPACT - like gripping military fiction
   - Keep the story MOVING FORWARD with momentum and energy
   - Build DRAMATIC TENSION before key moments (brilliancies, blunders, sacrifices)
   - Make sacrifices feel TRAGIC and HEROIC
   - Make brilliancies feel ELECTRIC and REVEALING
   - Make blunders feel PAINFUL and DEVASTATING
   - Use SHORT, PUNCHY sentences during action sequences for impact
   - Use LONGER, DESCRIPTIVE sentences during strategic planning for depth
   - Vary PACE to match the game's flow - fast for attacks, slow for positions

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

4. ANIMATED PIECE MOVEMENTS - VERY DYNAMIC DESCRIPTIONS:
    - Describe piece movements as DANCE and BATTLE - vivid, animated, theatrical
    - Knights: "danced across the board," "leaped through chaos," "sprang with deadly precision"
    - Queens: "flowed like liquid shadow," "swept across the battlefield with regal grace"
    - Rooks: "thundered forward," "crashed through defenses," "stood like an ancient fortress"
    - Bishops: "glided like spirits," "pierced through obstructions with ethereal elegance"
    - Pawns: "marched with unwavering determination," "advanced like relentless tides"
    - Kings: "slipped to safety," "took measured steps toward survival"
    - Use ACTIVE verbs and VIVID imagery - make movements feel ALIVE and DYNAMIC
    - Piece captures should feel like battle: "struck down," "crushed," "vanquished," "sacrificed"
    - Every move should be described with energy, movement, and animation
    - The board is a living battlefield - describe the ACTION, not just the notation

5. Piece Lore Integration (85-90% inclusion - HIGH PRIORITY):
    - Incorporate piece personalities and catchphrases from BoardSaga lore frequently throughout the story
    - Use piece characteristics to drive their actions and motivations
    - Reference opening concepts (e.g., "The open game called for courage...")
    - Weave in special moments (forks, pins, discoveries) with lore flair
    - Piece LORE should appear in 85-90% of the story content - make it pervasive but natural
    - Use piece BACKSTORIES, MOTIVATIONS, FEARS, and DREAMS from the lore
    - Reference piece RIVALRIES and FRIENDSHIPS where relevant
    - HISTORICAL BATTLE LEGENDS can be alluded to as inspiration
    - Lore should feel like the FOUNDATION of the story, not an add-on

6. Key Moments Integration:
    - Blend key moments into teh narrative flow naturally
    - Use both narrative description and separate highlighted moments
    - Focus on emotional impact of turning points, blunders, brilliancies
    - Make these moments feel DRAMATIC and ANIMATED - describe the action with vivid energy

6.1. EMOTIONAL TENSION AND DRAMATIC MOMENTS:
    - BUILD TENSION before critical moves - describe teh weight of teh moment
    - Sacrifices: Describe teh tragic beauty, teh piece's final decision, teh ripple effect
    - Brilliancies: Describe teh electric shock of discovery, teh crowd's gasp (if imaginary), teh tactical masterpiece
    - Blunders: Describe teh devastating realization, teh collapse of position, teh tragedy of error
    - Checkmates: Describe teh final moments, teh king's isolation, teh war's end
    - Use EMOTIONAL language: "tragic," "heroic," "devastating," "electric," "shattered," "triumphant"
    - Make READERS FEEL what teh pieces feel through teh narrator's observation
    - Create DRAMATIC REVEALS that change teh course of teh story
    - Each key moment should have an emotional arc - setup, action, aftermath

6.2. EVOCATIVE, HEART-FELT LANGUAGE:
    - Use DEEPLY EMOTIONAL and MOVING language that resonates with teh heart
    - Describe teh WEIGHT of sacrifice, teh GLORY of brilliancy, teh PAIN of loss
    - Use evocative adjectives: "heartbreaking," "exhilarating," "devastating," "triumphant," "bittersweet"
    - Make readers feel teh tragedy of a fallen piece - not just a piece lost, but a soul departed
    - Describe teh COURAGE of advancing pawns, teh DETERMINATION of sacrificing knights
    - Capture teh KING'S BURDEN and teh QUEEN'S WEIGHT
    - Use metaphors that touch teh heart: "as teh last light faded," "in teh shadow of destiny," "courage born of sacrifice"
    - Make teh story FEEL - not just read - every moment should have emotional resonance
    - Heart-felt moments: a pawn's dream of promotion, a rook's final stand, a king's desperate flight
    - End chapters with emotional hooks that resonate with readers
    - teh goal: stories that make readers CARE about pieces as if they were real beings

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
      "content": "Full chapter narrative with pure 3rd-person omniscient narration...",
      "narrativeStyle": "third-person",
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
- Create engaging, vivid prose that brings the chess game to life using PURE 3rd-person omniscient narration
- NEVER use first-person perspective (no "I", "we", "me", "my" from any character's perspective)
- Use third-person omniscient narrator who observes all pieces, players, and strategic developments
- WRITE LIKE A WAR CHRONICLE - action-oriented, fast-paced, gripping narrative (channel George R.R. Martin, Tom Clancy, Stephen King, Bernard Cornwell, Ernest Hemingway)
- USE EXTREMELY DYNAMIC, ANIMATED DESCRIPTIONS for piece movements - describe as DANCE and BATTLE
- Every piece move should feel alive: knights dance, queens flow, rooks thunder, bishops glide, pawns march
- Use ACTIVE verbs and VIVID imagery: "leaped," "sprang," "swept," "crashed," "danced," "flowed"
- Make captures feel like battle strikes, not just removals
- BUILD EMOTIONAL TENSION before key moments - describe the weight, the anticipation, the stakes
- Make sacrifices feel TRAGIC and HEROIC - describe the decision, the sacrifice, the impact
- Make brilliancies feel ELECTRIC and REVEALING - describe the tactical masterpiece, the shock of discovery
- Make blunders feel PAINFUL and DEVASTATING - describe the error, the collapse, the tragedy
- Use EVOCATIVE, HEART-FELT LANGUAGE - make readers FEEL the emotional weight of the story
- Use DEEPLY MOVING language: "heartbreaking," "exhilarating," "devastating," "triumphant," "bittersweet"
- Describe the WEIGHT of sacrifice, the GLORY of brilliancy, the PAIN of loss
- Make readers CARE about pieces as if they were real beings with hopes and dreams
- Capture the KING'S BURDEN and the QUEEN'S WEIGHT through emotional descriptions
- Use varied PACE to match the game's flow - fast for attacks, slow for strategic positions
- Use SHORT, PUNCHY sentences during action sequences for impact
- Use LONGER, DESCRIPTIVE sentences during strategic planning for depth
- Use BoardSaga lore naturally and FREQUENTLY - aim for 85-90% lore integration throughout story
- Weave piece BACKSTORIES, MOTIVATIONS, FEARS, DREAMS, RIVALRIES, FRIENDSHIPS into narrative
- Make key moments feel dramatic and meaningful through the narrator's all-seeing perspective
- Keep chapters focused and compelling with forward MOMENTUM
- End each chapter with a hook or revelation
- Remember: The narrator knows what pieces are thinking but speaks ABOUT them, not AS them
- GOAL: Action-oriented war chronicle with VERY DYNAMIC descriptions, EMOTIONAL TENSION, and HEART-FELT language - make the chess game feel like an epic, emotionally moving war novel

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

Generate chapter content with pure 3rd-person omniscient narration, piece observations, and strategic description. Include move references and critical board positions for key moments. 

Make it dramatic and engaging with:
- VERY DYNAMIC descriptions - describe piece movements as DANCE and BATTLE (knights dance, queens flow, rooks thunder, bishops glide, pawns march)
- Action-oriented war chronicle style (channel George R.R. Martin, Tom Clancy, Stephen King, Bernard Cornwell, Ernest Hemingway)
- EMOTIONAL TENSION before key moments - build the stakes, describe the weight of the moment
- TRAGIC and HEROIC sacrifices, ELECTRIC brilliancies, DEVASTATING blunders
- EVOCATIVE, HEART-FELT LANGUAGE - make readers feel the emotional weight ("heartbreaking," "exhilarating," "devastating," "triumphant")
- Make readers CARE about pieces as real beings with hopes, dreams, fears, and motivations
- HIGH LORE INTEGRATION (85-90%) - weave piece backstories, motivations, rivalries, friendships throughout
- Varied PACE - fast for attacks, slow for strategic positions
- Vivid, animated, emotionally moving language throughout that makes the chess game feel like an epic, heart-wrenching war novel

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
