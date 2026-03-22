import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { lessonProgress } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const progress = await db
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, session.user.id));

    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch progress' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { lessonId, position, duration, completed } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'lessonId is required' } },
        { status: 400 }
      );
    }

    const existing = await db.query.lessonProgress.findFirst({
      where: and(
        eq(lessonProgress.userId, session.user.id),
        eq(lessonProgress.lessonId, lessonId)
      ),
    });

    if (existing) {
      await db
        .update(lessonProgress)
        .set({
          lastPositionSec: position ?? existing.lastPositionSec,
          watchTimeSec: Math.max(existing.watchTimeSec, position ?? 0),
          isCompleted: completed ?? existing.isCompleted,
          completedAt: completed ? new Date() : existing.completedAt,
          updatedAt: new Date(),
        })
        .where(eq(lessonProgress.id, existing.id));
    } else {
      await db.insert(lessonProgress).values({
        userId: session.user.id,
        lessonId,
        lastPositionSec: position ?? 0,
        watchTimeSec: position ?? 0,
        isCompleted: completed ?? false,
        completedAt: completed ? new Date() : null,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Progress save error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SAVE_FAILED', message: 'Failed to save progress' } },
      { status: 500 }
    );
  }
}
