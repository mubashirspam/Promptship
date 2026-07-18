import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Cloudflare R2 (S3-compatible) — primary media storage.
 * Zero egress cost: preview videos/images stream free via Cloudflare's CDN.
 *
 * Required env (see .env.local): R2_ACCOUNT_ID, R2_ACCESS_KEY_ID,
 * R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL (the bucket's public/custom
 * domain, e.g. https://cdn.promtify.dev).
 */

export function r2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_URL &&
      !process.env.R2_ACCOUNT_ID.startsWith('your_')
  );
}

let client: S3Client | null = null;

function getR2Client(): S3Client {
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return client;
}

/** Presigned PUT for direct browser→R2 upload (10 min validity). */
export async function presignR2Upload(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  const signedUrl = await getSignedUrl(getR2Client(), command, { expiresIn: 600 });
  const publicUrl = `${process.env.R2_PUBLIC_URL!.replace(/\/$/, '')}/${key}`;
  return { signedUrl, publicUrl };
}
