import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, payments, entitlements } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/require-admin';
import { derivePlan } from '@/lib/access';

/**
 * GET /api/admin/users/[id] — full profile for the admin drawer:
 * the user, their entitlements (with derived plan), and their orders.
 */
export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await props.params;

    const [user] = await db()
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        image: users.image,
        role: users.role,
        credits: users.credits,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    const [entitlementRows, orderRows] = await Promise.all([
      db()
        .select()
        .from(entitlements)
        .where(eq(entitlements.userId, id))
        .orderBy(desc(entitlements.createdAt)),
      db()
        .select({
          id: payments.id,
          amount: payments.amount,
          currency: payments.currency,
          status: payments.status,
          provider: payments.provider,
          providerPaymentId: payments.providerPaymentId,
          createdAt: payments.createdAt,
        })
        .from(payments)
        .where(eq(payments.userId, id))
        .orderBy(desc(payments.createdAt)),
    ]);

    const plan = derivePlan(
      entitlementRows.map((e) => ({
        scope: e.scope,
        scopeId: e.scopeId,
        expiresAt: e.expiresAt,
        revokedAt: e.revokedAt,
      }))
    );

    return NextResponse.json({
      success: true,
      data: { user: { ...user, plan }, entitlements: entitlementRows, orders: orderRows },
    });
  } catch (error) {
    console.error('Admin user fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch user' } },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users/[id]  { credits? }
 * Manual credit management. Plans/access are granted via entitlements
 * (/api/admin/entitlements); role is NOT editable — admins are CLI-only.
 */
export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await props.params;
    const body = await request.json().catch(() => null);

    const updates: { credits?: number; updatedAt: Date } = {
      updatedAt: new Date(),
    };

    if (body?.credits !== undefined) {
      const credits = Number(body.credits);
      if (!Number.isInteger(credits) || credits < 0 || credits > 1_000_000) {
        return NextResponse.json(
          { success: false, error: { code: 'BAD_REQUEST', message: 'Invalid credits' } },
          { status: 400 }
        );
      }
      updates.credits = credits;
    }

    if (updates.credits === undefined) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Nothing to update' } },
        { status: 400 }
      );
    }

    const [updated] = await db()
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        credits: users.credits,
      });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: 'Failed to update user' } },
      { status: 500 }
    );
  }
}
