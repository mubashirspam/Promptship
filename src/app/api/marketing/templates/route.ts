import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { prompts, categories } from '@/lib/db/schema';
import { and, eq, desc } from 'drizzle-orm';

// Fallback only: if nothing is marked Featured in admin, the homepage would be
// empty, so fall back to a balanced mix capped at this many cards.
const FALLBACK_LIMIT = 36;

export async function GET() {
  try {
    const columns = {
        id: prompts.id,
        title: prompts.title,
        slug: prompts.slug,
        description: prompts.description,
        isFree: prompts.isFree,
        frameworks: prompts.frameworks,
        copyCount: prompts.copyCount,
        isFeatured: prompts.isFeatured,
        assetKind: prompts.assetKind,
        previewImageUrl: prompts.previewImageUrl,
        previewVideoUrl: prompts.previewVideoUrl,
        categoryName: categories.name,
        categorySlug: categories.slug,
    } as const;

    // The homepage shows exactly what admin marked as Featured — all of it, in
    // curation order. No cap: the showcase length is a merchandising decision
    // made in admin, not a number hardcoded here.
    const featured = await db()
      .select(columns)
      .from(prompts)
      .leftJoin(categories, eq(prompts.categoryId, categories.id))
      .where(and(eq(prompts.isPublished, true), eq(prompts.isFeatured, true)))
      .orderBy(desc(prompts.copyCount), desc(prompts.createdAt));

    let featuredTemplates = featured;

    // Nothing curated yet — fall back to a balanced mix so the homepage still
    // has something to show. Grouping by asset kind stops the kind with the
    // most rows (e.g. 249 code starters) from crowding out the others.
    if (featuredTemplates.length === 0) {
      const rows = await db()
        .select(columns)
        .from(prompts)
        .leftJoin(categories, eq(prompts.categoryId, categories.id))
        .where(eq(prompts.isPublished, true))
        .orderBy(desc(prompts.copyCount), desc(prompts.createdAt));

      const groups = new Map<string, typeof rows>();
      for (const row of rows) {
        const key = row.assetKind ?? 'other';
        const group = groups.get(key);
        if (group) group.push(row);
        else groups.set(key, [row]);
      }
      const groupArrays = [...groups.values()];

      const mixed: typeof rows = [];
      for (let i = 0; mixed.length < FALLBACK_LIMIT; i++) {
        const before = mixed.length;
        for (const group of groupArrays) {
          if (i >= group.length) continue;
          mixed.push(group[i]);
          if (mixed.length >= FALLBACK_LIMIT) break;
        }
        if (mixed.length === before) break; // every group exhausted
      }
      featuredTemplates = mixed;
    }

    // Get all categories for filtering
    const allCategories = await db()
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
      })
      .from(categories)
      .orderBy(categories.displayOrder);

    return NextResponse.json({
      success: true,
      data: {
        templates: featuredTemplates,
        categories: allCategories,
      },
    });
  } catch (error) {
    console.error('Marketing templates fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch templates' } },
      { status: 500 }
    );
  }
}
