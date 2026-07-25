import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { JsonLd } from '@/components/seo/json-ld';
import { PublicTemplateCard, templateHref } from '@/components/marketing/public-template-card';
import {
  getPublicCategories,
  getPublishedTemplates,
} from '@/lib/templates/public-queries';

export const revalidate = 3600;

const TITLE = 'UI Templates, Animations & Code Starters';
const DESCRIPTION =
  'A curated library of production-ready UI templates — scroll animations, 3D effects, sliders, hover and button interactions, hero sections and more. Copy, paste, ship. Pay once, own forever.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/templates' },
  openGraph: {
    title: `${TITLE} | ${siteConfig.name}`,
    description: DESCRIPTION,
    url: `${siteConfig.url}/templates`,
    type: 'website',
  },
};

export default async function TemplatesCatalogPage() {
  const [categories, templates] = await Promise.all([
    getPublicCategories(),
    getPublishedTemplates(60),
  ]);

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: TITLE,
    description: DESCRIPTION,
    url: `${siteConfig.url}/templates`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: templates.length,
      itemListElement: templates.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${siteConfig.url}${templateHref(t)}`,
        name: t.title,
      })),
    },
  };

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
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <JsonLd data={itemList} />
      <JsonLd data={breadcrumb} />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {TITLE}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-white/55">
            {DESCRIPTION}
          </p>
        </header>

        {/* Category landing links */}
        <nav aria-label="Template categories" className="mb-10 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium">
            All
          </span>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/templates/${c.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] px-4 py-1.5 text-xs font-medium text-white/50 transition-colors hover:border-white/20 hover:text-white"
            >
              {c.name}
              <span className="text-white/30">{c.count}</span>
            </Link>
          ))}
        </nav>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {templates.map((t) => (
            <PublicTemplateCard key={t.id} template={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
