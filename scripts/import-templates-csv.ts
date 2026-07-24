#!/usr/bin/env tsx
/**
 * Apply a filled-in CSV of titles/descriptions to existing template rows,
 * matched by `slug`. Update-only — it never creates rows, so a typo'd slug is
 * reported rather than silently inserting a junk template.
 *
 * Columns used: slug (required), title, description, complexity.
 * Everything else in the file (zip_mb, preview_image, category) is ignored.
 * Blank cells are skipped, so you can fill the file in over several passes
 * without wiping values you already set.
 *
 * Usage:
 *   NODE_ENV=staging pnpm db:import-templates-csv -- --file=templates.csv --dry-run
 *   NODE_ENV=staging pnpm db:import-templates-csv -- --file=templates.csv
 *   NODE_ENV=staging pnpm db:import-templates-csv -- --file=templates.csv --publish
 */

import { readFileSync, existsSync } from 'fs';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '../src/lib/db/schema';
import { prompts } from '../src/lib/db/schema';
import { parseCsv } from './lib/csv';

const VALID_COMPLEXITY = new Set(['simple', 'medium', 'complex']);

function arg(name: string): string | undefined {
  return process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
}

async function main() {
  const file = arg('file') ?? 'templates.csv';
  const dryRun = process.argv.includes('--dry-run');
  const publish = process.argv.includes('--publish');

  if (!existsSync(file)) throw new Error(`CSV not found: ${file}`);

  const env = (process.env.NODE_ENV as string) || 'development';
  const databaseUrl =
    env === 'production'
      ? process.env.DATABASE_URL_PRODUCTION
      : env === 'staging'
        ? process.env.DATABASE_URL_STAGING
        : process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error(`DATABASE_URL not found for environment: ${env}`);

  const db = drizzle(neon(databaseUrl), { schema });
  const rows = parseCsv(readFileSync(file, 'utf-8'));

  if (rows.length === 0) throw new Error(`${file} has no data rows`);
  if (!('slug' in rows[0])) throw new Error(`${file} has no "slug" column`);

  console.log(
    `\n${dryRun ? '[DRY RUN] ' : ''}Applying ${file} → ${env.toUpperCase()} (${rows.length} row(s))\n`
  );

  let updated = 0;
  let skipped = 0;
  let missing = 0;
  const problems: string[] = [];

  for (const row of rows) {
    const slug = row.slug?.trim();
    if (!slug) continue;

    const patch: Record<string, unknown> = {};
    if (row.title) patch.title = row.title;
    if (row.description) {
      patch.description = row.description;
      // promptText is NOT NULL and shown in listings — keep it in step.
      patch.promptText = row.description;
    }

    if (row.complexity) {
      if (!VALID_COMPLEXITY.has(row.complexity)) {
        problems.push(`${slug}: invalid complexity "${row.complexity}" (skipped that field)`);
      } else {
        patch.complexity = row.complexity;
      }
    }
    if (publish) patch.isPublished = true;

    if (Object.keys(patch).length === 0) {
      skipped++;
      continue;
    }

    const existing = await db.query.prompts.findFirst({ where: eq(prompts.slug, slug) });
    if (!existing) {
      missing++;
      problems.push(`${slug}: no row with this slug — not created`);
      continue;
    }

    // complexity lives inside the layoutMetadata JSON blob; merge, don't clobber.
    const { complexity, ...columns } = patch;
    const values: Record<string, unknown> = { ...columns };
    if (complexity) {
      values.layoutMetadata = { ...(existing.layoutMetadata ?? {}), complexity };
    }

    if (dryRun) {
      console.log(`  [dry] ${slug.padEnd(12)} ${(row.title || existing.title || '').slice(0, 40)}`);
      updated++;
      continue;
    }

    await db
      .update(prompts)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(prompts.id, existing.id));
    updated++;
    console.log(`  ~ ${slug.padEnd(12)} ${(row.title || existing.title || '').slice(0, 40)}`);
  }

  if (problems.length) {
    console.log(`\nProblems (${problems.length}):`);
    for (const p of problems) console.log(`  ! ${p}`);
  }

  console.log(
    `\nDone. updated=${updated} blank-skipped=${skipped} slug-not-found=${missing}` +
      `${dryRun ? ' (dry run — nothing written)' : ''}${publish ? ' (published)' : ''}`
  );
  process.exit(missing > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
