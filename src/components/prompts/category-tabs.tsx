'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
  { slug: 'hero-sections', label: 'Hero Sections' },
  { slug: 'login-auth', label: 'Login/Auth' },
  { slug: 'dashboards', label: 'Dashboards' },
  { slug: 'cards', label: 'Cards' },
  { slug: 'navigation', label: 'Navigation' },
  { slug: 'forms', label: 'Forms' },
  { slug: 'flutter', label: 'Flutter' },
  { slug: 'full-pages', label: 'Full Pages' },
] as const;

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

  return (
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
        All Prompts
      </Button>
      {CATEGORIES.map((category) => (
        <Button
          key={category.slug}
          variant={activeCategory === category.slug ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(category.slug)}
          className="shrink-0"
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}

export { CATEGORIES };
