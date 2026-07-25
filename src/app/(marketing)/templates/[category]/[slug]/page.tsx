import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Lock, Copy } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { JsonLd } from '@/components/seo/json-ld';
import {
  PublicTemplateCard,
  templateHref,
} from '@/components/marketing/public-template-card';
import {
  getTemplateBySlug,
  getRelatedTemplates,
} from '@/lib/templates/public-queries';

export const revalidate = 3600;

function isVideoUrl(url: string | null): boolean {
  if (!url) return false;
  return (
    url.includes('.mp4') ||
    url.includes('.webm') ||
    url.includes('.m3u8') ||
    url.includes('.ogv')
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTemplateBySlug(slug);
  if (!t) return { title: 'Template not found' };

  const title = `${t.title} — ${t.categoryName ?? 'UI'} Template`;
  const description =
    t.description ??
    `${t.title}: a ready-to-ship ${(t.categoryName ?? 'UI').toLowerCase()} template. Preview live and download the code.`;
  const image = t.previewImageUrl ?? siteConfig.ogImage;

  return {
    title,
    description,
    alternates: { canonical: templateHref(t) },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}${templateHref(t)}`,
      type: 'article',
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const t = await getTemplateBySlug(slug);
  if (!t) notFound();

  // Enforce the canonical /templates/<category>/<slug> URL.
  if (t.categorySlug && t.categorySlug !== category) {
    redirect(templateHref(t));
  }

  const related = t.categorySlug
    ? await getRelatedTemplates(t.categorySlug, t.slug, 6)
    : [];

  const media = t.previewVideoUrl || t.previewImageUrl;
  const asVideo = isVideoUrl(media);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Templates',
        item: `${siteConfig.url}/templates`,
      },
      ...(t.categorySlug
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: t.categoryName,
              item: `${siteConfig.url}/templates/${t.categorySlug}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: t.categorySlug ? 4 : 3,
        name: t.title,
        item: `${siteConfig.url}${templateHref(t)}`,
      },
    ],
  };

  const creativeWork = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: t.title,
    description: t.description ?? undefined,
    url: `${siteConfig.url}${templateHref(t)}`,
    image: t.previewImageUrl ?? undefined,
    genre: t.categoryName ?? undefined,
    keywords: (t.frameworks ?? []).join(', ') || undefined,
    isAccessibleForFree: t.isFree,
    dateModified: t.updatedAt.toISOString(),
    author: { '@type': 'Organization', name: siteConfig.name },
    publisher: { '@type': 'Organization', name: siteConfig.name },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <JsonLd data={breadcrumb} />
      <JsonLd data={creativeWork} />

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-white/40" aria-label="Breadcrumb">
          <Link href="/templates" className="hover:text-white">
            Templates
          </Link>
          {t.categorySlug && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/templates/${t.categorySlug}`}
                className="hover:text-white"
              >
                {t.categoryName}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-white/70">{t.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Preview */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
            {asVideo && media ? (
              <video
                src={media}
                autoPlay
                muted
                loop
                playsInline
                className="block h-auto w-full"
              />
            ) : media ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={media}
                alt={`${t.title} preview`}
                className="block h-auto w-full"
              />
            ) : (
              <div className="aspect-video w-full bg-gradient-to-br from-violet-700 to-indigo-900" />
            )}
          </div>

          {/* Details + CTA */}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {t.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold ${
                  t.isFree
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : 'bg-white/10 text-white/70'
                }`}
              >
                {t.isFree ? (
                  <>
                    <Copy className="size-3" /> Free
                  </>
                ) : (
                  <>
                    <Lock className="size-3" /> Premium
                  </>
                )}
              </span>
              {t.categoryName && (
                <span className="rounded-full bg-white/5 px-3 py-1 text-white/60">
                  {t.categoryName}
                </span>
              )}
              {t.complexity && (
                <span className="rounded-full bg-white/5 px-3 py-1 capitalize text-white/60">
                  {t.complexity}
                </span>
              )}
              {t.platform && (
                <span className="rounded-full bg-white/5 px-3 py-1 capitalize text-white/60">
                  {t.platform}
                </span>
              )}
            </div>

            {t.description && (
              <p className="mt-5 leading-relaxed text-white/60">{t.description}</p>
            )}

            <ul className="mt-6 space-y-2 text-sm text-white/60">
              <li>• Live preview and full source code</li>
              <li>• Copy, paste, and customize freely</li>
              <li>• Works with React, Next.js, Vue, or plain HTML/CSS/JS</li>
              <li>• Pay once, own it forever — no subscription</li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`${siteConfig.appUrl}/signup`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-[1.03]"
              >
                {t.isFree ? 'Get this template' : 'Unlock this template'}
                <ArrowRight className="size-4" />
              </a>
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-2xl font-semibold">
                More {t.categoryName} templates
              </h2>
              {t.categorySlug && (
                <Link
                  href={`/templates/${t.categorySlug}`}
                  className="text-sm text-white/50 hover:text-white"
                >
                  View all →
                </Link>
              )}
            </div>
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {related.map((r) => (
                <PublicTemplateCard key={r.id} template={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
