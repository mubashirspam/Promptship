'use client';

import { useState, useEffect } from 'react';
import { PromptSearch } from '@/components/prompts/prompt-search';
import { CategoryTabs } from '@/components/prompts/category-tabs';
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

async function fetchTemplates(params: {
  assetKind: AssetKind;
  query?: string;
  category?: string;
  framework?: string;
}): Promise<Prompt[]> {
  const searchParams = new URLSearchParams();
  searchParams.set('kind', params.assetKind);
  if (params.query) searchParams.set('query', params.query);
  if (params.category) searchParams.set('category', params.category);
  if (params.framework) searchParams.set('framework', params.framework);

  const response = await fetch(`/api/prompts?${searchParams.toString()}`);
  const data = await response.json();
  return data.success ? data.data.items : [];
}

export default function TemplatesPage() {
  const [activeKind, setActiveKind] = useState<AssetKind>('figma');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFramework, setActiveFramework] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [templates, setTemplates] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchTemplates({
          assetKind: activeKind,
          query: search || undefined,
          category: activeCategory || undefined,
          framework: activeFramework || undefined,
        });
        if (active) setTemplates(data);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
        if (active) setTemplates([]);
      } finally {
        if (active) setIsLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [activeKind, search, activeCategory, activeFramework]);

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

      {/* Category tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Grid */}
      <PromptGrid
        prompts={templates}
        isLoading={isLoading}
        onSelect={handleSelect}
      />

      {/* Detail modal */}
      <PromptModal
        prompt={selectedPrompt}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
