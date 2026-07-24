import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Cloudflare R2 (S3-compatible). TWO buckets, deliberately:
 *
 *   R2_BUCKET         public  — preview images/videos. Served straight off the
 *                              CDN via R2_PUBLIC_URL at zero egress cost.
 *   R2_ASSETS_BUCKET  private — paid template zips / .fig files. Public access
 *                              is disabled on this bucket; the only way out is
 *                              a short-lived presigned GET from the
 *                              entitlement-gated download route.
 *
 * R2 public access is per-BUCKET, not per-object — that's why paid assets need
 * their own bucket rather than a flag. Never write a zip to R2_BUCKET.
 *
 * Required env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 * R2_BUCKET, R2_PUBLIC_URL, R2_ASSETS_BUCKET.
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

/** Private-asset bucket configured? Gated separately so media keeps working. */
export function r2AssetsConfigured(): boolean {
  return Boolean(r2Configured() && process.env.R2_ASSETS_BUCKET);
}

function publicBucket(): string {
  return process.env.R2_BUCKET!;
}

function assetsBucket(): string {
  const bucket = process.env.R2_ASSETS_BUCKET;
  if (!bucket) throw new Error('R2_ASSETS_BUCKET is not set — paid assets have nowhere private to go');
  return bucket;
}

function publicUrlFor(key: string): string {
  return `${process.env.R2_PUBLIC_URL!.replace(/\/$/, '')}/${key}`;
}

/**
 * Two clients, one per bucket, because the two buckets can carry separate,
 * least-privilege S3 API tokens. The assets client uses R2_ASSETS_ACCESS_KEY_ID
 * / R2_ASSETS_SECRET_ACCESS_KEY when set, and otherwise falls back to the shared
 * R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY — so a single account-wide token still
 * works with no extra config. The account endpoint is the same for every bucket.
 */
const clients: Partial<Record<'public' | 'assets', S3Client>> = {};

function getR2Client(target: 'public' | 'assets' = 'public'): S3Client {
  if (!clients[target]) {
    const useAssetsCreds = target === 'assets' && process.env.R2_ASSETS_ACCESS_KEY_ID;
    clients[target] = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      // Large seed uploads occasionally hit transient TLS resets — retry them.
      maxAttempts: 5,
      credentials: {
        accessKeyId: (useAssetsCreds
          ? process.env.R2_ASSETS_ACCESS_KEY_ID
          : process.env.R2_ACCESS_KEY_ID)!,
        secretAccessKey: (useAssetsCreds
          ? process.env.R2_ASSETS_SECRET_ACCESS_KEY
          : process.env.R2_SECRET_ACCESS_KEY)!,
      },
    });
  }
  return clients[target]!;
}

/**
 * A stored `assetUrl` is either a bare R2 key in the private bucket (current)
 * or a full public URL from before the private bucket existed (legacy).
 */
export function isR2Key(value: string): boolean {
  return !/^https?:\/\//i.test(value);
}

/**
 * Server-side upload to the PUBLIC media bucket (scripts, seeders).
 * Browsers should use presignR2Upload instead — this needs the secret key
 * in-process. Returns the public CDN URL.
 */
export async function uploadToR2(key: string, body: Buffer, contentType: string) {
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: publicBucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return publicUrlFor(key);
}

/**
 * Server-side upload to the PRIVATE assets bucket. Returns the key — not a
 * URL — because the only readable form is a presigned URL that expires.
 * Store the key; presign at download time.
 */
export async function uploadAssetToR2(key: string, body: Buffer, contentType: string) {
  await getR2Client('assets').send(
    new PutObjectCommand({
      Bucket: assetsBucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return key;
}

/** Presigned PUT for direct browser→R2 upload (10 min validity). */
export async function presignR2Upload(
  key: string,
  contentType: string,
  target: 'public' | 'assets' = 'public'
) {
  const isAsset = target === 'assets';
  const command = new PutObjectCommand({
    Bucket: isAsset ? assetsBucket() : publicBucket(),
    Key: key,
    ContentType: contentType,
  });
  const signedUrl = await getSignedUrl(getR2Client(isAsset ? 'assets' : 'public'), command, {
    expiresIn: 600,
  });
  // Private-bucket objects have no public URL — the key is what gets stored.
  const publicUrl = isAsset ? null : publicUrlFor(key);
  return { signedUrl, publicUrl, key };
}

/**
 * Short-lived presigned GET for a private asset. Call this ONLY after the
 * caller's entitlement has been verified — it hands out a working download
 * link. `filename` sets the browser's save-as name.
 */
export async function presignR2Download(
  key: string,
  filename?: string,
  expiresIn = 300
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: assetsBucket(),
    Key: key,
    ...(filename
      ? {
          ResponseContentDisposition: `attachment; filename="${filename.replace(/"/g, '')}"`,
        }
      : {}),
  });
  return getSignedUrl(getR2Client('assets'), command, { expiresIn });
}
