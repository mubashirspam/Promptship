import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { prompts, categories } from '@/lib/db/schema';
import { eq, desc, asc, ilike, and, sql, arrayContains, inArray } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { getEntitlements, hasTemplateAccess } from '@/lib/access';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const category = searchParams.get('category');
    const framework = searchParams.get('framework');
    const assetKind = searchParams.get('assetKind');
    const query = searchParams.get('query');
    const sort = searchParams.get('sort') || 'popular';
    const page = Math.max(1, Number(searchParams.get('page') || '1') || 1);
    // Clamped so a caller can page through the full catalog (the browse grid
    // asks for 60 at a time) without a bad ?pageSize= dumping every row.
    const pageSize = Math.min(
      Math.max(1, Number(searchParams.get('pageSize') || '24') || 24),
      100
    );

    const conditions = [eq(prompts.isPublished, true)];

    if (query) {
      conditions.push(
        ilike(prompts.title, `%${query}%`)
      );
    }

    // Filter by category slug — a parent category includes all its children
    if (category) {
      const cat = await db()
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, category))
        .limit(1)
        .then(rows => rows[0]);
      if (cat) {
        const children = await db()
          .select({ id: categories.id })
          .from(categories)
          .where(eq(categories.parentId, cat.id));
        conditions.push(
          inArray(prompts.categoryId, [cat.id, ...children.map((c) => c.id)])
        );
      }
    }

    // Filter by framework (array contains)
    if (framework) {
      conditions.push(arrayContains(prompts.frameworks, [framework]));
    }

    // Filter by scope: full templates vs components
    const type = searchParams.get('type');
    if (type === 'full' || type === 'component') {
      conditions.push(eq(prompts.templateType, type));
    }

    // Filter by kind: figma / ai_prompt / code
    const kind = searchParams.get('kind');
    if (kind === 'figma' || kind === 'ai_prompt' || kind === 'code') {
      conditions.push(eq(prompts.assetKind, kind));
    }

    // Filter by platform: web / mobile (universal templates match both)
    const platform = searchParams.get('platform');
    if (platform === 'web' || platform === 'mobile') {
      conditions.push(
        sql`${prompts.platform} IN (${platform}, 'universal')`
      );
    }

    // Filter by template kind (figma | ai_prompt | code)
    if (assetKind === 'figma' || assetKind === 'ai_prompt' || assetKind === 'code') {
      conditions.push(eq(prompts.assetKind, assetKind));
    }

    const primaryOrder =
      sort === 'newest'
        ? desc(prompts.createdAt)
        : sort === 'oldest'
          ? asc(prompts.createdAt)
          : sort === 'alphabetical'
            ? asc(prompts.title)
            : desc(prompts.usageCount);

    // id breaks ties so the sort is a total order. Without it, LIMIT/OFFSET
    // paging over columns with many equal values (seeded rows all share
    // usageCount = 0) lets Postgres return rows in a different order per
    // query, so pages overlap and the same template arrives twice.
    const orderBy = [primaryOrder, asc(prompts.id)];

    // Total matching the same filters, so the grid can show "X of Y" and know
    // when to stop offering "Load more" (page length alone can't tell the
    // difference between a full last page and a partial one).
    const totalRow = await db()
      .select({ count: sql<number>`count(*)::int` })
      .from(prompts)
      .where(and(...conditions))
      .then((rows) => rows[0]);
    const total = totalRow?.count ?? 0;

    // Fetch prompts with category name
    const results = await db()
      .select({
        id: prompts.id,
        categoryId: prompts.categoryId,
        title: prompts.title,
        slug: prompts.slug,
        description: prompts.description,
        promptText: prompts.promptText,
        isFree: prompts.isFree,
        assetKind: prompts.assetKind,
        templateType: prompts.templateType,
        platform: prompts.platform,
        frameworks: prompts.frameworks,
        previewImageUrl: prompts.previewImageUrl,
        previewVideoUrl: sql<string | null>`preview_video_url`,
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
      .orderBy(...orderBy)
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    // Access: browsing is public, but paid prompt content must not leak —
    // promptText is stripped unless the template is free or an entitlement
    // grants access (one query for the whole page).
    const session = await getSession();
    const userId = session?.user.id ?? null;
    const userEntitlements = userId ? await getEntitlements(userId) : [];

    const items = results.map(({ categoryId, ...item }) => {
      const hasAccess = hasTemplateAccess(
        { ...item, categoryId },
        userEntitlements
      );
      return {
        ...item,
        hasAccess,
        promptText: hasAccess ? item.promptText : null,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        items,
        page,
        pageSize,
        total,
        hasMore: page * pageSize < total,
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
