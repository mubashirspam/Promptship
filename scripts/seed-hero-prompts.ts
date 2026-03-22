import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as schema from '../src/lib/db/schema';

// Load .env.local for standalone script execution
try {
  const envFile = readFileSync(join(process.cwd(), '.env.local'), 'utf-8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
} catch {}

function readPrompt(filename: string): string {
  return readFileSync(join(__dirname, 'prompts', filename), 'utf-8').trim();
}

interface PromptEntry {
  title: string;
  slug: string;
  description: string;
  promptFile: string;
  tier: 'free' | 'starter' | 'pro' | 'team';
  frameworks: string[];
  previewImageUrl: string | null;
  isFeatured: boolean;
}

const heroPrompts: PromptEntry[] = [
  {
    title: 'Velorah Cinematic Hero',
    slug: 'velorah-cinematic-hero',
    description: 'Fullscreen looping video hero with glassmorphic navigation, cinematic Instrument Serif typography, and liquid glass CTA buttons.',
    promptFile: 'velorah-cinematic-hero.md',
    tier: 'free',
    frameworks: ['react'],
    previewImageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',
    isFeatured: true,
  },
  {
    title: 'Grow Dark SaaS Hero',
    slug: 'grow-dark-saas-hero',
    description: 'Dark-themed hero with liquid glass effects, video fade-in/out loop, logo marquee, and purple gradient accents.',
    promptFile: 'grow-dark-saas-hero.md',
    tier: 'starter',
    frameworks: ['react'],
    previewImageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260308_114720_3dabeb9e-2c39-4907-b747-bc3544e2d5b7.mp4',
    isFeatured: true,
  },
  {
    title: 'Nexora SaaS Dashboard Hero',
    slug: 'nexora-dashboard-hero',
    description: 'Light-theme SaaS hero with Framer Motion animations, coded dashboard preview, badge, and dual CTA buttons.',
    promptFile: 'nexora-dashboard-hero.md',
    tier: 'pro',
    frameworks: ['react'],
    previewImageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4',
    isFeatured: true,
  },
  {
    title: 'Nickel Warm Orange Hero',
    slug: 'nickel-fintech-hero',
    description: 'Warm orange-themed hero with floating white navbar, split-screen background video, and gradient CTA buttons.',
    promptFile: 'nickel-fintech-hero.md',
    tier: 'free',
    frameworks: ['react'],
    previewImageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_192508_4eecde4c-f835-4f4b-b255-eafd1156da99.mp4',
    isFeatured: true,
  },
  {
    title: 'AI Website Builder Dark Hero',
    slug: 'ai-website-builder-hero',
    description: 'Dark-mode hero for AI website builder with HLS video streaming, Framer Motion animations, and gradient headline.',
    promptFile: 'ai-website-builder-hero.md',
    tier: 'pro',
    frameworks: ['react'],
    previewImageUrl: 'https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8',
    isFeatured: false,
  },
  {
    title: 'Taskly Liquid Glass Hero',
    slug: 'taskly-liquid-glass-hero',
    description: 'Liquid glass navbar with animated glassy orb, social proof stars, and glassmorphic CTA button.',
    promptFile: 'taskly-liquid-glass-hero.md',
    tier: 'starter',
    frameworks: ['react'],
    previewImageUrl: 'https://future.co/images/homepage/glassy-orb/orb-purple.webm',
    isFeatured: false,
  },
  {
    title: 'Bloom AI Split Panel Hero',
    slug: 'bloom-ai-split-panel',
    description: 'Two-panel split layout with liquid glass overlays, video background, botanical theme, and grayscale color palette.',
    promptFile: 'bloom-ai-split-panel.md',
    tier: 'pro',
    frameworks: ['react'],
    previewImageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4',
    isFeatured: false,
  },
  {
    title: 'Portfolio Loading Screen',
    slug: 'portfolio-loading-screen',
    description: 'Fullscreen animated loading screen with rotating words, progress counter, gradient progress bar, and smooth exit transitions.',
    promptFile: 'portfolio-loading-screen.md',
    tier: 'starter',
    frameworks: ['react'],
    previewImageUrl: null,
    isFeatured: false,
  },
  {
    title: 'AI Agency Liquid Glass Landing',
    slug: 'ai-agency-liquid-glass-landing',
    description: 'Premium dark landing page with 9 sections, liquid glass effects, HLS videos, feature grids, testimonials, and stats.',
    promptFile: 'ai-agency-liquid-glass-landing.md',
    tier: 'pro',
    frameworks: ['react'],
    previewImageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4',
    isFeatured: true,
  },
  {
    title: 'Minimalist Flipped Video Hero',
    slug: 'minimalist-flipped-video-hero',
    description: 'High-end minimalist hero with Geist + Instrument Serif fonts, vertically flipped video background, email input CTA, and social proof.',
    promptFile: 'minimalist-flipped-video-hero.md',
    tier: 'free',
    frameworks: ['react'],
    previewImageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4',
    isFeatured: false,
  },
  {
    title: 'Logoisum Video Agency Hero',
    slug: 'logoisum-video-agency-hero',
    description: 'Video editing agency hero with floating white navbar, Barlow + Instrument Serif typography, and pill-shaped CTA.',
    promptFile: 'logoisum-video-agency-hero.md',
    tier: 'free',
    frameworks: ['react'],
    previewImageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260228_065522_522e2295-ba22-457e-8fdb-fbcd68109c73.mp4',
    isFeatured: false,
  },
  {
    title: 'Targo Logistics Brand Hero',
    slug: 'targo-logistics-hero',
    description: 'Dark logistics hero with brand red accents, clipped-corner buttons, liquid glass consultation card, and Rubik typography.',
    promptFile: 'targo-logistics-hero.md',
    tier: 'starter',
    frameworks: ['react'],
    previewImageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260227_042027_c4b2f2ea-1c7c-4d6e-9e3d-81a78063703f.mp4',
    isFeatured: false,
  },
  {
    title: 'Neuralyn Analytics Landing',
    slug: 'neuralyn-analytics-landing',
    description: 'Dark analytics SaaS landing with parallax scroll, word-reveal testimonial section, dashboard preview, and liquid glass pill UI.',
    promptFile: 'neuralyn-analytics-landing.md',
    tier: 'pro',
    frameworks: ['react'],
    previewImageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4',
    isFeatured: true,
  },
  {
    title: 'AI Automation Purple Hero',
    slug: 'ai-automation-purple-hero',
    description: 'Dark purple hero with HLS video, split-text word animation, blur-in effects, and semi-transparent CTA buttons.',
    promptFile: 'ai-automation-purple-hero.md',
    tier: 'starter',
    frameworks: ['react'],
    previewImageUrl: 'https://stream.mux.com/s8pMcOvMQXc4GD6AX4e1o01xFogFxipmuKltNfSYza0200.m3u8',
    isFeatured: false,
  },
  {
    title: 'Web3 EOS Landing Hero',
    slug: 'web3-eos-landing',
    description: 'Pure black Web3 hero with General Sans font, gradient text headline, layered pill buttons with glow effects.',
    promptFile: 'web3-eos-landing.md',
    tier: 'pro',
    frameworks: ['react'],
    previewImageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4',
    isFeatured: false,
  },
  {
    title: 'Datacore Glassmorphism Hero',
    slug: 'datacore-glassmorphism-hero',
    description: 'Full-screen video hero with glassmorphism badge, Instrument Serif accent font, liquid glass pill CTAs, and corner accents.',
    promptFile: 'datacore-glassmorphism-hero.md',
    tier: 'free',
    frameworks: ['react'],
    previewImageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4',
    isFeatured: true,
  },
  {
    title: 'Cinematic Video Agency Hero',
    slug: 'cinematic-agency-hero',
    description: 'Full-screen video hero with Barlow + Instrument Serif fonts, transparent navbar, no overlay, and 250px bottom padding.',
    promptFile: 'cinematic-agency-hero.md',
    tier: 'free',
    frameworks: ['react'],
    previewImageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_074215_04640ca7-042c-45d6-bb56-58b1e8a42489.mp4',
    isFeatured: false,
  },
  {
    title: 'Project Estimation Calculator',
    slug: 'project-estimation-calculator',
    description: 'Dark-themed pricing calculator with service selection, page slider, add-ons, timeline options, and real-time cost comparison cards.',
    promptFile: 'project-estimation-calculator.md',
    tier: 'starter',
    frameworks: ['react'],
    previewImageUrl: null,
    isFeatured: false,
  },
  {
    title: 'Automate AI Dark Hero',
    slug: 'automate-ai-dark-hero',
    description: 'Dark hero with Manrope + Instrument Serif fonts, glassmorphic dashboard preview, video background, and layered CTA buttons.',
    promptFile: 'automate-ai-dark-hero.md',
    tier: 'pro',
    frameworks: ['react'],
    previewImageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260215_121759_424f8e9c-d8bd-4974-9567-52709dfb6842.mp4',
    isFeatured: false,
  },
  {
    title: 'ClearInvoice SaaS Hero',
    slug: 'clearinvoice-saas-hero',
    description: 'SaaS hero with top gradient bar, orange gradient CTA with glow, HLS video background, mobile hamburger menu, and social proof.',
    promptFile: 'clearinvoice-saas-hero.md',
    tier: 'starter',
    frameworks: ['react'],
    previewImageUrl: 'https://stream.mux.com/hUT6X11m1Vkw1QMxPOLgI761x2cfpi9bHFbi5cNg4014.m3u8',
    isFeatured: false,
  },
  {
    title: 'Synapse Innovation Hero',
    slug: 'synapse-innovation-hero',
    description: 'Dark hero with HLS video, fixed glass navbar, glass badges, gradient buttons, logo marquee, and staggered animations.',
    promptFile: 'synapse-innovation-hero.md',
    tier: 'pro',
    frameworks: ['react'],
    previewImageUrl: 'https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8',
    isFeatured: false,
  },
  {
    title: 'New Era Design Hero',
    slug: 'new-era-design-hero',
    description: 'Bold uppercase Rubik hero with custom SVG-path button, full-screen video, responsive scaling, and minimal design.',
    promptFile: 'new-era-design-hero.md',
    tier: 'free',
    frameworks: ['react'],
    previewImageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260206_044704_dd33cb15-c23f-4cfc-aa09-a0465d4dcb54.mp4',
    isFeatured: false,
  },
  {
    title: 'Purple Pink Glassmorphism Hero',
    slug: 'purple-pink-glassmorphism-hero',
    description: 'Dark glassmorphism hero with purple/pink gradients, HLS video, infinite logo slider, gradient headline, and animated CTA.',
    promptFile: 'purple-pink-glassmorphism-hero.md',
    tier: 'pro',
    frameworks: ['react'],
    previewImageUrl: 'https://customer-cbeadsgr09pnsezs.cloudflarestream.com/697945ca6b876878dba3b23fbd2f1561/manifest/video.m3u8',
    isFeatured: false,
  },
];

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL not set');

  console.log('Seeding hero section prompts...');

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  // Get or create Hero Sections category
  let categoryId: string;
  const [newCat] = await db
    .insert(schema.categories)
    .values({
      name: 'Hero Sections',
      slug: 'hero-sections',
      description: 'Full-screen hero sections with video backgrounds, liquid glass effects, and cinematic typography.',
      icon: 'Film',
      displayOrder: 0,
    })
    .onConflictDoNothing()
    .returning();

  if (newCat) {
    categoryId = newCat.id;
  } else {
    const existing = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.slug, 'hero-sections'))
      .limit(1);
    categoryId = existing[0].id;
  }

  console.log(`Hero Sections category: ${categoryId}`);

  let inserted = 0;
  for (const p of heroPrompts) {
    const promptText = readPrompt(p.promptFile);
    const [result] = await db
      .insert(schema.prompts)
      .values({
        categoryId,
        title: p.title,
        slug: p.slug,
        description: p.description,
        promptText,
        tier: p.tier,
        frameworks: p.frameworks,
        previewImageUrl: p.previewImageUrl,
        isFeatured: p.isFeatured,
        isPublished: true,
      })
      .onConflictDoNothing()
      .returning();

    if (result) inserted++;
    console.log(`${result ? '✓' : '⊘'} ${p.title}`);
  }

  console.log(`\nInserted ${inserted}/${heroPrompts.length} hero prompts`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
