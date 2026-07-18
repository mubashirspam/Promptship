import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { getEntitlements, derivePlan } from '@/lib/access';
import { PLAN_CREDITS } from '@/lib/utils/constants';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const [user, entitlements] = await Promise.all([
      db()
        .select({ credits: users.credits })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1)
        .then((rows) => rows[0]),
      getEntitlements(session.user.id),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    const plan = derivePlan(entitlements);

    return NextResponse.json({
      success: true,
      data: {
        credits: user.credits,
        plan,
        total: PLAN_CREDITS[plan],
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
