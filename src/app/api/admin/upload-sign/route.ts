import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { r2Configured, r2AssetsConfigured, presignR2Upload } from '@/lib/r2';

const KIND_RULES = {
  image: {
    prefix: 'previews/image',
    types: /^image\//,
    maxBytes: 15 * 1024 * 1024,
    target: 'public',
  },
  video: {
    prefix: 'previews/video',
    types: /^video\//,
    maxBytes: 300 * 1024 * 1024,
    target: 'public',
  },
  // Paid assets go to the private bucket — never the public CDN one.
  asset: {
    prefix: 'templates',
    types: /^(application\/zip|application\/x-zip-compressed|application\/octet-stream)$/,
    maxBytes: 1024 * 1024 * 1024,
    target: 'assets',
  },
} as const;

/**
 * POST { filename, contentType, size, kind: 'image'|'video'|'asset' }
 * → { signedUrl, publicUrl, key } for direct browser→R2 upload.
 *
 * `publicUrl` is null for kind 'asset' (private bucket has no public URL) —
 * the caller stores `key` and the download route presigns it per request.
 * Returns 501 when R2 isn't configured — the client falls back to Vercel Blob.
 */
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  if (!r2Configured()) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_CONFIGURED', message: 'R2 is not configured' } },
      { status: 501 }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    const kind = body?.kind as keyof typeof KIND_RULES;
    const filename = String(body?.filename ?? '');
    const contentType = String(body?.contentType ?? '');
    const size = Number(body?.size ?? 0);

    const rule = KIND_RULES[kind];
    if (!rule || !filename) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'kind and filename required' } },
        { status: 400 }
      );
    }
    if (!rule.types.test(contentType)) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_TYPE', message: `Invalid content type for ${kind}` } },
        { status: 400 }
      );
    }
    if (!Number.isFinite(size) || size <= 0 || size > rule.maxBytes) {
      return NextResponse.json(
        { success: false, error: { code: 'TOO_LARGE', message: `Max size for ${kind} is ${Math.round(rule.maxBytes / 1024 / 1024)} MB` } },
        { status: 400 }
      );
    }

    if (rule.target === 'assets' && !r2AssetsConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_CONFIGURED',
            message: 'R2_ASSETS_BUCKET is not set — refusing to put a paid asset in the public bucket',
          },
        },
        { status: 501 }
      );
    }

    // Unguessable key: sanitized name + random suffix
    const safeName = filename.toLowerCase().replace(/[^a-z0-9._-]/g, '-').slice(-80);
    const key = `${rule.prefix}/${crypto.randomUUID().slice(0, 8)}-${safeName}`;

    const { signedUrl, publicUrl } = await presignR2Upload(key, contentType, rule.target);
    return NextResponse.json({ success: true, data: { signedUrl, publicUrl, key } });
  } catch (error) {
    console.error('Upload sign error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SIGN_FAILED', message: 'Failed to create upload URL' } },
      { status: 500 }
    );
  }
}
