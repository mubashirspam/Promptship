import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { prompts, promptCopies } from '@/lib/db/schema';
import { eq, sql, and, gte, count } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { getEntitlements, hasTemplateAccess, derivePlan, planCopyLimit } from '@/lib/access';
import { templateProductId } from '@/config/products';

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

    // Entitlements drive both access and the plan-based copy limit
    const userEntitlements = await getEntitlements(userId);
    const plan = derivePlan(userEntitlements);

    // Paid templates need a covering entitlement
    const [template] = await db()
      .select({
        id: prompts.id,
        categoryId: prompts.categoryId,
        isFree: prompts.isFree,
        isPublished: prompts.isPublished,
        assetKind: prompts.assetKind,
      })
      .from(prompts)
      .where(eq(prompts.id, id))
      .limit(1);

    if (!template || !template.isPublished) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Prompt not found' } },
        { status: 404 }
      );
    }

    if (!hasTemplateAccess(template, userEntitlements)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PURCHASE_REQUIRED',
            message: 'This template requires a purchase',
            productId: templateProductId(template.id),
          },
        },
        { status: 403 }
      );
    }

    const limit = planCopyLimit(plan);

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
