import { ObjectId } from 'mongodb';
import { GameAnalysis } from './prompts/prompts';
import { Story } from './story-types';

export interface StoryDocument {
  _id: ObjectId;
  rawPGN: string;
  analysis: GameAnalysis;
  story: Story;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoryMetadata {
  _id: ObjectId;
  title: string;
  gameMetadata: {
    whitePlayer: string;
    blackPlayer: string;
    whiteElo?: string;
    blackElo?: string;
    event?: string;
    result?: string;
    date?: string;
    opening?: string;
  };
  format: 'short' | 'detailed' | 'epic';
  summary: string;
  createdAt: Date;
}

export type StoryInput = Omit<StoryDocument, '_id' | 'createdAt' | 'updatedAt'>;
