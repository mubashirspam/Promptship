'use client';

import { useEffect, useState } from 'react';

/** Fallback while /api/categories loads (or if it fails). */
const FALLBACK_CATEGORIES = [
  { slug: 'hero-sections', label: 'Hero Sections' },
  { slug: 'dashboards', label: 'Dashboards' },
  { slug: 'landing-pages', label: 'Landing Pages' },
] as const;

export interface CategoryTab {
  slug: string;
  label: string;
  parentId?: string | null;
  id?: string;
}

/** Admin-managed categories, shared by the category dropdown and filters. */
export function useCategories(): CategoryTab[] {
  const [cats, setCats] = useState<CategoryTab[]>([...FALLBACK_CATEGORIES]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/categories')
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json.success) return;
        setCats(
          (
            json.data as {
              id: string;
              slug: string;
              name: string;
              parentId: string | null;
            }[]
          ).map((c) => ({
            id: c.id,
            slug: c.slug,
            label: c.name,
            parentId: c.parentId,
          }))
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return cats;
}
