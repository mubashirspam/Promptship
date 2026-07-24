#!/usr/bin/env tsx
/**
 * Promote reviewed code templates: staging DB → production DB.
 *
 * Copies rows you already approved in staging rather than re-deriving them from
 * source files, so production gets exactly what you reviewed. R2 asset URLs are
 * shared between environments, so nothing is re-uploaded.
 *
 * Categories referenced by the promoted rows are created in production first.
 *
 * Usage:
 *   pnpm db:promote-templates -- --dry-run
 *   pnpm db:promote-templates                       # all code templates
 *   pnpm db:promote-templates -- --slug=3d-17,3d-18
 *   pnpm db:promote-templates -- --category=3d-animation
 *   pnpm db:promote-templates -- --publish          # also set isPublished=true
 */

import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq, and, inArray } from 'drizzle-orm';
import * as schema from '../src/lib/db/schema';
import { prompts, categories } from '../src/lib/db/schema';

type Database = NeonHttpDatabase<typeof schema>;

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit?.split('=').slice(1).join('=');
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const publish = process.argv.includes('--publish');
  const slugFilter = arg('slug')?.split(',').map((s) => s.trim()).filter(Boolean);
  const categoryFilter = arg('category');

  const stagingUrl = process.env.DATABASE_URL_STAGING;
  const productionUrl = process.env.DATABASE_URL_PRODUCTION;
  if (!stagingUrl) throw new Error('DATABASE_URL_STAGING not set');
  if (!productionUrl) throw new Error('DATABASE_URL_PRODUCTION not set');
  if (stagingUrl === productionUrl) {
    throw new Error('STAGING and PRODUCTION URLs are identical — refusing to run');
  }

  const staging: Database = drizzle(neon(stagingUrl), { schema });
  const production: Database = drizzle(neon(productionUrl), { schema });

  console.log(`\n${dryRun ? '[DRY RUN] ' : ''}Promoting staging → production\n`);

  // 1. Read the approved rows out of staging.
  const stagingCategories = await staging.select().from(categories);
  const categoryById = new Map(stagingCategories.map((c) => [c.id, c]));

  let rows = await staging
    .select()
    .from(prompts)
    .where(
      slugFilter?.length
        ? and(eq(prompts.assetKind, 'code'), inArray(prompts.slug, slugFilter))
        : eq(prompts.assetKind, 'code')
    );

  if (categoryFilter) {
    rows = rows.filter((r) => r.categoryId && categoryById.get(r.categoryId)?.slug === categoryFilter);
  }

  if (rows.length === 0) {
    console.log('Nothing matched — no rows promoted.');
    process.exit(0);
  }

  if (slugFilter?.length) {
    const found = new Set(rows.map((r) => r.slug));
    const missing = slugFilter.filter((s) => !found.has(s));
    if (missing.length) console.log(`Not found in staging: ${missing.join(', ')}\n`);
  }

  console.log(`${rows.length} template(s) to promote:`);
  for (const r of rows) {
    const cat = r.categoryId ? categoryById.get(r.categoryId)?.slug : '—';
    console.log(`  ${r.slug.padEnd(12)} ${(r.title ?? '').padEnd(28)} [${cat}]`);
  }

  if (dryRun) {
    console.log('\n[dry run] Nothing written to production.');
    process.exit(0);
  }

  // 2. Mirror the categories those rows depend on.
  const neededCategoryIds = [...new Set(rows.map((r) => r.categoryId).filter(Boolean))] as string[];
  const prodCategoryIdBySlug = new Map<string, string>();

  for (const id of neededCategoryIds) {
    const source = categoryById.get(id);
    if (!source) continue;

    const existing = await production.query.categories.findFirst({
      where: eq(categories.slug, source.slug),
    });
    if (existing) {
      prodCategoryIdBySlug.set(source.slug, existing.id);
    } else {
      const [insertedCategory] = await production
        .insert(categories)
        .values({
          name: source.name,
          slug: source.slug,
          description: source.description,
          icon: source.icon,
          displayOrder: source.displayOrder,
        })
        .returning();
      prodCategoryIdBySlug.set(source.slug, insertedCategory.id);
      console.log(`  + category: ${source.name}`);
    }
  }

  // 3. Upsert the templates by slug.
  let created = 0;
  let updated = 0;

  for (const row of rows) {
    const sourceCategory = row.categoryId ? categoryById.get(row.categoryId) : undefined;
    // Category IDs differ per database — remap via slug.
    const categoryId = sourceCategory
      ? (prodCategoryIdBySlug.get(sourceCategory.slug) ?? null)
      : null;

    // Drop the staging id/timestamps; production keeps its own.
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = row;
    const values = {
      ...rest,
      categoryId,
      isPublished: publish ? true : row.isPublished,
    };

    const existing = await production.query.prompts.findFirst({
      where: eq(prompts.slug, row.slug),
    });

    if (existing) {
      await production
        .update(prompts)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(prompts.id, existing.id));
      updated++;
      console.log(`  ~ ${row.slug}`);
    } else {
      await production.insert(prompts).values(values);
      created++;
      console.log(`  + ${row.slug}`);
    }
  }

  console.log(
    `\nDone. created=${created} updated=${updated}${publish ? ' (published)' : ' (isPublished carried over from staging)'}`
  );
  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
