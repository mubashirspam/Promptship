import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import {
  getPublicCategories,
  getAllTemplateSlugs,
} from '@/lib/templates/public-queries';
import { templateHref } from '@/components/marketing/public-template-card';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/templates',
    '/pricing',
    '/blog',
    '/about',
    '/contact',
    '/changelog',
    '/terms',
    '/privacy',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/templates' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : path === '/templates' ? 0.9 : 0.6,
  }));

  let categoryRoutes: MetadataRoute.Sitemap = [];
  let templateRoutes: MetadataRoute.Sitemap = [];

  try {
    const [categories, templates] = await Promise.all([
      getPublicCategories(),
      getAllTemplateSlugs(),
    ]);

    categoryRoutes = categories.map((c) => ({
      url: `${base}/templates/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    templateRoutes = templates
      .filter((t) => t.categorySlug)
      .map((t) => ({
        url: `${base}${templateHref(t)}`,
        lastModified: t.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
  } catch {
    // If the DB is unavailable at build/revalidate time, still emit static routes.
  }

  return [...staticRoutes, ...categoryRoutes, ...templateRoutes];
}
