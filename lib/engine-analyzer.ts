import { Chess } from 'chess.js';
import type { ParsedGame } from './pgn-parser';
import type { GameEngineData, MoveAnalysis } from './stockfish-client';

interface NarrativeAnalysis {
  overview: {
    phase: 'opening' | 'middlegame' | 'endgame' | 'mixed';
    openingPlayed: string;
    keyThemes: string[];
    tempoControl: 'white' | 'black' | 'balanced';
  };
  keyMoments: Array<{
    moveNumber: number;
    type: 'blunder' | 'brilliancy' | 'turning-point' | 'sacrifice' | 'check' | 'promotion';
    description: string;
    impact: 'low' | 'medium' | 'high' | 'game-deciding';
    piecesInvolved: string[];
  }>;
  playerStrategies: {
    white: {
      style: string[];
      strengths: string[];
      weaknesses: string[];
      signatureMoves: string[];
    };
    black: {
      style: string[];
      strengths: string[];
      weaknesses: string[];
      signatureMoves: string[];
    };
  };
  loreElements: {
    dominantPieces: string[];
    piecePersonalities: Array<{
      piece: string;
      personality: string;
      catchphrase?: string;
      role: string;
    }>;
    storyThemes: string[];
    narrativeArc: string;
  };
}

function detectOpening(moves: ParsedGame['moves']): string {
  if (moves.length < 2) return 'Unknown';

  const firstMove = moves[0].san;
  const secondMove = moves[1]?.san;

  if (firstMove === 'e4') {
    if (secondMove === 'e5') return 'Open Game (e4, e5)';
    if (secondMove === 'c5') return 'Sicilian Defense';
    if (secondMove === 'e6') return 'French Defense';
    if (secondMove === 'c6') return 'Caro-Kann Defense';
    return 'Open Game (1.e4)';
  }

  if (firstMove === 'd4') {
    if (secondMove === 'd5') return 'Queen\'s Pawn Game (1.d4, d5)';
    if (secondMove === 'Nf6') return 'Indian Defense';
    return 'Queen\'s Pawn Game (1.d4)';
  }

  if (firstMove === 'Nf3') return 'Reti Opening';
  if (firstMove === 'c4') return 'English Opening';
  if (firstMove === 'g3') return 'King\'s Fianchetto';

  return 'Unknown Opening';
}

function classifyGamePhase(moveCount: number): NarrativeAnalysis['overview']['phase'] {
  if (moveCount < 15) return 'opening';
  if (moveCount < 40) return 'middlegame';
  return 'endgame';
}

function determineTempoControl(engineData: GameEngineData | null): NarrativeAnalysis['overview']['tempoControl'] {
  if (!engineData || engineData.evaluations.length < 10) return 'balanced';

  let whiteAdvantage = 0;
  let blackAdvantage = 0;

  engineData.evaluations.forEach((evalData, index) => {
    if (index % 2 === 0) {
      if (evalData.evaluation.score > 50) whiteAdvantage++;
      if (evalData.evaluation.score < -50) blackAdvantage++;
    } else {
      if (evalData.evaluation.score < -50) whiteAdvantage++;
      if (evalData.evaluation.score > 50) blackAdvantage++;
    }
  });

  if (whiteAdvantage > blackAdvantage * 1.5) return 'white';
  if (blackAdvantage > whiteAdvantage * 1.5) return 'black';
  return 'balanced';
}

function generateKeyMoments(
  moves: ParsedGame['moves'],
  engineData: GameEngineData | null
): NarrativeAnalysis['keyMoments'] {
  const moments: NarrativeAnalysis['keyMoments'] = [];

  if (!engineData) return moments;

  engineData.evaluations.forEach((evalData, index) => {
    const move = moves[index];
    if (!move) return;

    if (evalData.classification === 'blunder' || evalData.classification === 'brilliancy') {
      const piece = move.san.match(/^[KQRBN]/)?.[0] || 'P';
      moments.push({
        moveNumber: move.moveNumber,
        type: evalData.classification,
        description: `${evalData.classification === 'brilliancy' ? 'Brilliant' : 'Costly'} move at ${move.san}`,
        impact: evalData.classification === 'brilliancy' ? 'high' : 'game-deciding',
        piecesInvolved: [piece]
      });
    }

    if (move.san.includes('+') || move.san.includes('#')) {
      const piece = move.san.match(/^[KQRBN]/)?.[0] || 'P';
      moments.push({
        moveNumber: move.moveNumber,
        type: move.san.includes('#') ? 'check' : 'check',
        description: `${move.san.includes('#') ? 'Checkmate' : 'Check'} with ${move.san}`,
        impact: 'game-deciding',
        piecesInvolved: [piece]
      });
    }
  });

  return moments.slice(0, 8);
}

function analyzePlayerStyle(
  moves: ParsedGame['moves'],
  engineData: GameEngineData | null,
  color: 'white' | 'black'
): NarrativeAnalysis['playerStrategies'][typeof color] {
  const startIndex = color === 'white' ? 0 : 1;
  const playerMoves = moves.filter((_, i) => i % 2 === startIndex);

  const style: string[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const signatureMoves: string[] = [];

  if (!engineData || engineData.evaluations.length === 0) {
    return { style: ['tactical'], strengths: [], weaknesses: [], signatureMoves: [] };
  }

  let blunders = 0;
  let brilliancies = 0;
  let mistakes = 0;
  let goodMoves = 0;

  engineData.evaluations.forEach((evalData, index) => {
    if (index % 2 === startIndex) {
      switch (evalData.classification) {
        case 'blunder':
          blunders++;
          weaknesses.push('missed tactics');
          break;
        case 'mistake':
          mistakes++;
          break;
        case 'brilliancy':
          brilliancies++;
          strengths.push('tactical precision');
          signatureMoves.push(evalData.san);
          break;
        case 'good':
          goodMoves++;
          break;
      }
    }
  });

  const totalMoves = blunders + brilliancies + mistakes + goodMoves;
  if (totalMoves === 0) {
    return { style: ['positional'], strengths: [], weaknesses: [], signatureMoves: [] };
  }

  const accuracy = (goodMoves + brilliancies) / totalMoves;

  if (accuracy > 0.85) {
    style.push('precise');
    strengths.push('high accuracy');
  } else if (accuracy > 0.7) {
    style.push('balanced');
  } else {
    style.push('aggressive');
    weaknesses.push('inconsistent play');
  }

  if (brilliancies > 2) {
    style.push('creative');
    strengths.push('finding brilliancies');
  }

  if (blunders > 2) {
    style.push('risky');
  }

  if (signatureMoves.length === 0) {
    signatureMoves.push(playerMoves[0]?.san || 'Nf3');
  }

  return { style, strengths, weaknesses, signatureMoves: signatureMoves.slice(0, 3) };
}

function generateLoreElements(
  moves: ParsedGame['moves'],
  engineData: GameEngineData | null,
  result: string
): NarrativeAnalysis['loreElements'] {
  const dominantPieces: string[] = [];
  const piecePersonalities: Array<{ piece: string; personality: string; catchphrase?: string; role: string }> = [];
  const storyThemes: string[] = [];

  if (!engineData) {
    return {
      dominantPieces: ['Queen', 'Knight'],
      piecePersonalities: [{ piece: 'Queen', personality: 'strategic', role: 'coordinates' }],
      storyThemes: ['battle'],
      narrativeArc: 'A chess game unfolds'
    };
  }

  let queenMoves = 0;
  let knightMoves = 0;
  let bishopMoves = 0;
  let rookMoves = 0;

  moves.forEach(move => {
    if (move.san.startsWith('Q')) queenMoves++;
    if (move.san.startsWith('N')) knightMoves++;
    if (move.san.startsWith('B')) bishopMoves++;
    if (move.san.startsWith('R')) rookMoves++;
  });

  const pieceCounts = [
    { piece: 'Queen', count: queenMoves },
    { piece: 'Knight', count: knightMoves },
    { piece: 'Bishop', count: bishopMoves },
    { piece: 'Rook', count: rookMoves }
  ].sort((a, b) => b.count - a.count);

  dominantPieces.push(pieceCounts[0].piece);
  if (pieceCounts[1].count > pieceCounts[0].count * 0.5) {
    dominantPieces.push(pieceCounts[1].piece);
  }

  if (knightMoves > queenMoves) {
    piecePersonalities.push({
      piece: 'Knight',
      personality: 'unpredictable warrior',
      catchphrase: 'Unpredictability is my strength',
      role: 'creates tactical opportunities'
    });
    storyThemes.push('tactical brilliance');
  } else if (queenMoves > 0) {
    piecePersonalities.push({
      piece: 'Queen',
      personality: 'powerful strategist',
      catchphrase: 'The Queen controls all',
      role: 'coordinates the attack'
    });
    storyThemes.push('strategic control');
  }

  if (result.includes('1-0')) {
    storyThemes.push('white victory');
  } else if (result.includes('0-1')) {
    storyThemes.push('black resilience');
  } else {
    storyThemes.push('draw');
  }

  let blunders = 0;
  engineData.evaluations.forEach(evalData => {
    if (evalData.classification === 'blunder') blunders++;
  });

  if (blunders > 3) {
    storyThemes.push('dramatic turns');
  } else {
    storyThemes.push('masterful play');
  }

  const narrativeArc = result.includes('1-0')
    ? 'White\'s pieces coordinate to deliver a decisive checkmate'
    : result.includes('0-1')
      ? 'Black\'s resilience leads to victory'
      : 'A hard-fought battle ends in a draw';

  return { dominantPieces, piecePersonalities, storyThemes, narrativeArc };
}

export function analyzeGameWithEngine(
  game: ParsedGame,
  engineData: GameEngineData | null
): NarrativeAnalysis {
  const opening = detectOpening(game.moves);
  const phase = classifyGamePhase(game.moves.length);
  const tempoControl = determineTempoControl(engineData);
  const keyThemes: string[] = [];

  if (engineData) {
    let captures = 0;
    engineData.evaluations.forEach((evalData, index) => {
      if (game.moves[index]?.san.includes('x')) captures++;
    });
    if (captures > 5) keyThemes.push('material exchange');
  }

  return {
    overview: {
      phase,
      openingPlayed: opening,
      keyThemes,
      tempoControl
    },
    keyMoments: generateKeyMoments(game.moves, engineData),
    playerStrategies: {
      white: analyzePlayerStyle(game.moves, engineData, 'white'),
      black: analyzePlayerStyle(game.moves, engineData, 'black')
    },
    loreElements: generateLoreElements(
      game.moves,
      engineData,
      game.metadata.result || '*'
    )
  };
}
