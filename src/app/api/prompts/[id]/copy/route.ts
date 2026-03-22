import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { prompts, promptCopies, users } from '@/lib/db/schema';
import { eq, sql, and, gte, count } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { TIER_LIMITS, type Tier } from '@/lib/utils/constants';

export async function POST(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { id } = await props.params;
    const userId = session.user.id;

    // Get user tier
    const user = await db()
      .select({ tier: users.tier })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .then(rows => rows[0]);
    const tier = (user?.tier ?? 'free') as Tier;
    const limit = TIER_LIMITS[tier].promptCopies;

    // Check monthly copy count (unless unlimited)
    if (limit !== Infinity) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [{ value: copiesThisMonth }] = await db()
        .select({ value: count() })
        .from(promptCopies)
        .where(
          and(
            eq(promptCopies.userId, userId),
            gte(promptCopies.createdAt, startOfMonth)
          )
        );

      if (copiesThisMonth >= limit) {
        return NextResponse.json(
          {
            success: false,
            limitReached: true,
            error: {
              code: 'LIMIT_REACHED',
              message: `You've reached your ${limit} copies/month limit. Upgrade for more.`,
            },
          },
          { status: 403 }
        );
      }
    }

    // Record copy and increment counter atomically
    await Promise.all([
      db().insert(promptCopies).values({ userId, promptId: id }),
      db()
        .update(prompts)
        .set({ copyCount: sql`${prompts.copyCount} + 1` })
        .where(eq(prompts.id, id)),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Copy error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'COPY_FAILED', message: 'Failed to copy prompt' } },
      { status: 500 }
    );
  }
}
