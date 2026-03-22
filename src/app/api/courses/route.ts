import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courseModules, lessons } from '@/lib/db/schema';
import { eq, asc, and } from 'drizzle-orm';

export async function GET() {
  try {
    const modules = await db()
      .select()
      .from(courseModules)
      .where(eq(courseModules.isPublished, true))
      .orderBy(asc(courseModules.displayOrder));

    const allLessons = await db()
      .select()
      .from(lessons)
      .where(eq(lessons.isPublished, true))
      .orderBy(asc(lessons.displayOrder));

    const modulesWithLessons = modules.map((mod) => ({
      ...mod,
      lessons: allLessons.filter((l) => l.moduleId === mod.id),
    }));

    return NextResponse.json({ success: true, data: modulesWithLessons });
  } catch (error) {
    console.error('Courses fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch courses' } },
      { status: 500 }
    );
  }
}
