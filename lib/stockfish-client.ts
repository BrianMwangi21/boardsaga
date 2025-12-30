import type { ParsedGame } from './pgn-parser';
import { Chess } from 'chess.js';

export interface EngineEvaluation {
  score: number;
  depth: number;
  mate?: number;
}

export interface MoveAnalysis {
  san: string;
  evaluation: EngineEvaluation;
  classification: 'blunder' | 'mistake' | 'inaccuracy' | 'good' | 'brilliancy' | 'book';
}

export interface PositionData {
  fen: string;
  moveNumber: number;
  turn: 'w' | 'b';
}

export interface GameEngineData {
  pgnHash: string;
  positions: PositionData[];
  evaluations: Map<number, MoveAnalysis> | Record<number, MoveAnalysis>;
  keyPositions: number[];
}

async function generatePgnHash(pgn: string): Promise<string> {
  if (typeof window === 'undefined') {
    let hash = 0;
    const str = pgn.trim();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(pgn.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function extractPositions(game: ParsedGame): PositionData[] {
  const positions: PositionData[] = [];
  const gameInstance = new Chess();

  positions.push({
    fen: gameInstance.fen(),
    moveNumber: 0,
    turn: 'w'
  });

  for (const move of game.moves) {
    gameInstance.move(move.san);
    positions.push({
      fen: gameInstance.fen(),
      moveNumber: move.moveNumber,
      turn: move.turn
    });
  }

  return positions;
}

export class StockfishClient {
  private worker: Worker | null = null;
  private ready: boolean = false;
  private messageId: number = 0;
  private pendingCallbacks: Map<number, (response: any) => void> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize(): void {
    const stockfishUrl = '/stockfish.js';
    this.worker = new Worker(stockfishUrl);

    this.worker.onmessage = (event) => {
      const message = event.data;

      if (message === 'uciok' || message === 'readyok') {
        if (this.ready) return;
        this.ready = true;
        const callbacks = Array.from(this.pendingCallbacks.values());
        this.pendingCallbacks.clear();
        callbacks.forEach(cb => cb({ ready: true }));
        return;
      }

      if (typeof message === 'string') {
        const infoMatch = message.match(/info\s+(.*)/);
        if (infoMatch) {
          const info = this.parseInfoLine(infoMatch[1]);
          this.pendingCallbacks.forEach((callback) => {
            callback({ info });
          });
        }

        const bestmoveMatch = message.match(/bestmove\s+(\S+)/);
        if (bestmoveMatch) {
          this.pendingCallbacks.forEach((callback) => {
            callback({ bestmove: bestmoveMatch[1] });
          });
        }
      }
    };

    this.worker.postMessage('uci');
  }

  private parseInfoLine(line: string): any {
    const info: any = {};
    const parts = line.split(/\s+/);

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (part === 'depth' && parts[i + 1]) {
        info.depth = parseInt(parts[i + 1]);
      }
      if (part === 'score') {
        if (parts[i + 1] === 'mate' && parts[i + 2]) {
          info.score = { mate: parseInt(parts[i + 2]) };
        } else if (parts[i + 1] === 'cp' && parts[i + 2]) {
          info.score = { cp: parseInt(parts[i + 2]) };
        }
      }
    }

    return info;
  }

  async isReady(): Promise<boolean> {
    if (this.ready) return true;

    return new Promise((resolve, reject) => {
      this.pendingCallbacks.set(this.messageId++, () => {
        this.ready = true;
        resolve(true);
      });

      setTimeout(() => {
        if (!this.ready) {
          reject(new Error('Stockfish initialization timeout'));
        }
      }, 5000);

      this.worker?.postMessage('isready');
    });
  }

  async evaluatePosition(fen: string, depth: number = 5): Promise<EngineEvaluation> {
    await this.isReady();

    return new Promise((resolve, reject) => {
      let bestScore = 0;
      let currentDepth = 0;
      let mateIn = 0;
      let resolved = false;

      const onmessage = (event: MessageEvent) => {
        const message = event.data;

        if (message.includes('info')) {
          const depthMatch = message.match(/depth (\d+)/);
          if (depthMatch) {
            currentDepth = parseInt(depthMatch[1]);
          }

          const mateMatch = message.match(/score mate (-?\d+)/);
          if (mateMatch) {
            mateIn = parseInt(mateMatch[1]);
            bestScore = mateIn > 0 ? 100000 - mateIn : -100000 - mateIn;
          } else {
            const cpMatch = message.match(/score cp (-?\d+)/);
            if (cpMatch) {
              bestScore = parseInt(cpMatch[1]);
            }
          }
        }

        if (message.includes('bestmove') || currentDepth >= depth) {
          if (!resolved) {
            resolved = true;
            this.worker?.removeEventListener('message', onmessage);
            resolve({
              score: bestScore,
              depth: currentDepth,
              mate: mateIn || undefined
            });
          }
        }
      };

      this.worker?.addEventListener('message', onmessage);

      this.worker?.postMessage(`position fen ${fen}`);
      this.worker?.postMessage(`go depth ${depth}`);

      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.worker?.removeEventListener('message', onmessage);
          resolve({
            score: bestScore,
            depth: currentDepth,
            mate: mateIn || undefined
          });
        }
      }, 5000);
    });
  }

  classifyMove(beforeEval: EngineEvaluation, afterEval: EngineEvaluation): MoveAnalysis['classification'] {
    const scoreChange = afterEval.score - beforeEval.score;

    if (afterEval.mate) {
      return afterEval.mate > 0 ? 'brilliancy' : 'blunder';
    }

    if (beforeEval.mate) {
      return afterEval.score > 0 ? 'good' : 'blunder';
    }

    const absChange = Math.abs(scoreChange);

    if (absChange > 200) {
      return scoreChange < 0 ? 'blunder' : 'brilliancy';
    } else if (absChange >= 100) {
      return scoreChange < 0 ? 'mistake' : 'good';
    } else if (absChange >= 50) {
      return 'inaccuracy';
    } else {
      return 'good';
    }
  }

  async analyzeGame(game: ParsedGame): Promise<GameEngineData> {
    await this.isReady();

    const positions = extractPositions(game);
    const pgnHash = await generatePgnHash(game.pgn);
    const evaluations = new Map<number, MoveAnalysis>();
    const keyPositions: number[] = [];

    let prevEvaluation: EngineEvaluation | null = null;

    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];

      if (i === 0) {
        prevEvaluation = await this.evaluatePosition(position.fen, 15);
        continue;
      }

      const currentEvaluation = await this.evaluatePosition(position.fen, 15);

      if (prevEvaluation && i > 0) {
        const move = game.moves[i - 1];
        const classification = this.classifyMove(prevEvaluation, currentEvaluation);

        evaluations.set(i - 1, {
          san: move.san,
          evaluation: currentEvaluation,
          classification
        });

        const scoreChange = Math.abs(currentEvaluation.score - prevEvaluation.score);

        const isKeyPosition =
          i < 10 ||
          i > positions.length - 10 ||
          scoreChange > 50 ||
          move.san.includes('x') ||
          move.san.includes('+') ||
          move.san.includes('#') ||
          i % 5 === 0;

        if (isKeyPosition) {
          keyPositions.push(i - 1);
        }
      }

      prevEvaluation = currentEvaluation;
    }

    return {
      pgnHash,
      positions,
      evaluations,
      keyPositions
    };
  }

  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.ready = false;
    }
  }
}
