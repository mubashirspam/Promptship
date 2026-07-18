'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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

/** Admin-managed categories, shared by tabs and the [category] page. */
export function useCategories(): CategoryTab[] {
  const [cats, setCats] = useState<CategoryTab[]>([...FALLBACK_CATEGORIES]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/categories')
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json.success) return;
        setCats(
          (json.data as { id: string; slug: string; name: string; parentId: string | null }[]).map(
            (c) => ({
              id: c.id,
              slug: c.slug,
              label: c.name,
              parentId: c.parentId,
            })
          )
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return cats;
}

interface CategoryTabsProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  className?: string;
}

export function CategoryTabs({
  activeCategory,
  onCategoryChange,
  className,
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const categories = useCategories();

  const topLevel = categories.filter((c) => !c.parentId);
  // Which parent's subcategories to show: the active top-level tab, or the
  // parent of the active subcategory
  const active = categories.find((c) => c.slug === activeCategory);
  const activeParent = active
    ? active.parentId
      ? categories.find((c) => c.id === active.parentId)
      : active
    : null;
  const subcategories = activeParent
    ? categories.filter((c) => c.parentId && c.parentId === activeParent.id)
    : [];

  return (
    <div className="space-y-2">
      <div
        ref={scrollRef}
        className={cn(
          'flex gap-2 overflow-x-auto pb-1 scrollbar-none',
          className
        )}
      >
        <Button
          variant={activeCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className="shrink-0"
        >
          All
        </Button>
        {topLevel.map((category) => (
          <Button
            key={category.slug}
            variant={
              activeCategory === category.slug ||
              activeParent?.slug === category.slug
                ? 'default'
                : 'outline'
            }
            size="sm"
            onClick={() => onCategoryChange(category.slug)}
            className="shrink-0"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Subcategory chips — shown when the active category has children */}
      {subcategories.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <Button
            variant={activeCategory === activeParent?.slug ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 shrink-0 text-xs"
            onClick={() => activeParent && onCategoryChange(activeParent.slug)}
          >
            All {activeParent?.label}
          </Button>
          {subcategories.map((sub) => (
            <Button
              key={sub.slug}
              variant={activeCategory === sub.slug ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 shrink-0 text-xs"
              onClick={() => onCategoryChange(sub.slug)}
            >
              {sub.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
