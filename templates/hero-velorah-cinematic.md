---
title: "Velorah Cinematic Hero"
slug: "velorah-cinematic-hero"
category: "hero"
description: "Fullscreen video background hero with glassmorphic navigation and cinematic typography"
tier: "premium"
frameworks: ["react", "vue", "html"]
isPremium: true
isFeatured: true
thumbnailUrl: "/templates/velorah-thumb.jpg"
previewImageUrl: "/templates/velorah-preview.jpg"
previewVideoUrl: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
technicalSpecs:
  fonts:
    - name: "Instrument Serif"
      weights: [400]
      url: "https://fonts.google.com/specimen/Instrument+Serif"
    - name: "Inter"
      weights: [400, 500]
      url: "https://fonts.google.com/specimen/Inter"
  colors:
    - name: "background"
      hsl: "201 100% 13%"
      usage: "Deep navy blue base"
    - name: "foreground"
      hsl: "0 0% 100%"
      usage: "White text"
    - name: "muted-foreground"
      hsl: "240 4% 66%"
      usage: "Muted gray for secondary text"
    - name: "primary"
      hsl: "0 0% 100%"
      usage: "Primary actions"
    - name: "border"
      hsl: "0 0% 18%"
      usage: "Border color"
  animations:
    - name: "fade-rise"
      keyframes: "from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); }"
      usage: "Entrance animation for hero elements"
  dependencies:
    - name: "react"
      version: "^19.0.0"
      required: true
    - name: "tailwindcss"
      version: "^4.0.0"
      required: true
  assets:
    - type: "video"
      url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
      description: "Fullscreen looping background video"
layoutMetadata:
  sections: ["navigation", "hero"]
  components: ["Navigation", "Hero", "Button"]
  complexity: "medium"
  responsive: true
  darkMode: true
---

# Velorah Cinematic Hero Section

Create a single-page hero section with a fullscreen looping background video, glassmorphic navigation, and cinematic typography. Use React + Vite + Tailwind CSS + TypeScript with shadcn/ui.

## Video Background

Fullscreen `<video>` element with autoPlay, loop, muted, playsInline

- **Source URL**: `https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4`
- **Positioning**: `absolute inset-0 w-full h-full object-cover z-0`

## Fonts

Import from Google Fonts:
- **Instrument Serif** (display)
- **Inter** weights 400/500 (body)

CSS variables:
```css
--font-display: 'Instrument Serif', serif
--font-body: 'Inter', sans-serif
```

Body uses `var(--font-body)`, headings use inline `fontFamily: "'Instrument Serif', serif"`

## Color Theme

Dark theme with HSL values for CSS variables:

```css
--background: 201 100% 13% (deep navy blue)
--foreground: 0 0% 100% (white)
--muted-foreground: 240 4% 66% (muted gray)
--primary: 0 0% 100%, --primary-foreground: 0 0% 4%
--secondary: 0 0% 10%, --muted: 0 0% 10%, --accent: 0 0% 10%
--border: 0 0% 18%, --input: 0 0% 18%
```

## Navigation Bar

- **Layout**: `relative z-10, flex row, justify-between, px-8 py-6, max-w-7xl mx-auto`
- **Logo**: "Velorah®" (® as `<sup className="text-xs">`), `text-3xl tracking-tight`, Instrument Serif font, `text-foreground`
- **Nav links** (hidden on mobile, `md:flex`): Home (active, `text-foreground`), Studio, About, Journal, Reach Us — all `text-sm text-muted-foreground` with `hover:text-foreground transition-colors`
- **CTA button**: "Begin Journey", liquid-glass `rounded-full px-6 py-2.5 text-sm text-foreground`, `hover:scale-[1.03]`

## Hero Section

- **Layout**: `relative z-10, flex column, centered, text-center, px-6 pt-32 pb-40 py-[90px]`
- **H1**: "Where dreams rise through the silence." — `text-5xl sm:text-7xl md:text-8xl, leading-[0.95], tracking-[-2.46px], max-w-7xl, font-normal`, Instrument Serif
  - The words "dreams" and "through the silence." wrapped in `<em className="not-italic text-muted-foreground">` for color contrast
- **Subtext**: `text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed` — "We're designing tools for deep thinkers, bold creators, and quiet rebels. Amid the chaos, we build digital spaces for sharp focus and inspired work."
- **CTA button**: "Begin Journey", liquid-glass `rounded-full px-14 py-5 text-base text-foreground mt-12`, `hover:scale-[1.03] cursor-pointer`

## Liquid Glass Effect

CSS class `.liquid-glass`:

```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

## Animations

CSS keyframes + classes:

```css
@keyframes fade-rise {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-rise { animation: fade-rise 0.8s ease-out both; }
.animate-fade-rise-delay { animation: fade-rise 0.8s ease-out 0.2s both; }
.animate-fade-rise-delay-2 { animation: fade-rise 0.8s ease-out 0.4s both; }
```

- H1 gets `animate-fade-rise`
- Subtext gets `animate-fade-rise-delay`
- Hero CTA button gets `animate-fade-rise-delay-2`

## Layout Notes

No decorative blobs, radial gradients, or overlays. Minimalist, cinematic, vertically centered hero. The video provides all visual depth.
