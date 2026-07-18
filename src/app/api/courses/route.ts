import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courseModules, lessons } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { getEntitlements, matchesEntitlement, courseQueries } from '@/lib/access';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

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

    // One entitlement fetch for all modules; video URLs never leave the
    // server for locked lessons (free previews stay watchable)
    const userEntitlements = await getEntitlements(session.user.id);

    const modulesWithLessons = modules.map((mod) => {
      const hasAccess = matchesEntitlement(userEntitlements, courseQueries(mod.id));
      return {
        ...mod,
        hasAccess,
        productId: hasAccess ? null : `course:${mod.id}`,
        lessons: allLessons
          .filter((l) => l.moduleId === mod.id)
          .map((l) => ({
            ...l,
            videoUrl: hasAccess || l.isFreePreview ? l.videoUrl : null,
          })),
      };
    });

    return NextResponse.json({ success: true, data: modulesWithLessons });
  } catch (error) {
    console.error('Courses fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch courses' } },
      { status: 500 }
    );
  }
}
