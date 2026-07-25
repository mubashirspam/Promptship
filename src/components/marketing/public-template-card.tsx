import Link from 'next/link';
import { Lock, Copy } from 'lucide-react';
import type { PublicTemplate } from '@/lib/templates/public-queries';

function isVideoUrl(url: string | null): boolean {
  if (!url) return false;
  return (
    url.includes('.mp4') ||
    url.includes('.webm') ||
    url.includes('.m3u8') ||
    url.includes('.ogv')
  );
}

export function templateHref(t: {
  categorySlug: string | null;
  slug: string;
}): string {
  return t.categorySlug
    ? `/templates/${t.categorySlug}/${t.slug}`
    : `/templates/${t.slug}`;
}

/**
 * Server-rendered template card for the public catalog/category pages.
 * Media shows at its natural aspect ratio; the title/category are always in the
 * DOM (visible + crawlable) for SEO.
 */
export function PublicTemplateCard({ template }: { template: PublicTemplate }) {
  const media = template.previewVideoUrl || template.previewImageUrl;
  const asVideo = isVideoUrl(media);

  return (
    <Link href={templateHref(template)} className="group mb-4 block break-inside-avoid">
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111] transition-colors duration-300 hover:border-white/20">
        <div className="relative w-full">
          {asVideo && media ? (
            <video
              src={media}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="block h-auto w-full"
            />
          ) : media ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media}
              alt={`${template.title} — ${template.categoryName ?? 'template'} preview`}
              loading="lazy"
              className="block h-auto w-full"
            />
          ) : (
            <div className="aspect-[4/3] w-full bg-gradient-to-br from-violet-700 to-indigo-900" />
          )}
        </div>
        <div className="flex items-center justify-between gap-2 p-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">
              {template.title}
            </h3>
            <p className="truncate text-xs text-white/45">
              {template.categoryName}
            </p>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
              template.isFree
                ? 'bg-emerald-500/15 text-emerald-300'
                : 'bg-white/10 text-white/60'
            }`}
          >
            {template.isFree ? (
              <>
                <Copy className="size-3" /> Free
              </>
            ) : (
              <>
                <Lock className="size-3" /> Premium
              </>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
