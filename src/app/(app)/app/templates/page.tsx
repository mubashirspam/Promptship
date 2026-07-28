'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { PromptSearch } from '@/components/prompts/prompt-search';
import { CategorySelect } from '@/components/prompts/category-select';
import { KindTabs } from '@/components/prompts/kind-tabs';
import { FrameworkFilter } from '@/components/prompts/framework-filter';
import { PromptGrid } from '@/components/prompts/prompt-grid';
import { PromptModal } from '@/components/prompts/prompt-modal';
import type { Prompt, AssetKind } from '@/components/prompts/prompt-card';

const KIND_COPY: Record<AssetKind, { title: string; subtitle: string }> = {
  figma: {
    title: 'Figma Templates',
    subtitle: 'Ready-to-use Figma design files and UI kits',
  },
  ai_prompt: {
    title: 'AI Prompt Templates',
    subtitle: 'Production-ready prompts for generating UI',
  },
  code: {
    title: 'Code Templates',
    subtitle: 'Copy-paste components and full page code',
  },
};

/** Matches the API's clamp — the largest page the server will hand back. */
const PAGE_SIZE = 60;

interface TemplatePage {
  items: Prompt[];
  total: number;
  hasMore: boolean;
}

async function fetchTemplates(params: {
  assetKind: AssetKind;
  query?: string;
  category?: string;
  framework?: string;
  page: number;
}): Promise<TemplatePage> {
  const searchParams = new URLSearchParams();
  searchParams.set('kind', params.assetKind);
  searchParams.set('page', String(params.page));
  searchParams.set('pageSize', String(PAGE_SIZE));
  if (params.query) searchParams.set('query', params.query);
  if (params.category) searchParams.set('category', params.category);
  if (params.framework) searchParams.set('framework', params.framework);

  const response = await fetch(`/api/prompts?${searchParams.toString()}`);
  const data = await response.json();
  if (!data.success) return { items: [], total: 0, hasMore: false };
  return {
    items: data.data.items,
    total: data.data.total ?? data.data.items.length,
    hasMore: data.data.hasMore ?? false,
  };
}

export default function TemplatesPage() {
  const [activeKind, setActiveKind] = useState<AssetKind>('figma');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFramework, setActiveFramework] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [templates, setTemplates] = useState<Prompt[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // First page — refetched whenever a filter changes, which also resets paging.
  useEffect(() => {
    let active = true;
    async function load() {
      setIsLoading(true);
      try {
        const result = await fetchTemplates({
          assetKind: activeKind,
          query: search || undefined,
          category: activeCategory || undefined,
          framework: activeFramework || undefined,
          page: 1,
        });
        if (!active) return;
        setTemplates(result.items);
        setTotal(result.total);
        setHasMore(result.hasMore);
        setPage(1);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
        if (active) {
          setTemplates([]);
          setTotal(0);
          setHasMore(false);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [activeKind, search, activeCategory, activeFramework]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    try {
      const result = await fetchTemplates({
        assetKind: activeKind,
        query: search || undefined,
        category: activeCategory || undefined,
        framework: activeFramework || undefined,
        page: nextPage,
      });
      // Guard against a page overlapping the one before it — a duplicate id
      // would collide on React's key and blow up the grid.
      setTemplates((prev) => {
        const seen = new Set(prev.map((t) => t.id));
        return [...prev, ...result.items.filter((t) => !seen.has(t.id))];
      });
      setTotal(result.total);
      setHasMore(result.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error('Failed to load more templates:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isLoadingMore,
    hasMore,
    page,
    activeKind,
    search,
    activeCategory,
    activeFramework,
  ]);

  // Infinite scroll — fetch the next page as the sentinel below the grid comes
  // into view, with enough rootMargin that the rows land before the user
  // reaches the bottom. loadMore already no-ops while a fetch is in flight.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: '600px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, isLoading, hasMore]);

  function handleSelect(prompt: Prompt) {
    setSelectedPrompt(prompt);
    setModalOpen(true);
  }

  const copy = KIND_COPY[activeKind];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{copy.title}</h1>
          <p className="text-muted-foreground">{copy.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <PromptSearch
            value={search}
            onChange={setSearch}
            placeholder="Search templates..."
          />
          <FrameworkFilter
            activeFramework={activeFramework}
            onFrameworkChange={setActiveFramework}
          />
        </div>
      </div>

      {/* Template kind tabs */}
      <KindTabs activeKind={activeKind} onKindChange={setActiveKind} />

      {/* Category dropdown + how many of the matching set are on screen */}
      <div className="flex flex-wrap items-center gap-3">
        <CategorySelect
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <span className="text-sm text-muted-foreground tabular-nums">
          {isLoading
            ? 'Loading…'
            : total === 0
              ? 'No templates'
              : templates.length === total
                ? `${total} template${total === 1 ? '' : 's'}`
                : `Showing ${templates.length} of ${total}`}
        </span>
      </div>

      {/* Grid */}
      <PromptGrid
        prompts={templates}
        isLoading={isLoading}
        onSelect={handleSelect}
      />

      {/* Infinite scroll sentinel + end-of-list marker */}
      {!isLoading && (
        <div ref={sentinelRef} className="flex justify-center py-6">
          {isLoadingMore ? (
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading more…
            </span>
          ) : hasMore ? (
            <span className="text-sm text-muted-foreground tabular-nums">
              {total - templates.length} more
            </span>
          ) : (
            templates.length > 0 && (
              <span className="text-sm text-muted-foreground">
                You&apos;ve reached the end
              </span>
            )
          )}
        </div>
      )}

      {/* Detail modal */}
      <PromptModal
        prompt={selectedPrompt}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
