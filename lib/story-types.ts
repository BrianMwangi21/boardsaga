import { GameAnalysis } from './prompts/prompts'

export type StoryFormat = 'short' | 'detailed' | 'epic'

export type NarrativeStyle = 'first-person' | 'third-person' | 'mixed'

export type ChapterSection = 'opening' | 'middlegame' | 'endgame' | 'key-moments'

export interface ChessBoardState {
  fen: string
  moveNumber: number
  san: string
  description: string
  criticalReason: 'turning-point' | 'blunder' | 'brilliancy' | 'sacrifice' | 'check' | 'promotion' | 'checkmate' | 'positioning' | 'approach' | 'initial setup'
}

export interface StoryChapter {
  id: string
  title: string
  chapterNumber: number
  sections: ChapterSection[]
  content: string
  narrativeStyle: NarrativeStyle
  chessBoards?: ChessBoardState[]
  keyMoveReferences: Array<{
    moveNumber: number
    san: string
    context: string
  }>
  isFlashback?: boolean
}

export interface Story {
  id: string
  title: string
  format: StoryFormat
  chapters: StoryChapter[]
  summary: string
  gameMetadata: {
    whitePlayer: string
    blackPlayer: string
    whiteElo?: string
    blackElo?: string
    event?: string
    result?: string
    date?: string
    opening?: string
  }
  pieceLoreUsed: Array<{
    piece: string
    personality: string
    catchphrase?: string
    role: string
  }>
  storyThemes: string[]
  narrativeArc: string
  totalWordCount?: number
  createdAt: Date
}

export interface StoryGenerationRequest {
  analysisData: GameAnalysis
  format?: StoryFormat
}

export interface StoryGenerationResponse {
  story: Story
  tokenUsage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface StoryFormatCriteria {
  short: {
    maxChapters: number
    minWordCount: number
    maxWordCount: number
    boardVisualization: boolean
    includeMoveReferences: boolean
  }
  detailed: {
    maxChapters: number
    minWordCount: number
    maxWordCount: number
    boardVisualization: boolean
    includeMoveReferences: boolean
  }
  epic: {
    maxChapters: number
    minWordCount: number
    maxWordCount: number
    boardVisualization: boolean
    includeMoveReferences: boolean
  }
}

export const STORY_FORMAT_CRITERIA: StoryFormatCriteria = {
  short: {
    maxChapters: 3,
    minWordCount: 300,
    maxWordCount: 800,
    boardVisualization: true,
    includeMoveReferences: true
  },
  detailed: {
    maxChapters: 6,
    minWordCount: 800,
    maxWordCount: 2000,
    boardVisualization: true,
    includeMoveReferences: true
  },
  epic: {
    maxChapters: 10,
    minWordCount: 2000,
    maxWordCount: 5000,
    boardVisualization: true,
    includeMoveReferences: true
  }
}
