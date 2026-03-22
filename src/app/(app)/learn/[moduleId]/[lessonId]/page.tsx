import type { Metadata } from 'next';
import { LessonContent } from './lesson-content';

interface LessonPageProps {
  params: Promise<{ moduleId: string; lessonId: string }>;
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { lessonId } = await params;
  return {
    title: `Lesson: ${lessonId.replace(/-/g, ' ')}`,
  };
}

export default async function LessonPage(props: LessonPageProps) {
  const { moduleId, lessonId } = await props.params;

  return <LessonContent moduleId={moduleId} lessonId={lessonId} />;
}
