import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { JsonLd } from '@/components/seo/json-ld';
import { PublicTemplateCard, templateHref } from '@/components/marketing/public-template-card';
import {
  getPublicCategories,
  getCategoryBySlug,
  getTemplatesByCategory,
} from '@/lib/templates/public-queries';

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const cats = await getPublicCategories();
    return cats.map((c) => ({ category: c.slug }));
  } catch {
    // DB unavailable at build — pages still render on demand (dynamicParams).
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) return { title: 'Templates' };

  const title = `${cat.name} Templates & Animations`;
  const description = `${cat.count} ready-to-ship ${cat.name.toLowerCase()} templates — copy, paste, and customize. Preview live and download the code. Works with React, Next.js, Vue, and plain HTML/CSS/JS.`;

  return {
    title,
    description,
    alternates: { canonical: `/templates/${cat.slug}` },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/templates/${cat.slug}`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const [cat, templates] = await Promise.all([
    getCategoryBySlug(category),
    getTemplatesByCategory(category),
  ]);

  if (!cat) notFound();

  const nameLower = cat.name.toLowerCase();

  const faqs = [
    {
      q: `What are ${nameLower} templates?`,
      a: `${cat.name} templates are ready-made ${nameLower} components and effects you can drop into any website. Each comes with a live preview and downloadable code you can copy, paste, and customize.`,
    },
    {
      q: `Are these ${nameLower} templates free?`,
      a: `Some are free to copy. Premium templates unlock with a single one-time purchase — pay once and own them forever, with no subscription.`,
    },
    {
      q: `What tech stack do the templates use?`,
      a: `Templates are built with clean HTML, CSS, and JavaScript, so they drop into React, Next.js, Vue, Svelte, or a plain static site with minimal changes.`,
    },
  ];

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
      {
        '@type': 'ListItem',
        position: 3,
        name: cat.name,
        item: `${siteConfig.url}/templates/${cat.slug}`,
      },
    ],
  };

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cat.name} Templates`,
    numberOfItems: templates.length,
    itemListElement: templates.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${siteConfig.url}${templateHref(t)}`,
      name: t.title,
    })),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <JsonLd data={breadcrumb} />
      <JsonLd data={itemList} />
      <JsonLd data={faqLd} />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-white/40" aria-label="Breadcrumb">
          <Link href="/templates" className="hover:text-white">
            Templates
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/70">{cat.name}</span>
        </nav>

        <header className="mb-10 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {cat.name} Templates &amp; Animations
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-white/55">
            Browse {cat.count} ready-to-ship {nameLower} templates.{' '}
            {cat.description ??
              `Preview each one live, then copy the code and customize it for your project.`}
          </p>
        </header>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {templates.map((t) => (
            <PublicTemplateCard key={t.id} template={t} />
          ))}
        </div>

        {/* FAQ — visible content + FAQPage schema for SEO/GEO */}
        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="mb-6 text-2xl font-semibold">
            {cat.name} templates — FAQ
          </h2>
          <div className="space-y-6">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-medium text-white">{f.q}</h3>
                <p className="mt-1.5 text-white/55">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
