import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { pgn } = await request.json();

    if (!pgn) {
      return NextResponse.json(
        { error: 'PGN is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const existingStory = await db.collection('stories').findOne({
      rawPGN: pgn,
    });

    if (!existingStory) {
      return NextResponse.json({
        exists: false,
        story: null,
      });
    }

    const { _id, title, gameMetadata, format, summary, createdAt } = existingStory;

    return NextResponse.json({
      exists: true,
      story: {
        _id,
        title,
        gameMetadata,
        format,
        summary,
        createdAt,
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
