import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

function normalizePGN(pgn: string): string {
  return pgn.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n{3,}/g, '\n\n');
}

export async function POST(request: NextRequest) {
  try {
    const { pgn } = await request.json();

    if (!pgn) {
      return NextResponse.json(
        { error: 'PGN is required' },
        { status: 400 }
      );
    }

    const normalizedPGN = normalizePGN(pgn);

    const db = await getDb();
    const existingStory = await db.collection('stories').findOne({
      rawPGN: normalizedPGN,
    });

    if (!existingStory) {
      return NextResponse.json({
        exists: false,
        story: null,
      });
    }

    const { _id, story } = existingStory;

    return NextResponse.json({
      exists: true,
      story: {
        _id,
        title: story.title,
        gameMetadata: story.gameMetadata,
        format: story.format,
        summary: story.summary,
        createdAt: existingStory.createdAt,
      },
    });
  } catch (error) {
    console.error('Error checking PGN:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
