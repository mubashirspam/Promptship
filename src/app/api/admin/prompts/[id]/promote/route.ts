import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';
import { prompts, categories } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import {
  canPromoteToProduction,
  promoteTemplateToProduction,
} from '@/lib/templates/promote-to-production';

/**
 * POST /api/admin/prompts/[id]/promote — copy one reviewed template from
 * whatever DB this admin panel is connected to (staging/local) into
 * production, upserting by slug. Only available where DATABASE_URL_PRODUCTION
 * is configured and this isn't already the production deployment.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  if (!canPromoteToProduction()) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOT_AVAILABLE',
          message:
            'Production promotion is not available here (either DATABASE_URL_PRODUCTION is not configured, or this already is production).',
        },
      },
      { status: 501 }
    );
  }

  try {
    const { id } = await params;

    const [row] = await db().select().from(prompts).where(eq(prompts.id, id)).limit(1);
    if (!row) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Prompt not found' } },
        { status: 404 }
      );
    }

    const category = row.categoryId
      ? (
          await db().select().from(categories).where(eq(categories.id, row.categoryId)).limit(1)
        )[0] ?? null
      : null;

    const result = await promoteTemplateToProduction(row, category);

    return NextResponse.json({
      success: true,
      data: { slug: row.slug, created: result.created },
    });
  } catch (err) {
    console.error('Promote to production error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'PROMOTE_FAILED', message: 'Failed to push to production' } },
      { status: 500 }
    );
  }
}
