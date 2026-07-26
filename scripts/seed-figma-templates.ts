#!/usr/bin/env tsx
/**
 * Seed Figma design templates (assetKind='figma') into the prompts table.
 *
 * - Reads a JSON list of { id, name, description } (see --json).
 * - Matches each template NAME to a .webm file in the videos dir by token
 *   containment (one side's tokens fully inside the other's) — safe fuzzy
 *   matching, no false positives. mp4s are ignored; images added later.
 * - Uploads a matched webm to the PUBLIC R2 bucket → previewVideoUrl.
 * - Every row gets the SAME MCP prompt as promptText/detailedPrompt.
 * - assetUrl (figma link) and previewImageUrl are left null — added later.
 * - Rows are published and filed under the 'figma-kits' category.
 *
 * Usage:
 *   NODE_ENV=staging pnpm db:seed-figma -- --dry-run
 *   NODE_ENV=staging pnpm db:seed-figma
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '../src/lib/db/schema';
import { prompts, categories } from '../src/lib/db/schema';
import { uploadToR2, r2Configured } from '../src/lib/r2';

const VIDEO_DIR = '/Users/mymac/Documents/video-downloader/videos';

const MCP_PROMPT = `Implement this Figma template with the Figma MCP server.

1. Connect the Figma MCP server and open this template's Figma file.
2. Run get_design_context on the target frame to pull the exact layout, spacing, typography, colors, and assets.
3. Generate production-ready, responsive code in your stack (React + Tailwind by default) that matches the design faithfully.
4. Download and wire any images, icons, and design tokens; keep components clean and reusable.
5. Check responsive breakpoints, dark mode, and accessibility before shipping.`;

interface FigmaTemplate {
  id: string;
  name: string;
  description: string;
}

/**
 * Explicit matches for videos whose filename describes the template instead of
 * naming it (verified against each template's description). Keyed by slug.
 */
const MANUAL_MATCHES: Record<string, string> = {
  'bloom-editorial': 'organico-editorial.webm',
  'midnight-couture': 'dark-luxury.webm',
  'enchanted-diary': 'minimal-bold.webm',
  'folio-suite': 'cards-servico-editorial.webm',
  'whisper-nav': 'navigation-bar-minimal.webm',
  'dulce-flask': 'stats-flutuantes.webm',
  'aero-sync': 'smart-product-3d.webm',
  'aqua-veil': 'aqua-glass.webm',
  'pierce-the-emperor': 'museum-imperial.webm',
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function tokens(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 1) // drop 1-char noise
  );
}

/** Match if one token set is fully contained in the other (no partial overlaps). */
function nameMatchesVideo(name: string, videoBase: string): boolean {
  const a = tokens(name);
  const b = tokens(videoBase);
  if (a.size === 0 || b.size === 0) return false;
  const [small, big] = a.size <= b.size ? [a, b] : [b, a];
  for (const t of small) if (!big.has(t)) return false;
  return true;
}

async function ensureCategory(db: NeonHttpDatabase<typeof schema>): Promise<string> {
  const existing = await db.query.categories.findFirst({
    where: eq(categories.slug, 'figma-kits'),
  });
  if (existing) return existing.id;
  const [created] = await db
    .insert(categories)
    .values({
      name: 'Figma Kits',
      slug: 'figma-kits',
      description: 'Premium Figma design templates — heroes, sections and full landing pages.',
    })
    .returning();
  console.log('  + category: Figma Kits');
  return created.id;
}

function arg(name: string): string | undefined {
  return process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const jsonPath = arg('json');
  if (!jsonPath) throw new Error('Pass --json=<path to figma-templates.json>');

  const env = (process.env.NODE_ENV as string) || 'development';
  const databaseUrl =
    env === 'production'
      ? process.env.DATABASE_URL_PRODUCTION
      : env === 'staging'
        ? process.env.DATABASE_URL_STAGING
        : process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error(`DATABASE_URL not found for environment: ${env}`);
  if (!dryRun && !r2Configured()) throw new Error('R2 is not configured');

  const templates: FigmaTemplate[] = JSON.parse(readFileSync(jsonPath, 'utf-8'));
  const webms = readdirSync(VIDEO_DIR).filter((f) => f.toLowerCase().endsWith('.webm'));

  const db = drizzle(neon(databaseUrl), { schema });
  console.log(`\n${dryRun ? '[DRY RUN] ' : ''}Seeding ${templates.length} Figma templates → ${env.toUpperCase()}`);
  console.log(`Videos: ${webms.length} webm files\n`);

  const categoryId = dryRun ? 'dry-run' : await ensureCategory(db);

  let created = 0;
  let updated = 0;
  const usedVideos = new Set<string>();
  const noVideo: string[] = [];

  for (const t of templates) {
    const slug = slugify(t.name);
    const manual = MANUAL_MATCHES[slug];
    const match =
      manual && webms.includes(manual)
        ? manual
        : webms.find((v) => nameMatchesVideo(t.name, v.replace(/\.webm$/i, '')));

    let previewVideoUrl: string | null = null;
    if (match) {
      usedVideos.add(match);
      const key = `templates/${slug}/${slug}.webm`;
      previewVideoUrl = dryRun
        ? `[dry-run] ${key}`
        : await uploadToR2(key, readFileSync(join(VIDEO_DIR, match)), 'video/webm');
    } else {
      noVideo.push(t.name);
    }

    const row = {
      categoryId,
      title: t.name,
      slug,
      description: t.description,
      promptText: MCP_PROMPT,
      detailedPrompt: MCP_PROMPT,
      templateType: 'component',
      platform: 'web',
      assetKind: 'figma' as const,
      assetUrl: null, // figma link added later
      previewImageUrl: null, // images added later
      previewVideoUrl,
      thumbnailUrl: null,
      frameworks: null,
      isFree: false,
      isPremium: true,
      isPublished: true,
    };

    console.log(
      `  ${match ? '🎬' : '  '} ${slug.padEnd(22)} ${match ?? '(no video)'}`
    );

    if (dryRun) continue;

    const existing = await db.query.prompts.findFirst({ where: eq(prompts.slug, slug) });
    if (existing) {
      await db.update(prompts).set({ ...row, updatedAt: new Date() }).where(eq(prompts.id, existing.id));
      updated++;
    } else {
      await db.insert(prompts).values(row);
      created++;
    }
  }

  const unusedVideos = webms.filter((v) => !usedVideos.has(v));
  console.log(`\n— Templates with no matched video (${noVideo.length}): ${noVideo.join(', ')}`);
  console.log(`— Videos not matched to any template (${unusedVideos.length}): ${unusedVideos.join(', ')}`);
  console.log(
    `\nDone. created=${created} updated=${updated} videos-attached=${usedVideos.size}${dryRun ? ' (dry run — nothing written)' : ''}`
  );
  process.exit(0);
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
