'use client';

import { toast } from 'sonner';

/**
 * Fetch a template's asset (Figma link / code zip) through the
 * entitlement-gated download endpoint. Asset URLs are never present in page
 * payloads — every retrieval re-checks access server-side and is logged.
 */
export async function fetchTemplateAsset(templateId: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/templates/${templateId}/download`);
    const json = await res.json();
    if (!json.success) {
      toast.error(json.error?.message ?? 'Access required');
      return null;
    }
    if (!json.data.assetUrl) {
      toast.error('No file attached to this template yet');
      return null;
    }
    return json.data.assetUrl as string;
  } catch {
    toast.error('Failed to fetch the file — try again');
    return null;
  }
}

export async function openTemplateFigma(templateId: string) {
  const url = await fetchTemplateAsset(templateId);
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
}

export async function downloadTemplateZip(templateId: string) {
  const url = await fetchTemplateAsset(templateId);
  if (url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
