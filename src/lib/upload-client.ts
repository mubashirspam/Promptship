'use client';

export type UploadKind = 'image' | 'video' | 'asset';

/**
 * Direct browser→R2 upload (admin only). Files never touch our server
 * (avoids Vercel's 4.5 MB body limit) — the server only issues a presigned
 * URL after verifying admin + file type/size, then the browser PUTs straight
 * to the zero-egress Cloudflare CDN bucket. Returns the public CDN URL.
 */
export async function uploadAdminFile(
  file: File,
  kind: UploadKind,
  onProgress?: (percent: number) => void
): Promise<string> {
  const contentType = file.type || 'application/octet-stream';
  const res = await fetch('/api/admin/upload-sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType, size: file.size, kind }),
  });
  if (res.status === 501) {
    throw new Error('R2 storage is not configured — set the R2_* env vars');
  }
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error?.message ?? 'Upload authorization failed');
  }

  // PUT with progress via XHR (fetch has no upload progress events)
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', json.data.signedUrl);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) onProgress((e.loaded / e.total) * 100);
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Upload failed (${xhr.status})`));
    xhr.onerror = () => reject(new Error('Upload failed — check the R2 bucket CORS settings'));
    xhr.send(file);
  });
  return json.data.publicUrl as string;
}
