import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { TIER_CREDITS, type Tier } from '@/lib/utils/constants';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { credits: true, tier: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    const tier = (user.tier ?? 'free') as Tier;

    return NextResponse.json({
      success: true,
      data: {
        credits: user.credits,
        tier,
        total: TIER_CREDITS[tier],
      },
    });
  } catch (error) {
    console.error('Credits fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch credits' } },
      { status: 500 }
    );
  }
}
