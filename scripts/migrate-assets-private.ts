#!/usr/bin/env tsx
/**
 * One-off: move paid assets out of the PUBLIC R2 bucket into the private one.
 *
 * Before the private bucket existed, `prompts.assetUrl` held a public CDN URL
 * and the zip sat in R2_BUCKET — readable by anyone with the link, entitlement
 * or not. This copies each such object into R2_ASSETS_BUCKET and rewrites the
 * row to store the bare key, which the download route presigns per request.
 *
 * Rows whose assetUrl is already a key are skipped, so this is safe to re-run.
 *
 * The public original is NOT deleted by default — verify downloads work first,
 * then re-run with --delete-originals to close the exposure.
 *
 * Usage:
 *   pnpm db:migrate-assets -- --dry-run
 *   NODE_ENV=staging pnpm db:migrate-assets
 *   NODE_ENV=staging pnpm db:migrate-assets -- --delete-originals
 */

import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, isNotNull } from 'drizzle-orm';
import * as schema from '../src/lib/db/schema';
import { prompts } from '../src/lib/db/schema';
import { isR2Key } from '../src/lib/r2';

function client() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

/** Turn a stored public CDN URL back into the object key it points at. */
function keyFromPublicUrl(url: string): string | null {
  const base = process.env.R2_PUBLIC_URL!.replace(/\/$/, '');
  if (url.startsWith(base + '/')) return decodeURIComponent(url.slice(base.length + 1));
  // Different/older public host — fall back to the URL path.
  try {
    return decodeURIComponent(new URL(url).pathname.replace(/^\//, '')) || null;
  } catch {
    return null;
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const deleteOriginals = process.argv.includes('--delete-originals');

  const env = (process.env.NODE_ENV as string) || 'development';
  const databaseUrl =
    env === 'production'
      ? process.env.DATABASE_URL_PRODUCTION
      : env === 'staging'
        ? process.env.DATABASE_URL_STAGING
        : process.env.DATABASE_URL;

  if (!databaseUrl) throw new Error(`DATABASE_URL not found for environment: ${env}`);

  const publicBucket = process.env.R2_BUCKET;
  const assetsBucket = process.env.R2_ASSETS_BUCKET;
  if (!publicBucket || !assetsBucket) throw new Error('R2_BUCKET and R2_ASSETS_BUCKET must both be set');
  if (publicBucket === assetsBucket) throw new Error('R2_BUCKET and R2_ASSETS_BUCKET are the same bucket');

  const db = drizzle(neon(databaseUrl), { schema });
  const s3 = client();

  console.log(`\n${dryRun ? '[DRY RUN] ' : ''}Migrating assets → private bucket (${env.toUpperCase()})`);
  console.log(`  ${publicBucket} → ${assetsBucket}\n`);

  const rows = await db
    .select({ id: prompts.id, slug: prompts.slug, assetUrl: prompts.assetUrl })
    .from(prompts)
    .where(isNotNull(prompts.assetUrl));

  const needsMigration = rows.filter((r) => r.assetUrl && !isR2Key(r.assetUrl));
  console.log(
    `${rows.length} row(s) with an asset; ${needsMigration.length} still public, ${rows.length - needsMigration.length} already private\n`
  );

  if (needsMigration.length === 0) {
    console.log('Nothing to migrate.');
    process.exit(0);
  }

  let moved = 0;
  let failed = 0;

  for (const row of needsMigration) {
    const key = keyFromPublicUrl(row.assetUrl!);
    if (!key) {
      console.log(`  ! ${row.slug}: could not parse a key from ${row.assetUrl}`);
      failed++;
      continue;
    }

    if (dryRun) {
      console.log(`  [dry] ${row.slug}: ${key}`);
      continue;
    }

    try {
      // Copy first, verify, then rewrite the row — an interrupted run never
      // leaves a row pointing at an object that isn't there yet.
      await s3.send(
        new CopyObjectCommand({
          Bucket: assetsBucket,
          Key: key,
          CopySource: `${publicBucket}/${encodeURIComponent(key)}`,
        })
      );
      await s3.send(new HeadObjectCommand({ Bucket: assetsBucket, Key: key }));

      await db.update(prompts).set({ assetUrl: key, updatedAt: new Date() }).where(eq(prompts.id, row.id));

      if (deleteOriginals) {
        await s3.send(new DeleteObjectCommand({ Bucket: publicBucket, Key: key }));
      }

      moved++;
      console.log(`  + ${row.slug}: ${key}${deleteOriginals ? ' (public copy deleted)' : ''}`);
    } catch (error) {
      failed++;
      console.error(`  ! ${row.slug}: ${(error as Error).message}`);
    }
  }

  console.log(`\nDone. moved=${moved} failed=${failed}`);
  if (moved > 0 && !deleteOriginals) {
    console.log(
      'Public copies are still in place. Verify a download, then re-run with --delete-originals.'
    );
  }
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
