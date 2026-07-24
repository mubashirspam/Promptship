#!/usr/bin/env tsx
/**
 * Code Template Seeding — animaster asset library → prompts table
 *
 * Source layout (flat per category folder, grouped by id):
 *   3D Animation/
 *     3d-17.webp              preview image      → previewImageUrl + thumbnailUrl
 *     3d-17.webm              preview video      → previewVideoUrl
 *     3d-17-650.zip           the code           → assetUrl (entitlement-gated)
 *     3d-17-650-instruction.txt  (generic boilerplate — ignored, see NOTE)
 *
 * The zip/instruction files sometimes carry an extra numeric suffix the media
 * files don't (`3d-17` vs `3d-17-650`), so grouping is by the `<prefix>-<n>` id.
 *
 * NOTE: every instruction.txt in the library is byte-identical generic
 * "open in VSCode, npm install, npm run dev" boilerplate. It is deliberately
 * NOT written to detailedPrompt — that would put 120 duplicate rows in the DB.
 * Render it once in the UI instead.
 *
 * Titles/descriptions don't exist in the source, so they're generated from the
 * preview image via Claude vision and cached on disk (see META_CACHE).
 *
 * Usage:
 *   pnpm db:seed-code-templates -- --dry-run
 *   pnpm db:seed-code-templates:staging
 *   pnpm db:seed-code-templates:staging -- --category="3D Animation"
 */

import { readFileSync, existsSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';
import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import Anthropic from '@anthropic-ai/sdk';
import * as schema from '../src/lib/db/schema';
import { prompts, categories } from '../src/lib/db/schema';
import { uploadToR2, uploadAssetToR2, r2Configured, r2AssetsConfigured } from '../src/lib/r2';
import { parseCsv } from './lib/csv';
import {
  SOURCE_ROOT,
  CATEGORY_MAP,
  scanCategory,
  collisions,
  type TemplateGroup,
} from './lib/animaster';

type Database = NeonHttpDatabase<typeof schema>;

const META_CACHE = join(process.cwd(), 'scripts', '.template-meta-cache.json');

interface GeneratedMeta {
  title: string;
  description: string;
  complexity: 'simple' | 'medium' | 'complex';
}

/* ------------------------------------------------------------------ */
/* Source scanning                                                     */
/* ------------------------------------------------------------------ */


/* ------------------------------------------------------------------ */
/* Metadata generation (Claude vision)                                 */
/* ------------------------------------------------------------------ */

const metaCache: Record<string, GeneratedMeta> = existsSync(META_CACHE)
  ? JSON.parse(readFileSync(META_CACHE, 'utf-8'))
  : {};

function saveCache() {
  writeFileSync(META_CACHE, JSON.stringify(metaCache, null, 2));
}

const META_SCHEMA = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description:
        'Short product name for this web animation template, 2-5 words, title case. No numbers, no "template"/"component" suffix.',
    },
    description: {
      type: 'string',
      description:
        'One sentence (15-30 words) describing what the animation does and where a developer would use it. No marketing fluff.',
    },
    complexity: { type: 'string', enum: ['simple', 'medium', 'complex'] },
  },
  required: ['title', 'description', 'complexity'],
  additionalProperties: false,
} as const;

async function generateMeta(
  anthropic: Anthropic,
  group: TemplateGroup,
  categoryName: string
): Promise<GeneratedMeta> {
  if (metaCache[group.id]) return metaCache[group.id];

  if (!group.webp) {
    // No preview to look at — fall back to a derived title.
    const fallback: GeneratedMeta = {
      title: titleFromId(group.id),
      description: `${categoryName} template for web projects.`,
      complexity: 'medium',
    };
    metaCache[group.id] = fallback;
    return fallback;
  }

  const imagePath = join(SOURCE_ROOT, group.categoryFolder, group.webp);
  const data = readFileSync(imagePath).toString('base64');

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'low',
      format: { type: 'json_schema', schema: META_SCHEMA },
    },
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/webp', data } },
          {
            type: 'text',
            text: `This is a preview frame from a "${categoryName}" web animation code template (vanilla HTML/CSS/JS). Name it and describe it for a template marketplace listing.`,
          },
        ],
      },
    ],
  });

  if (response.stop_reason === 'refusal') {
    throw new Error(`Model refused to describe ${group.id}`);
  }

  const text = response.content.find((b) => b.type === 'text');
  if (!text || text.type !== 'text') throw new Error(`No text output for ${group.id}`);

  const meta = JSON.parse(text.text) as GeneratedMeta;
  metaCache[group.id] = meta;
  return meta;
}

function titleFromId(id: string): string {
  return id
    .split('-')
    .map((p) => (/^\d+$/.test(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(' ');
}

/* ------------------------------------------------------------------ */
/* DB helpers                                                          */
/* ------------------------------------------------------------------ */

async function ensureCategory(db: Database, folder: string): Promise<string> {
  const { slug, name } = CATEGORY_MAP[folder];
  const existing = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });
  if (existing) return existing.id;

  const [created] = await db
    .insert(categories)
    .values({ name, slug, description: `${name} templates` })
    .returning();
  console.log(`  + category: ${name}`);
  return created.id;
}

const MIME: Record<string, string> = {
  webp: 'image/webp',
  webm: 'video/webm',
  zip: 'application/zip',
};

/** Retry transient network/TLS failures the S3 SDK won't retry on its own. */
async function withRetry<T>(label: string, fn: () => Promise<T>, attempts = 4): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i >= attempts) throw err;
      const wait = 500 * 2 ** (i - 1);
      console.log(`    retry ${i}/${attempts - 1} ${label} after ${(err as Error).message.split('\n')[0]}`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

/**
 * Previews go to the public CDN bucket; the zip goes to the private bucket and
 * yields a KEY rather than a URL (see src/lib/r2.ts).
 */
async function upload(
  group: TemplateGroup,
  file: string,
  slug: string,
  dryRun: boolean
): Promise<string> {
  const ext = file.split('.').pop()!;
  const isAsset = ext === 'zip';
  const key = `templates/${slug}/${slug}.${ext}`;
  if (dryRun) return `[dry-run] ${key}`;

  const body = readFileSync(join(SOURCE_ROOT, group.categoryFolder, file));
  return withRetry(key, () =>
    isAsset ? uploadAssetToR2(key, body, MIME[ext]) : uploadToR2(key, body, MIME[ext])
  );
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit?.split('=').slice(1).join('=');
}

/**
 * Titles/descriptions from a hand-filled CSV (see export-templates-csv.ts).
 * Takes precedence over AI generation, so a filled sheet means no API calls.
 */
function loadMetaCsv(file: string): Record<string, GeneratedMeta> {
  const out: Record<string, GeneratedMeta> = {};
  for (const row of parseCsv(readFileSync(file, 'utf-8'))) {
    if (!row.slug || !row.title) continue;
    out[row.slug] = {
      title: row.title,
      description: row.description || '',
      complexity: (['simple', 'medium', 'complex'].includes(row.complexity)
        ? row.complexity
        : 'medium') as GeneratedMeta['complexity'],
    };
  }
  return out;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const noAi = process.argv.includes('--no-ai');
  // --category accepts a single folder or a comma-separated list, so you can
  // seed just newly-added categories without re-uploading existing ones.
  const onlyCategories = arg('category')
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const metaCsvFile = arg('meta-csv');
  const limit = arg('limit') ? Number(arg('limit')) : Infinity;

  const csvMeta = metaCsvFile ? loadMetaCsv(metaCsvFile) : {};
  if (metaCsvFile) {
    console.log(`Loaded ${Object.keys(csvMeta).length} title(s) from ${metaCsvFile}`);
  }

  const env = (process.env.NODE_ENV as string) || 'development';
  const databaseUrl =
    env === 'production'
      ? process.env.DATABASE_URL_PRODUCTION
      : env === 'staging'
        ? process.env.DATABASE_URL_STAGING
        : process.env.DATABASE_URL;

  if (!databaseUrl) throw new Error(`DATABASE_URL not found for environment: ${env}`);
  if (!dryRun && !r2Configured()) throw new Error('R2 is not configured — check .env.local');
  if (!dryRun && !r2AssetsConfigured()) {
    throw new Error('R2_ASSETS_BUCKET is not set — refusing to put zips in the public bucket');
  }

  const anthropic = noAi ? null : new Anthropic();
  const db = drizzle(neon(databaseUrl), { schema });

  console.log(`\n${dryRun ? '[DRY RUN] ' : ''}Seeding ${env.toUpperCase()} database`);
  console.log(`Source: ${SOURCE_ROOT}\n`);

  const folders = Object.keys(CATEGORY_MAP).filter(
    (f) => (!onlyCategories || onlyCategories.includes(f)) && existsSync(join(SOURCE_ROOT, f))
  );

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let count = 0;

  for (const folder of folders) {
    const groups = scanCategory(folder);
    const withCode = groups.filter((g) => g.zip);
    console.log(
      `${folder}: ${withCode.length} with code, ${groups.length - withCode.length} preview-only (skipped)`
    );
    for (const c of collisions(groups)) {
      console.log(
        `  ! ${c.id}: ${c.zipAlternatives.length + 1} zips with different contents — using ${c.zip}, ignoring ${c.zipAlternatives.join(', ')}`
      );
    }

    const categoryId = dryRun ? 'dry-run' : await ensureCategory(db, folder);

    for (const group of withCode) {
      if (count >= limit) break;
      count++;

      const slug = group.id;
      // Priority: hand-authored CSV → AI → derived placeholder.
      const meta =
        csvMeta[slug] ??
        (anthropic
          ? await generateMeta(anthropic, group, CATEGORY_MAP[folder].name)
          : {
              title: titleFromId(group.id),
              description: `${CATEGORY_MAP[folder].name} template.`,
              complexity: 'medium' as const,
            });

      const zipBytes = statSync(join(SOURCE_ROOT, folder, group.zip!)).size;

      const assetUrl = await upload(group, group.zip!, slug, dryRun);
      const previewImageUrl = group.webp
        ? await upload(group, group.webp, slug, dryRun)
        : null;
      const previewVideoUrl = group.webm
        ? await upload(group, group.webm, slug, dryRun)
        : null;

      const row = {
        categoryId,
        title: meta.title,
        slug,
        description: meta.description,
        promptText: meta.description,
        templateType: 'component',
        platform: 'web',
        assetKind: 'code' as const,
        assetUrl,
        previewImageUrl,
        previewVideoUrl,
        thumbnailUrl: previewImageUrl,
        frameworks: ['vanilla'],
        isFree: false,
        isPremium: true,
        // Staging lands unpublished so nothing goes live before review.
        isPublished: env === 'production',
        layoutMetadata: {
          complexity: meta.complexity,
          responsive: true,
          darkMode: false,
        },
      };

      if (dryRun) {
        console.log(
          `  [dry] ${slug.padEnd(12)} ${meta.title.padEnd(28)} ${(zipBytes / 1e6).toFixed(1)}MB`
        );
        continue;
      }

      const existing = await db.query.prompts.findFirst({ where: eq(prompts.slug, slug) });
      if (existing) {
        await db
          .update(prompts)
          .set({ ...row, updatedAt: new Date() })
          .where(eq(prompts.id, existing.id));
        updated++;
        console.log(`  ~ ${slug}: ${meta.title}`);
      } else {
        await db.insert(prompts).values(row);
        created++;
        console.log(`  + ${slug}: ${meta.title}`);
      }
    }

    skipped += groups.length - withCode.length;
    if (anthropic) saveCache();
  }

  if (anthropic) saveCache();
  console.log(
    `\nDone. created=${created} updated=${updated} skipped-no-code=${skipped}${dryRun ? ' (dry run — nothing written)' : ''}`
  );
  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
