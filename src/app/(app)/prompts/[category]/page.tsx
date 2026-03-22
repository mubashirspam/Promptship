'use client';

import { use, useState, useMemo } from 'react';
import { PromptGrid } from '@/components/prompts/prompt-grid';
import { PromptModal } from '@/components/prompts/prompt-modal';
import { PromptSearch } from '@/components/prompts/prompt-search';
import { FrameworkFilter } from '@/components/prompts/framework-filter';
import { CategoryTabs, CATEGORIES } from '@/components/prompts/category-tabs';
import type { Prompt } from '@/components/prompts/prompt-card';

// ---------------------------------------------------------------------------
// Mock data scoped per category — will be replaced by API calls
// ---------------------------------------------------------------------------
const MOCK_PROMPTS_BY_CATEGORY: Record<string, Prompt[]> = {
  'hero-sections': [
    {
      id: 'hs-1',
      title: 'SaaS Hero Section with Gradient CTA',
      description:
        'A modern hero section with animated gradient background, headline, subtext, and dual CTA buttons.',
      promptText:
        'Create a responsive hero section for a SaaS landing page. Include a large bold headline, supporting subtext, two CTA buttons (primary filled, secondary outlined), and an animated gradient background that shifts between purple and blue.',
      tier: 'free',
      frameworks: ['react', 'html'],
      categoryName: 'Hero Sections',
      previewImageUrl: null,
      usageCount: 1240,
      isFeatured: true,
    },
    {
      id: 'hs-2',
      title: 'App Launch Hero with Phone Mockup',
      description:
        'Hero section featuring a centered phone mockup, app store badges, and feature highlights.',
      promptText:
        'Build a hero section for a mobile app launch page. Center a phone mockup with a screenshot, add app name and tagline above, App Store and Google Play badges below, and three small feature icons with labels underneath.',
      tier: 'starter',
      frameworks: ['react', 'vue'],
      categoryName: 'Hero Sections',
      previewImageUrl: null,
      usageCount: 876,
      isFeatured: false,
    },
  ],
  'login-auth': [
    {
      id: 'la-1',
      title: 'Glassmorphism Login Card',
      description:
        'A frosted-glass login form with email/password fields and social login buttons.',
      promptText:
        'Build a glassmorphism-style login card centered on the page. Include email and password inputs with floating labels, a "Remember me" checkbox, "Forgot password?" link, a primary submit button, and social login options for Google and GitHub.',
      tier: 'free',
      frameworks: ['react', 'vue'],
      categoryName: 'Login/Auth',
      previewImageUrl: null,
      usageCount: 980,
      isFeatured: false,
    },
  ],
  dashboards: [
    {
      id: 'db-1',
      title: 'Analytics Dashboard with Charts',
      description:
        'A full analytics dashboard layout with stat cards, line chart, bar chart, and recent activity feed.',
      promptText:
        'Design an analytics dashboard with a top row of 4 stat cards (revenue, users, orders, conversion rate), a main area split between a line chart and bar chart, and a bottom section with a recent activity feed table.',
      tier: 'pro',
      frameworks: ['react'],
      categoryName: 'Dashboards',
      previewImageUrl: null,
      usageCount: 756,
      isFeatured: true,
    },
  ],
};

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage(props: CategoryPageProps) {
  const { category } = use(props.params);

  const [search, setSearch] = useState('');
  const [activeFramework, setActiveFramework] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Find display label for the category
  const categoryMeta = CATEGORIES.find((c) => c.slug === category);
  const categoryLabel = categoryMeta?.label ?? category.replace(/-/g, ' ');

  // Get prompts for this category
  const categoryPrompts = MOCK_PROMPTS_BY_CATEGORY[category] ?? [];

  // Apply search and framework filters
  const filteredPrompts = useMemo(() => {
    return categoryPrompts.filter((prompt) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          prompt.title.toLowerCase().includes(q) ||
          prompt.description?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      if (activeFramework) {
        if (!prompt.frameworks.includes(activeFramework)) return false;
      }

      return true;
    });
  }, [categoryPrompts, search, activeFramework]);

  function handleSelectPrompt(prompt: Prompt) {
    setSelectedPrompt(prompt);
    setModalOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold capitalize">
            {categoryLabel} Prompts
          </h1>
          <p className="text-muted-foreground">
            Browse {categoryLabel.toLowerCase()} prompts for UI generation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PromptSearch value={search} onChange={setSearch} />
          <FrameworkFilter
            activeFramework={activeFramework}
            onFrameworkChange={setActiveFramework}
          />
        </div>
      </div>

      {/* Category tabs with current category active */}
      <CategoryTabs
        activeCategory={category}
        onCategoryChange={() => {
          // Navigation is handled via links in the main prompts page;
          // here the tab highlight simply shows the current category.
        }}
      />

      {/* Prompt grid */}
      <PromptGrid
        prompts={filteredPrompts}
        isLoading={false}
        onSelect={handleSelectPrompt}
      />

      {/* Modal */}
      <PromptModal
        prompt={selectedPrompt}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
