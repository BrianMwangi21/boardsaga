import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { StoryInput, StoryDocument } from '@/lib/story-schema';

export async function GET() {
  try {
    const db = await getDb();
    const stories = await db
      .collection('stories')
      .find(
        {},
        {
          projection: {
            title: 1,
            gameMetadata: 1,
            format: 1,
            summary: 1,
            createdAt: 1,
          },
        }
      )
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: StoryInput = await request.json();

    const { rawPGN, analysis, story } = body;

    if (!rawPGN || !analysis || !story) {
      return NextResponse.json(
        { error: 'Missing required fields: rawPGN, analysis, story' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const now = new Date();

    const storyDoc: Omit<StoryDocument, '_id'> = {
      rawPGN,
      analysis,
      story,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('stories').insertOne(storyDoc);

    if (!result.acknowledged || !result.insertedId) {
      return NextResponse.json(
        { error: 'Failed to create story' },
        { status: 500 }
      );
    }

    const createdStory = await db.collection('stories').findOne({
      _id: result.insertedId,
    });

    return NextResponse.json(createdStory, { status: 201 });
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
