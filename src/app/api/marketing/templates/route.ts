import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { prompts, categories } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Get featured templates with category info
    const featuredTemplates = await db()
      .select({
        id: prompts.id,
        title: prompts.title,
        slug: prompts.slug,
        description: prompts.description,
        tier: prompts.tier,
        frameworks: prompts.frameworks,
        copyCount: prompts.copyCount,
        isFeatured: prompts.isFeatured,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(prompts)
      .leftJoin(categories, eq(prompts.categoryId, categories.id))
      .where(eq(prompts.isPublished, true))
      .orderBy(desc(prompts.isFeatured), desc(prompts.copyCount))
      .limit(12);

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
