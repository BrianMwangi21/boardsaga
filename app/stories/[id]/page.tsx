import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import StoryViewer from '../../components/story/StoryViewer';

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    notFound();
  }

  let storyDoc;

  try {
    const db = await getDb();
    storyDoc = await db.collection('stories').findOne({
      _id: new ObjectId(id),
    });
  } catch (error) {
    console.error('Error fetching story:', error);
    notFound();
  }

  if (!storyDoc) {
    notFound();
  }

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-4 duration-700"
      style={{
        minHeight: '100vh',
      }}
    >
      <StoryViewer story={storyDoc.story} />
    </div>
  );
}
