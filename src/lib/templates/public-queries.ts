import { db } from '@/lib/db';
import { prompts, categories } from '@/lib/db/schema';
import { and, eq, desc, ne, sql } from 'drizzle-orm';

/**
 * Server-side queries for the PUBLIC, indexable template pages.
 * These never select `assetUrl` — the downloadable asset stays gated behind
 * the entitlement-checked download endpoint. Everything here is safe to render
 * for anonymous visitors and crawlers.
 */

export interface PublicTemplate {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  previewImageUrl: string | null;
  previewVideoUrl: string | null;
  isFree: boolean;
  frameworks: string[] | null;
  categoryName: string | null;
  categorySlug: string | null;
  complexity: string | null;
  platform: string | null;
  updatedAt: Date;
}

const selectFields = {
  id: prompts.id,
  title: prompts.title,
  slug: prompts.slug,
  description: prompts.description,
  previewImageUrl: prompts.previewImageUrl,
  previewVideoUrl: prompts.previewVideoUrl,
  isFree: prompts.isFree,
  frameworks: prompts.frameworks,
  categoryName: categories.name,
  categorySlug: categories.slug,
  layoutMetadata: prompts.layoutMetadata,
  platform: prompts.platform,
  updatedAt: prompts.updatedAt,
} as const;

type Row = {
  layoutMetadata: { complexity?: string } | null;
} & Omit<PublicTemplate, 'complexity'>;

function toTemplate(row: Row): PublicTemplate {
  const { layoutMetadata, ...rest } = row;
  return { ...rest, complexity: layoutMetadata?.complexity ?? null };
}

export interface PublicCategory {
  name: string;
  slug: string;
  description: string | null;
  count: number;
}

/** Categories that actually have published templates (for landing pages/nav). */
export async function getPublicCategories(): Promise<PublicCategory[]> {
  const rows = await db()
    .select({
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      count: sql<number>`count(${prompts.id})`.mapWith(Number),
    })
    .from(categories)
    .leftJoin(
      prompts,
      and(eq(prompts.categoryId, categories.id), eq(prompts.isPublished, true))
    )
    .groupBy(
      categories.id,
      categories.name,
      categories.slug,
      categories.description,
      categories.displayOrder
    )
    .orderBy(categories.displayOrder, categories.name);

  return rows.filter((r) => r.count > 0);
}

export async function getCategoryBySlug(
  slug: string
): Promise<PublicCategory | null> {
  const cats = await getPublicCategories();
  return cats.find((c) => c.slug === slug) ?? null;
}

/** Featured/most-copied published templates (catalog + homepage). */
export async function getPublishedTemplates(limit = 60): Promise<PublicTemplate[]> {
  const rows = await db()
    .select(selectFields)
    .from(prompts)
    .leftJoin(categories, eq(prompts.categoryId, categories.id))
    .where(eq(prompts.isPublished, true))
    .orderBy(desc(prompts.isFeatured), desc(prompts.copyCount))
    .limit(limit);
  return rows.map(toTemplate);
}

export async function getTemplatesByCategory(
  categorySlug: string
): Promise<PublicTemplate[]> {
  const rows = await db()
    .select(selectFields)
    .from(prompts)
    .leftJoin(categories, eq(prompts.categoryId, categories.id))
    .where(and(eq(prompts.isPublished, true), eq(categories.slug, categorySlug)))
    .orderBy(desc(prompts.isFeatured), desc(prompts.copyCount));
  return rows.map(toTemplate);
}

export async function getTemplateBySlug(
  slug: string
): Promise<PublicTemplate | null> {
  const rows = await db()
    .select(selectFields)
    .from(prompts)
    .leftJoin(categories, eq(prompts.categoryId, categories.id))
    .where(and(eq(prompts.isPublished, true), eq(prompts.slug, slug)))
    .limit(1);
  return rows[0] ? toTemplate(rows[0]) : null;
}

/** Same-category siblings for internal linking on a detail page. */
export async function getRelatedTemplates(
  categorySlug: string,
  excludeSlug: string,
  limit = 6
): Promise<PublicTemplate[]> {
  const rows = await db()
    .select(selectFields)
    .from(prompts)
    .leftJoin(categories, eq(prompts.categoryId, categories.id))
    .where(
      and(
        eq(prompts.isPublished, true),
        eq(categories.slug, categorySlug),
        ne(prompts.slug, excludeSlug)
      )
    )
    .orderBy(desc(prompts.copyCount))
    .limit(limit);
  return rows.map(toTemplate);
}

/** Lightweight list for the sitemap (slug + category + lastmod). */
export async function getAllTemplateSlugs(): Promise<
  { slug: string; categorySlug: string | null; updatedAt: Date }[]
> {
  return db()
    .select({
      slug: prompts.slug,
      categorySlug: categories.slug,
      updatedAt: prompts.updatedAt,
    })
    .from(prompts)
    .leftJoin(categories, eq(prompts.categoryId, categories.id))
    .where(eq(prompts.isPublished, true));
}
