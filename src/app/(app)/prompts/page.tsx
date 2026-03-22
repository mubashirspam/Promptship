'use client';

import { useState, useMemo } from 'react';
import { PromptSearch } from '@/components/prompts/prompt-search';
import { CategoryTabs } from '@/components/prompts/category-tabs';
import { FrameworkFilter } from '@/components/prompts/framework-filter';
import { PromptGrid } from '@/components/prompts/prompt-grid';
import { PromptModal } from '@/components/prompts/prompt-modal';
import type { Prompt } from '@/components/prompts/prompt-card';

// ---------------------------------------------------------------------------
// Mock data — will be replaced by `usePrompts` hook + API calls
// ---------------------------------------------------------------------------
const MOCK_PROMPTS: Prompt[] = [
  {
    id: '1',
    title: 'SaaS Hero Section with Gradient CTA',
    description:
      'A modern hero section with animated gradient background, headline, subtext, and dual CTA buttons.',
    promptText:
      'Create a responsive hero section for a SaaS landing page. Include a large bold headline, supporting subtext, two CTA buttons (primary filled, secondary outlined), and an animated gradient background that shifts between purple and blue. Use Tailwind CSS and make it dark-mode first.',
    tier: 'free',
    frameworks: ['react', 'html'],
    categoryName: 'Hero Sections',
    previewImageUrl: null,
    usageCount: 1240,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Glassmorphism Login Card',
    description:
      'A frosted-glass login form with email/password fields, social login buttons, and subtle animations.',
    promptText:
      'Build a glassmorphism-style login card centered on the page. Include email and password inputs with floating labels, a "Remember me" checkbox, "Forgot password?" link, a primary submit button, and social login options for Google and GitHub. Use backdrop-blur and semi-transparent backgrounds.',
    tier: 'free',
    frameworks: ['react', 'vue'],
    categoryName: 'Login/Auth',
    previewImageUrl: null,
    usageCount: 980,
    isFeatured: false,
  },
  {
    id: '3',
    title: 'Analytics Dashboard with Charts',
    description:
      'A full analytics dashboard layout with stat cards, line chart, bar chart, and recent activity feed.',
    promptText:
      'Design an analytics dashboard with a top row of 4 stat cards (revenue, users, orders, conversion rate), a main area split between a line chart (left, 60%) and bar chart (right, 40%), and a bottom section with a recent activity feed table. Use a dark theme with card borders.',
    tier: 'pro',
    frameworks: ['react'],
    categoryName: 'Dashboards',
    previewImageUrl: null,
    usageCount: 756,
    isFeatured: true,
  },
  {
    id: '4',
    title: 'Pricing Cards with Toggle',
    description:
      'Three-tier pricing cards with a monthly/yearly toggle and highlighted recommended plan.',
    promptText:
      'Create a pricing section with a monthly/yearly toggle and three pricing cards (Basic, Pro, Enterprise). The Pro card should be highlighted/elevated with a "Most Popular" badge. Each card should list features with check/x icons, a price, and a CTA button. Include a subtle gradient border on the featured card.',
    tier: 'starter',
    frameworks: ['react', 'html', 'vue'],
    categoryName: 'Cards',
    previewImageUrl: null,
    usageCount: 612,
    isFeatured: false,
  },
  {
    id: '5',
    title: 'Responsive Navigation with Mega Menu',
    description:
      'A top navigation bar with logo, links, mega dropdown menu, search, and mobile hamburger.',
    promptText:
      'Build a responsive navigation header with: logo on the left, centered nav links (Products, Solutions, Resources, Pricing), a mega-menu dropdown for "Products" showing a grid of product cards with icons, a search input, and a "Get Started" CTA button on the right. On mobile, collapse into a hamburger menu with a slide-out drawer.',
    tier: 'starter',
    frameworks: ['react'],
    categoryName: 'Navigation',
    previewImageUrl: null,
    usageCount: 534,
    isFeatured: false,
  },
  {
    id: '6',
    title: 'Multi-Step Registration Form',
    description:
      'A multi-step form wizard with progress indicator, validation, and smooth step transitions.',
    promptText:
      'Design a 4-step registration form wizard: Step 1 (Personal Info: name, email), Step 2 (Account Setup: username, password), Step 3 (Preferences: checkboxes and radio buttons), Step 4 (Review and Submit). Include a progress bar at the top, back/next navigation buttons, inline validation messages, and smooth fade transitions between steps.',
    tier: 'pro',
    frameworks: ['react', 'vue'],
    categoryName: 'Forms',
    previewImageUrl: null,
    usageCount: 489,
    isFeatured: true,
  },
  {
    id: '7',
    title: 'Flutter E-Commerce Product Page',
    description:
      'A mobile product detail page with image carousel, size selector, and add-to-cart flow.',
    promptText:
      'Create a Flutter product detail screen for an e-commerce app. Include a hero image carousel with dots indicator, product title and price, star rating, size/color selectors as chips, a quantity stepper, "Add to Cart" button with loading state, and a collapsible description section. Use Material 3 theming.',
    tier: 'pro',
    frameworks: ['flutter'],
    categoryName: 'Flutter',
    previewImageUrl: null,
    usageCount: 423,
    isFeatured: false,
  },
  {
    id: '8',
    title: 'Full-Page Portfolio with Sections',
    description:
      'A complete single-page portfolio with hero, about, projects grid, testimonials, and contact form.',
    promptText:
      'Build a full single-page portfolio website with these sections: Hero (name, title, CTA), About (photo, bio text, skill badges), Projects (3-column grid of project cards with hover effects), Testimonials (carousel of client quotes), and Contact (form with name, email, message fields plus social links). Use smooth scroll navigation and a fixed header.',
    tier: 'team',
    frameworks: ['react', 'html'],
    categoryName: 'Full Pages',
    previewImageUrl: null,
    usageCount: 387,
    isFeatured: true,
  },
];

export default function PromptsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFramework, setActiveFramework] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter prompts based on search, category, and framework
  const filteredPrompts = useMemo(() => {
    return MOCK_PROMPTS.filter((prompt) => {
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          prompt.title.toLowerCase().includes(q) ||
          prompt.description?.toLowerCase().includes(q) ||
          prompt.categoryName.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (activeCategory) {
        const slug = prompt.categoryName
          .toLowerCase()
          .replace(/[/\s]+/g, '-');
        if (slug !== activeCategory) return false;
      }

      // Framework filter
      if (activeFramework) {
        if (!prompt.frameworks.includes(activeFramework)) return false;
      }

      return true;
    });
  }, [search, activeCategory, activeFramework]);

  function handleSelectPrompt(prompt: Prompt) {
    setSelectedPrompt(prompt);
    setModalOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Prompt Library</h1>
          <p className="text-muted-foreground">
            100+ production-ready prompts
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

      {/* Category tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Prompt grid */}
      <PromptGrid
        prompts={filteredPrompts}
        isLoading={false}
        onSelect={handleSelectPrompt}
      />

      {/* Prompt detail modal */}
      <PromptModal
        prompt={selectedPrompt}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
