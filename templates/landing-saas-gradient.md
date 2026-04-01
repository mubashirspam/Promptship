---
title: "SaaS Gradient Landing"
slug: "saas-gradient-landing"
category: "landing"
description: "Modern SaaS landing page with gradient hero, feature grid, and pricing section"
tier: "pro"
frameworks: ["react", "vue", "html"]
isPremium: true
isFeatured: true
thumbnailUrl: "/templates/saas-gradient-thumb.jpg"
previewImageUrl: "/templates/saas-gradient-preview.jpg"
technicalSpecs:
  fonts:
    - name: "Inter"
      weights: [400, 500, 600, 700]
      url: "https://fonts.google.com/specimen/Inter"
  colors:
    - name: "background"
      hsl: "0 0% 100%"
      usage: "White background"
    - name: "foreground"
      hsl: "222 47% 11%"
      usage: "Dark text"
    - name: "primary"
      hsl: "217 91% 60%"
      usage: "Primary blue"
    - name: "secondary"
      hsl: "280 80% 60%"
      usage: "Secondary purple"
    - name: "accent"
      hsl: "340 82% 52%"
      usage: "Accent pink"
  animations:
    - name: "fade-up"
      keyframes: "from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }"
      usage: "Content entrance"
    - name: "gradient-shift"
      keyframes: "0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; }"
      usage: "Animated gradient background"
  dependencies:
    - name: "react"
      version: "^19.0.0"
      required: true
    - name: "tailwindcss"
      version: "^4.0.0"
      required: true
    - name: "lucide-react"
      version: "^0.400.0"
      required: true
layoutMetadata:
  sections: ["navigation", "hero", "features", "pricing", "cta", "footer"]
  components: ["Navbar", "Hero", "FeatureCard", "PricingCard", "Button", "Footer"]
  complexity: "complex"
  responsive: true
  darkMode: false
---

# SaaS Gradient Landing Page

Create a modern SaaS landing page with animated gradient hero, feature grid, pricing section, and footer. Use React + TypeScript + Tailwind CSS + Lucide icons.

## Navigation Bar

- **Layout**: `fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200`
- **Container**: `max-w-7xl mx-auto px-6 py-4 flex items-center justify-between`
- **Logo**: "PromptShip" - `text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent`
- **Nav Links**: Home, Features, Pricing, Docs - `text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors`
- **CTA Button**: "Get Started" - `bg-primary text-white px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all hover:scale-105`

## Hero Section

- **Layout**: `relative min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden`
- **Background**: Animated gradient
  ```css
  background: linear-gradient(-45deg, hsl(217 91% 60%), hsl(280 80% 60%), hsl(340 82% 52%), hsl(217 91% 60%));
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
  ```
- **Content Container**: `relative z-10 max-w-5xl mx-auto text-center`
- **Badge**: "✨ New: AI-Powered Templates" - `inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8`
- **H1**: "Ship Beautiful UIs in Minutes" - `text-6xl md:text-8xl font-bold text-white leading-[1.1] tracking-tight mb-6`
  - Gradient text on "Beautiful UIs": `bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent`
- **Subtitle**: `text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed`
  - "100+ curated AI prompts for React, Flutter, HTML & Vue. Copy, paste, and launch stunning interfaces."
- **CTA Group**: `flex flex-col sm:flex-row gap-4 justify-center items-center`
  - Primary: "Start Building Free" - `bg-white text-primary px-8 py-4 rounded-full font-semibold hover:scale-105 transition-all shadow-2xl`
  - Secondary: "View Templates →" - `text-white border-2 border-white/30 px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all`

## Features Section

- **Layout**: `py-32 px-6 bg-gray-50`
- **Container**: `max-w-7xl mx-auto`
- **Section Header**: 
  - Badge: "Features" - `text-primary text-sm font-semibold tracking-wide uppercase mb-4`
  - H2: "Everything you need to ship faster" - `text-4xl md:text-5xl font-bold text-gray-900 mb-6`
  - Subtitle: `text-xl text-gray-600 max-w-2xl`
- **Feature Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16`
- **Feature Card** (repeat 6 times):
  - Container: `bg-white p-8 rounded-2xl border border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all`
  - Icon: Lucide icon - `w-12 h-12 text-primary mb-6`
  - Title: `text-xl font-semibold text-gray-900 mb-3`
  - Description: `text-gray-600 leading-relaxed`

Features:
1. **100+ Curated Prompts** - Icon: Zap - "Production-ready prompts for every UI component"
2. **Multi-Framework** - Icon: Code2 - "React, Flutter, HTML, Vue - all supported"
3. **AI-Powered** - Icon: Sparkles - "Claude & GPT-4 integration for instant code"
4. **Copy & Paste** - Icon: Copy - "No setup required. Just copy and use"
5. **Dark Mode Ready** - Icon: Moon - "All templates support dark mode out of the box"
6. **Fully Responsive** - Icon: Smartphone - "Mobile-first design for all templates"

## Pricing Section

- **Layout**: `py-32 px-6 bg-white`
- **Container**: `max-w-7xl mx-auto`
- **Section Header**: 
  - Badge: "Pricing" - `text-primary text-sm font-semibold tracking-wide uppercase mb-4 text-center`
  - H2: "Choose your plan" - `text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center`
  - Subtitle: `text-xl text-gray-600 max-w-2xl mx-auto text-center`
- **Pricing Grid**: `grid grid-cols-1 md:grid-cols-3 gap-8 mt-16`

**Pricing Cards**:

1. **Free** - `bg-white p-8 rounded-2xl border-2 border-gray-200`
   - Price: "$0" - `text-5xl font-bold text-gray-900`
   - Period: "/month" - `text-gray-600`
   - Features: 10 prompts, Basic templates, Community support
   - CTA: "Get Started" - `w-full bg-gray-100 text-gray-900 py-3 rounded-full font-semibold hover:bg-gray-200`

2. **Pro** (Popular) - `bg-gradient-to-br from-primary to-secondary p-8 rounded-2xl border-2 border-primary shadow-2xl transform scale-105`
   - Badge: "Most Popular" - `bg-white/20 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4`
   - Price: "$29" - `text-5xl font-bold text-white`
   - Period: "/month" - `text-white/80`
   - Features: 100+ prompts, Premium templates, AI generation, Priority support
   - CTA: "Start Free Trial" - `w-full bg-white text-primary py-3 rounded-full font-semibold hover:scale-105`

3. **Team** - `bg-white p-8 rounded-2xl border-2 border-gray-200`
   - Price: "$99" - `text-5xl font-bold text-gray-900`
   - Period: "/month" - `text-gray-600`
   - Features: Unlimited prompts, Team collaboration, Custom templates, Dedicated support
   - CTA: "Contact Sales" - `w-full bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-800`

## CTA Section

- **Layout**: `py-32 px-6 bg-gradient-to-br from-primary via-secondary to-accent`
- **Container**: `max-w-4xl mx-auto text-center`
- **H2**: "Ready to ship faster?" - `text-5xl md:text-6xl font-bold text-white mb-6`
- **Subtitle**: `text-xl text-white/90 mb-12`
- **CTA Button**: "Start Building Now" - `bg-white text-primary px-12 py-5 rounded-full text-lg font-bold hover:scale-105 transition-all shadow-2xl`

## Footer

- **Layout**: `bg-gray-900 text-white py-16 px-6`
- **Container**: `max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12`
- **Column 1** (Brand):
  - Logo: "PromptShip" - `text-2xl font-bold mb-4`
  - Description: `text-gray-400 text-sm`
- **Columns 2-4** (Links):
  - Title: `text-sm font-semibold uppercase tracking-wide mb-4`
  - Links: `text-gray-400 hover:text-white transition-colors text-sm`
- **Bottom Bar**: `border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm`
  - "© 2026 PromptShip. All rights reserved."

## Animations

```css
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-fade-up {
  animation: fade-up 0.6s ease-out both;
}

.animate-fade-up-delay {
  animation: fade-up 0.6s ease-out 0.2s both;
}

.animate-gradient {
  animation: gradient-shift 15s ease infinite;
}
```

## Responsive Breakpoints

- Mobile: < 768px - Single column, stacked layout
- Tablet: 768px - 1024px - 2 columns for features, pricing
- Desktop: > 1024px - Full 3-column layout

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus states on all buttons and links
- Semantic HTML structure
- Alt text for decorative elements
