#!/usr/bin/env tsx
/**
 * Export a CSV of code templates for manual title/description authoring.
 *
 * Two sources:
 *   --from=source  (default) scan the animaster folders — works before anything
 *                  is seeded, and needs neither R2 nor a database.
 *   --from=db      read rows already in the staging DB (round-trip existing
 *                  values so you can edit rather than retype them).
 *
 * Fill in `title` and `description`, then apply with:
 *   pnpm db:import-templates-csv -- --file=templates.csv
 *
 * The `preview_image` column is an absolute path to the .webp — open it to see
 * what you're naming. It is informational only and is never imported.
 *
 * Usage:
 *   pnpm db:export-templates-csv
 *   pnpm db:export-templates-csv -- --from=db --out=review.csv
 */

import { writeFileSync, statSync } from 'fs';
import { join } from 'path';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '../src/lib/db/schema';
import { prompts, categories } from '../src/lib/db/schema';
import { toCsv } from './lib/csv';
import { SOURCE_ROOT, CATEGORY_MAP, scanCategory, collisions } from './lib/animaster';

const COLUMNS = [
  'slug',
  'category',
  'title',
  'description',
  'complexity',
  'zip_mb',
  'preview_image',
] as const;

type Row = Record<(typeof COLUMNS)[number], string>;

function fromSource(): Row[] {
  const rows: Row[] = [];

  for (const folder of Object.keys(CATEGORY_MAP)) {
    const dir = join(SOURCE_ROOT, folder);
    const groups = scanCategory(folder);

    for (const g of groups) {
      // Preview-only items have no code to sell — same rule as the seeder.
      if (!g.zip) continue;
      rows.push({
        slug: g.id,
        category: CATEGORY_MAP[folder].slug,
        title: '',
        description: '',
        complexity: 'medium',
        zip_mb: (statSync(join(dir, g.zip)).size / 1e6).toFixed(2),
        preview_image: g.webp ? join(dir, g.webp) : '',
      });
    }

    for (const c of collisions(groups)) {
      console.log(
        `  ! ${c.id}: ${c.zipAlternatives.length + 1} zips — using ${c.zip}, ignoring ${c.zipAlternatives.join(', ')}`
      );
    }
  }

  return rows;
}

async function fromDb(): Promise<Row[]> {
  const env = (process.env.NODE_ENV as string) || 'development';
  const databaseUrl =
    env === 'production'
      ? process.env.DATABASE_URL_PRODUCTION
      : env === 'staging'
        ? process.env.DATABASE_URL_STAGING
        : process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error(`DATABASE_URL not found for environment: ${env}`);

  const db = drizzle(neon(databaseUrl), { schema });
  const rows = await db
    .select({
      slug: prompts.slug,
      title: prompts.title,
      description: prompts.description,
      layoutMetadata: prompts.layoutMetadata,
      categorySlug: categories.slug,
    })
    .from(prompts)
    .leftJoin(categories, eq(prompts.categoryId, categories.id))
    .where(eq(prompts.assetKind, 'code'));

  return rows
    .sort((a, b) => a.slug.localeCompare(b.slug, undefined, { numeric: true }))
    .map((r) => ({
      slug: r.slug,
      category: r.categorySlug ?? '',
      title: r.title ?? '',
      description: r.description ?? '',
      complexity: r.layoutMetadata?.complexity ?? 'medium',
      zip_mb: '',
      preview_image: '',
    }));
}

function arg(name: string): string | undefined {
  return process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
}

async function main() {
  const from = arg('from') ?? 'source';
  const out = arg('out') ?? 'templates.csv';

  const rows = from === 'db' ? await fromDb() : fromSource();

  if (rows.length === 0) {
    console.log(`No templates found (source: ${from}).`);
    process.exit(0);
  }

  writeFileSync(out, toCsv(rows, [...COLUMNS]), 'utf-8');

  const byCategory = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`\nWrote ${rows.length} row(s) to ${out} (source: ${from})\n`);
  for (const [cat, n] of Object.entries(byCategory)) {
    console.log(`  ${cat.padEnd(22)} ${n}`);
  }
  console.log(`\nFill in the "title" and "description" columns, then run:`);
  console.log(`  NODE_ENV=staging pnpm db:import-templates-csv -- --file=${out}`);
  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
