import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { prompts, categories } from '@/lib/db/schema';
import { eq, desc, asc, ilike, and, sql, arrayContains } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const category = searchParams.get('category');
    const framework = searchParams.get('framework');
    const query = searchParams.get('query');
    const sort = searchParams.get('sort') || 'popular';
    const page = Number(searchParams.get('page') || '1');
    const pageSize = Number(searchParams.get('pageSize') || '24');

    const conditions = [eq(prompts.isPublished, true)];

    if (query) {
      conditions.push(
        ilike(prompts.title, `%${query}%`)
      );
    }

    // Filter by category slug via join
    if (category) {
      const cat = await db.query.categories.findFirst({
        where: eq(categories.slug, category),
        columns: { id: true },
      });
      if (cat) {
        conditions.push(eq(prompts.categoryId, cat.id));
      }
    }

    // Filter by framework (array contains)
    if (framework) {
      conditions.push(arrayContains(prompts.frameworks, [framework]));
    }

    const orderBy =
      sort === 'newest'
        ? desc(prompts.createdAt)
        : sort === 'oldest'
          ? asc(prompts.createdAt)
          : sort === 'alphabetical'
            ? asc(prompts.title)
            : desc(prompts.usageCount);

    // Fetch prompts with category name
    const results = await db
      .select({
        id: prompts.id,
        title: prompts.title,
        slug: prompts.slug,
        description: prompts.description,
        promptText: prompts.promptText,
        tier: prompts.tier,
        frameworks: prompts.frameworks,
        previewImageUrl: prompts.previewImageUrl,
        usageCount: prompts.usageCount,
        copyCount: prompts.copyCount,
        favoriteCount: prompts.favoriteCount,
        isFeatured: prompts.isFeatured,
        createdAt: prompts.createdAt,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(prompts)
      .leftJoin(categories, eq(prompts.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return NextResponse.json({
      success: true,
      data: {
        items: results,
        page,
        pageSize,
        hasMore: results.length === pageSize,
      },
    });
  } catch (error) {
    console.error('Prompts fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch prompts' } },
      { status: 500 }
    );
  }
}
