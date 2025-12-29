import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import StoryViewer from '../../components/story/StoryViewer';

export default async function StoryPage({
  params,
}: {
  params: { id: string };
}) {
  if (!ObjectId.isValid(params.id)) {
    notFound();
  }

  let storyDoc;

  try {
    const db = await getDb();
    storyDoc = await db.collection('stories').findOne({
      _id: new ObjectId(params.id),
    });
  } catch (error) {
    console.error('Error fetching story:', error);
    notFound();
  }

  if (!storyDoc) {
    notFound();
  }

  return <StoryViewer story={storyDoc.story} />;
}
