import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { favorites, prompts } from '@/lib/db/schema';
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

    const userFavorites = await db()
      .select({
        id: favorites.id,
        promptId: favorites.promptId,
        createdAt: favorites.createdAt,
        prompt: {
          id: prompts.id,
          title: prompts.title,
          tier: prompts.tier,
          frameworks: prompts.frameworks,
          previewImageUrl: prompts.previewImageUrl,
        },
      })
      .from(favorites)
      .innerJoin(prompts, eq(favorites.promptId, prompts.id))
      .where(eq(favorites.userId, session.user.id));

    return NextResponse.json({ success: true, data: userFavorites });
  } catch (error) {
    console.error('Favorites fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch favorites' } },
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

    const { promptId } = await request.json();
    if (!promptId) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'promptId is required' } },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existing = await db()
      .select({ id: favorites.id })
      .from(favorites)
      .where(and(
        eq(favorites.userId, session.user.id),
        eq(favorites.promptId, promptId)
      ))
      .limit(1)
      .then(rows => rows[0]);

    if (existing) {
      // Remove favorite
      await db()
        .delete(favorites)
        .where(eq(favorites.id, existing.id));

      return NextResponse.json({ success: true, data: { favorited: false } });
    }

    // Add favorite
    await db().insert(favorites).values({
      userId: session.user.id,
      promptId,
    });

    return NextResponse.json({ success: true, data: { favorited: true } });
  } catch (error) {
    console.error('Favorite toggle error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'TOGGLE_FAILED', message: 'Failed to toggle favorite' } },
      { status: 500 }
    );
  }
}
