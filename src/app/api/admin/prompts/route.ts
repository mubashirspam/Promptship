import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';
import { prompts, categories } from '@/lib/db/schema';
import { eq, desc, ilike, and, sql } from 'drizzle-orm';

// GET /api/admin/prompts — list all prompts (including unpublished)
export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get('query');
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '50');

    const conditions: ReturnType<typeof eq>[] = [];
    if (query) {
      conditions.push(ilike(prompts.title, `%${query}%`));
    }

    const [results, countResult] = await Promise.all([
      db()
        .select({
          id: prompts.id,
          title: prompts.title,
          slug: prompts.slug,
          description: prompts.description,
          tier: prompts.tier,
          frameworks: prompts.frameworks,
          usageCount: prompts.usageCount,
          copyCount: prompts.copyCount,
          isFeatured: prompts.isFeatured,
          isPublished: prompts.isPublished,
          createdAt: prompts.createdAt,
          categoryName: categories.name,
        })
        .from(prompts)
        .leftJoin(categories, eq(prompts.categoryId, categories.id))
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(prompts.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db()
        .select({ count: sql<number>`count(*)::int` })
        .from(prompts)
        .where(conditions.length ? and(...conditions) : undefined),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: results,
        page,
        pageSize,
        total: countResult[0]?.count ?? 0,
      },
    });
  } catch (err) {
    console.error('Admin prompts list error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch prompts' } },
      { status: 500 }
    );
  }
}

// POST /api/admin/prompts — create a new prompt
export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      promptText,
      categoryId,
      tier = 'free',
      frameworks = ['react'],
      previewImageUrl,
      isFeatured = false,
      isPublished = true,
    } = body;

    if (!title || !slug || !promptText) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION', message: 'title, slug, and promptText are required' } },
        { status: 400 }
      );
    }

    const result = await db()
      .insert(prompts)
      .values({
        title,
        slug,
        description,
        promptText,
        categoryId: categoryId || null,
        tier,
        frameworks,
        previewImageUrl,
        isFeatured,
        isPublished,
      })
      .returning();

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (err: unknown) {
    console.error('Admin create prompt error:', err);
    const message =
      err instanceof Error && err.message.includes('unique')
        ? 'A prompt with this slug already exists'
        : 'Failed to create prompt';
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message } },
      { status: 500 }
    );
  }
}
