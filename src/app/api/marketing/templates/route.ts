import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { prompts, categories } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// 12 rows × 3 columns for the homepage showcase; full catalog lives at /templates
const HOMEPAGE_LIMIT = 36;

export async function GET() {
  try {
    // Pull every published template, admin-curated ("Featured") ones first,
    // then most-copied. Ties (e.g. freshly seeded rows with copyCount=0) fall
    // back to newest first.
    const rows = await db()
      .select({
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
      })
      .from(prompts)
      .leftJoin(categories, eq(prompts.categoryId, categories.id))
      .where(eq(prompts.isPublished, true))
      .orderBy(desc(prompts.isFeatured), desc(prompts.copyCount), desc(prompts.createdAt));

    // Group by asset kind (code / figma / ai_prompt) so a kind with far more
    // rows (e.g. 249 code templates) can't crowd the others out of the top 36
    // by sheer count. Round-robin merge the groups, so each kind's best items
    // (featured first, per the ordering above) get a fair shot at a slot.
    // Marking a template "Featured" in admin still guarantees it lands near
    // the front, since it sits at the top of its group going into the merge.
    const groups = new Map<string, typeof rows>();
    for (const row of rows) {
      const key = row.assetKind ?? 'other';
      const group = groups.get(key);
      if (group) group.push(row);
      else groups.set(key, [row]);
    }
    const groupArrays = [...groups.values()];

    const featuredTemplates: typeof rows = [];
    for (let i = 0; featuredTemplates.length < HOMEPAGE_LIMIT; i++) {
      const before = featuredTemplates.length;
      for (const group of groupArrays) {
        if (i >= group.length) continue;
        featuredTemplates.push(group[i]);
        if (featuredTemplates.length >= HOMEPAGE_LIMIT) break;
      }
      if (featuredTemplates.length === before) break; // every group exhausted
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
