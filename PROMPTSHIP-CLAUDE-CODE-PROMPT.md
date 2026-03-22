# PromptShip - Complete Foundation Setup Prompt for Claude Code

> **Instructions**: Copy this entire prompt into Claude Code. It will set up the complete foundation for the PromptShip application including Next.js 15, database, authentication, and all Week 1-3 modules.

---

## PROJECT OVERVIEW

I'm building **PromptShip** - a hybrid SaaS + Education platform for AI-powered UI generation. The complete technical architecture is available at `/docs/architecture` in the app (load from `promptship-technical-architecture.html`).

**Core Features:**
- 100+ curated AI prompts for UI/UX generation
- One-click code generation (React, Flutter, HTML, Vue)
- Learning hub with video courses
- Dual payment system (Stripe + Razorpay)

---

## STEP 1: CREATE PROJECT

Initialize the Next.js 15 project with all required dependencies:

```bash
pnpm create next-app@latest promptship --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd promptship
```

### Install All Dependencies

```bash
# Core
pnpm add next@latest react@latest react-dom@latest

# Database & ORM
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit

# Authentication
pnpm add better-auth

# State Management & Data Fetching
pnpm add zustand @tanstack/react-query

# Forms & Validation
pnpm add react-hook-form @hookform/resolvers zod

# UI Components
pnpm add @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip

# Styling & Animation
pnpm add tailwind-merge clsx class-variance-authority framer-motion

# Icons
pnpm add lucide-react

# Utilities
pnpm add nanoid date-fns

# Rate Limiting & Caching
pnpm add @upstash/redis @upstash/ratelimit

# Email
pnpm add resend

# AI Providers
pnpm add @anthropic-ai/sdk openai

# Payments
pnpm add stripe razorpay

# Dev Dependencies
pnpm add -D @types/node @types/react @types/react-dom typescript prettier prettier-plugin-tailwindcss
```

---

## STEP 2: PROJECT STRUCTURE

Create this exact folder structure:

```
promptship/
├── src/
│   ├── app/
│   │   ├── (marketing)/                 # Public pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                 # Landing page
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx
│   │   │   └── blog/
│   │   │       ├── page.tsx
│   │   │       └── [slug]/
│   │   │           └── page.tsx
│   │   │
│   │   ├── (auth)/                      # Auth pages
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── verify/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (app)/                       # Authenticated app
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── prompts/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [category]/
│   │   │   │       └── page.tsx
│   │   │   ├── generate/
│   │   │   │   └── page.tsx
│   │   │   ├── learn/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [moduleId]/
│   │   │   │       └── [lessonId]/
│   │   │   │           └── page.tsx
│   │   │   ├── history/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (admin)/                     # Admin portal
│   │   │   ├── layout.tsx
│   │   │   └── admin/
│   │   │       ├── page.tsx
│   │   │       ├── prompts/
│   │   │       │   └── page.tsx
│   │   │       ├── users/
│   │   │       │   └── page.tsx
│   │   │       └── analytics/
│   │   │           └── page.tsx
│   │   │
│   │   ├── (docs)/                      # Documentation
│   │   │   └── docs/
│   │   │       ├── page.tsx
│   │   │       └── architecture/
│   │   │           └── page.tsx         # Load HTML architecture doc here
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...all]/
│   │   │   │       └── route.ts
│   │   │   ├── generate/
│   │   │   │   └── route.ts
│   │   │   ├── prompts/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── copy/
│   │   │   │           └── route.ts
│   │   │   ├── favorites/
│   │   │   │   └── route.ts
│   │   │   ├── generations/
│   │   │   │   └── route.ts
│   │   │   ├── user/
│   │   │   │   └── settings/
│   │   │   │       └── route.ts
│   │   │   └── webhooks/
│   │   │       ├── stripe/
│   │   │       │   └── route.ts
│   │   │       └── razorpay/
│   │   │           └── route.ts
│   │   │
│   │   ├── layout.tsx                   # Root layout
│   │   ├── globals.css
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/                          # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── marketing-header.tsx
│   │   │   ├── marketing-footer.tsx
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── app-header.tsx
│   │   │   ├── admin-sidebar.tsx
│   │   │   └── mobile-nav.tsx
│   │   │
│   │   ├── marketing/
│   │   │   ├── hero-section.tsx
│   │   │   ├── features-grid.tsx
│   │   │   ├── pricing-cards.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── faq-accordion.tsx
│   │   │   └── cta-section.tsx
│   │   │
│   │   ├── prompts/
│   │   │   ├── prompt-card.tsx
│   │   │   ├── prompt-grid.tsx
│   │   │   ├── prompt-modal.tsx
│   │   │   ├── prompt-search.tsx
│   │   │   ├── category-tabs.tsx
│   │   │   └── framework-filter.tsx
│   │   │
│   │   ├── generator/
│   │   │   ├── generator-form.tsx
│   │   │   ├── code-preview.tsx
│   │   │   ├── live-preview.tsx
│   │   │   ├── framework-selector.tsx
│   │   │   └── style-options.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── stats-cards.tsx
│   │   │   ├── recent-generations.tsx
│   │   │   ├── quick-actions.tsx
│   │   │   └── welcome-banner.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   ├── signup-form.tsx
│   │   │   ├── magic-link-form.tsx
│   │   │   └── auth-card.tsx
│   │   │
│   │   └── shared/
│   │       ├── logo.tsx
│   │       ├── theme-toggle.tsx
│   │       ├── currency-toggle.tsx
│   │       ├── credit-badge.tsx
│   │       ├── loading-spinner.tsx
│   │       ├── empty-state.tsx
│   │       └── error-boundary.tsx
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts                 # Database connection
│   │   │   ├── schema.ts                # Drizzle schema
│   │   │   └── migrations/              # Drizzle migrations
│   │   │
│   │   ├── auth/
│   │   │   ├── index.ts                 # Better Auth config
│   │   │   ├── client.ts                # Auth client
│   │   │   └── middleware.ts            # Auth middleware
│   │   │
│   │   ├── ai/
│   │   │   ├── index.ts                 # AI service
│   │   │   ├── providers/
│   │   │   │   ├── claude.ts
│   │   │   │   └── openai.ts
│   │   │   ├── templates/
│   │   │   │   ├── base.ts
│   │   │   │   ├── react.ts
│   │   │   │   ├── flutter.ts
│   │   │   │   └── html.ts
│   │   │   └── prompts/
│   │   │       └── system-prompts.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── stripe.ts
│   │   │   └── razorpay.ts
│   │   │
│   │   ├── email/
│   │   │   ├── index.ts
│   │   │   └── templates/
│   │   │       ├── magic-link.tsx
│   │   │       ├── welcome.tsx
│   │   │       └── subscription-confirmed.tsx
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts                    # Class merge utility
│   │   │   ├── format.ts                # Formatting utilities
│   │   │   └── constants.ts             # App constants
│   │   │
│   │   └── validations/
│   │       ├── auth.ts
│   │       ├── prompts.ts
│   │       └── generator.ts
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-prompts.ts
│   │   ├── use-generator.ts
│   │   ├── use-favorites.ts
│   │   ├── use-credits.ts
│   │   └── use-media-query.ts
│   │
│   ├── stores/
│   │   ├── auth-store.ts
│   │   ├── generator-store.ts
│   │   └── ui-store.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── database.ts
│   │   ├── api.ts
│   │   └── generator.ts
│   │
│   └── config/
│       ├── site.ts                      # Site metadata
│       ├── navigation.ts                # Nav items
│       └── pricing.ts                   # Pricing tiers
│
├── public/
│   ├── logo.svg
│   ├── favicon.ico
│   └── images/
│
├── drizzle.config.ts
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
├── .env.local
└── package.json
```

---

## STEP 3: CONFIGURATION FILES

### 3.1 Environment Variables (.env.example)

```env
# ===========================================
# DATABASE
# ===========================================
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host/database?sslmode=require"

# ===========================================
# AUTHENTICATION (Better Auth)
# ===========================================
BETTER_AUTH_SECRET="your-secret-key-min-32-chars-here"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ===========================================
# AI PROVIDERS
# ===========================================
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."

# ===========================================
# PAYMENTS
# ===========================================
# Stripe (Global)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Razorpay (India)
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."

# ===========================================
# REDIS (Upstash)
# ===========================================
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# ===========================================
# EMAIL (Resend)
# ===========================================
RESEND_API_KEY="re_..."
EMAIL_FROM="PromptShip <hello@promptship.dev>"

# ===========================================
# VIDEO (Mux) - Phase 2
# ===========================================
MUX_TOKEN_ID="..."
MUX_TOKEN_SECRET="..."

# ===========================================
# ANALYTICS - Phase 2
# ===========================================
NEXT_PUBLIC_POSTHOG_KEY="..."
SENTRY_DSN="..."
```

### 3.2 Drizzle Config (drizzle.config.ts)

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
```

### 3.3 Next.js Config (next.config.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 3.4 Tailwind Config (tailwind.config.ts)

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Brand colors
        brand: {
          purple: '#7C3AED',
          cyan: '#06B6D4',
          orange: '#F97316',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

---

## STEP 4: DATABASE SCHEMA

### 4.1 Complete Drizzle Schema (src/lib/db/schema.ts)

```typescript
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
  jsonb,
  decimal,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// =============================================
// ENUMS
// =============================================

export const userTierEnum = pgEnum('user_tier', ['free', 'starter', 'pro', 'team']);
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'canceled',
  'past_due',
  'paused',
  'trialing',
]);
export const paymentProviderEnum = pgEnum('payment_provider', ['stripe', 'razorpay']);
export const frameworkEnum = pgEnum('framework', ['react', 'flutter', 'html', 'vue']);

// =============================================
// USERS & AUTHENTICATION
// =============================================

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }),
    avatarUrl: text('avatar_url'),
    tier: userTierEnum('tier').default('free').notNull(),
    role: userRoleEnum('role').default('user').notNull(),
    credits: integer('credits').default(0).notNull(),
    defaultFramework: varchar('default_framework', { length: 20 }).default('react'),
    preferredCurrency: varchar('preferred_currency', { length: 3 }).default('USD'),
    onboardingCompleted: boolean('onboarding_completed').default(false),
    emailVerified: boolean('email_verified').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
    tierIdx: index('users_tier_idx').on(table.tier),
  })
);

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    token: varchar('token', { length: 255 }).unique().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tokenIdx: uniqueIndex('sessions_token_idx').on(table.token),
    userIdx: index('sessions_user_idx').on(table.userId),
  })
);

export const magicLinks = pgTable('magic_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).unique().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// =============================================
// SUBSCRIPTIONS & PAYMENTS
// =============================================

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    plan: varchar('plan', { length: 50 }).notNull(),
    status: subscriptionStatusEnum('status').default('active').notNull(),
    provider: paymentProviderEnum('provider').notNull(),
    providerSubscriptionId: varchar('provider_subscription_id', { length: 255 }),
    providerCustomerId: varchar('provider_customer_id', { length: 255 }),
    currentPeriodStart: timestamp('current_period_start', { withTimezone: true }),
    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index('subscriptions_user_idx').on(table.userId),
    providerIdx: index('subscriptions_provider_idx').on(
      table.provider,
      table.providerSubscriptionId
    ),
  })
);

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id),
  provider: paymentProviderEnum('provider').notNull(),
  providerPaymentId: varchar('provider_payment_id', { length: 255 }),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// =============================================
// PROMPTS & CATEGORIES
// =============================================

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const prompts = pgTable(
  'prompts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    categoryId: uuid('category_id').references(() => categories.id),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    description: text('description'),
    promptText: text('prompt_text').notNull(),
    tier: userTierEnum('tier').default('free').notNull(),
    frameworks: varchar('frameworks', { length: 20 }).array().default(['react']),
    previewImageUrl: text('preview_image_url'),
    usageCount: integer('usage_count').default(0),
    copyCount: integer('copy_count').default(0),
    favoriteCount: integer('favorite_count').default(0),
    isFeatured: boolean('is_featured').default(false),
    isPublished: boolean('is_published').default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    categoryIdx: index('prompts_category_idx').on(table.categoryId),
    tierIdx: index('prompts_tier_idx').on(table.tier),
    publishedIdx: index('prompts_published_idx').on(table.isPublished),
  })
);

export const promptCopies = pgTable(
  'prompt_copies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    promptId: uuid('prompt_id')
      .references(() => prompts.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userDateIdx: index('prompt_copies_user_date_idx').on(table.userId, table.createdAt),
  })
);

export const favorites = pgTable(
  'favorites',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    promptId: uuid('prompt_id')
      .references(() => prompts.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userPromptUnique: uniqueIndex('favorites_user_prompt_idx').on(table.userId, table.promptId),
    userIdx: index('favorites_user_idx').on(table.userId),
  })
);

// =============================================
// AI GENERATIONS
// =============================================

export const generations = pgTable(
  'generations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    promptId: uuid('prompt_id').references(() => prompts.id, { onDelete: 'set null' }),
    framework: varchar('framework', { length: 20 }).notNull(),
    templateType: varchar('template_type', { length: 50 }),
    options: jsonb('options').default({}),
    inputPrompt: text('input_prompt').notNull(),
    outputCode: text('output_code').notNull(),
    aiProvider: varchar('ai_provider', { length: 20 }).default('claude'),
    aiModel: varchar('ai_model', { length: 50 }),
    tokensInput: integer('tokens_input'),
    tokensOutput: integer('tokens_output'),
    latencyMs: integer('latency_ms'),
    costUsd: decimal('cost_usd', { precision: 10, scale: 6 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userDateIdx: index('generations_user_date_idx').on(table.userId, table.createdAt),
  })
);

// =============================================
// LEARNING HUB
// =============================================

export const courseModules = pgTable('course_modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  description: text('description'),
  displayOrder: integer('display_order').default(0),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const lessons = pgTable('lessons', {
  id: uuid('id').primaryKey().defaultRandom(),
  moduleId: uuid('module_id')
    .references(() => courseModules.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  videoUrl: text('video_url'),
  videoDurationSec: integer('video_duration_sec'),
  displayOrder: integer('display_order').default(0),
  isFreePreview: boolean('is_free_preview').default(false),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const lessonProgress = pgTable(
  'lesson_progress',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    lessonId: uuid('lesson_id')
      .references(() => lessons.id, { onDelete: 'cascade' })
      .notNull(),
    watchTimeSec: integer('watch_time_sec').default(0),
    isCompleted: boolean('is_completed').default(false),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    lastPositionSec: integer('last_position_sec').default(0),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userLessonUnique: uniqueIndex('lesson_progress_user_lesson_idx').on(
      table.userId,
      table.lessonId
    ),
    userIdx: index('lesson_progress_user_idx').on(table.userId),
  })
);

// =============================================
// RELATIONS
// =============================================

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  subscriptions: many(subscriptions),
  promptCopies: many(promptCopies),
  favorites: many(favorites),
  generations: many(generations),
  lessonProgress: many(lessonProgress),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  prompts: many(prompts),
}));

export const promptsRelations = relations(prompts, ({ one, many }) => ({
  category: one(categories, {
    fields: [prompts.categoryId],
    references: [categories.id],
  }),
  copies: many(promptCopies),
  favorites: many(favorites),
}));

export const courseModulesRelations = relations(courseModules, ({ many }) => ({
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(courseModules, {
    fields: [lessons.moduleId],
    references: [courseModules.id],
  }),
  progress: many(lessonProgress),
}));
```

### 4.2 Database Connection (src/lib/db/index.ts)

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });

export type Database = typeof db;
```

---

## STEP 5: AUTHENTICATION SETUP

### 5.1 Better Auth Config (src/lib/auth/index.ts)

```typescript
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/lib/db';
import { users, sessions } from '@/lib/db/schema';
import { sendMagicLinkEmail } from '@/lib/email';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: users,
      session: sessions,
    },
  }),
  emailAndPassword: {
    enabled: false, // Magic link only
  },
  magicLink: {
    enabled: true,
    sendMagicLink: async ({ email, url }) => {
      await sendMagicLinkEmail({ email, url });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
  user: {
    additionalFields: {
      tier: {
        type: 'string',
        defaultValue: 'free',
      },
      credits: {
        type: 'number',
        defaultValue: 0,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
```

### 5.2 Auth Client (src/lib/auth/client.ts)

```typescript
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const { signIn, signOut, useSession } = authClient;
```

### 5.3 Auth Middleware (middleware.ts)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/app', '/admin'];
const authRoutes = ['/login', '/signup', '/verify'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Get session token from cookie
  const sessionToken = request.cookies.get('better-auth.session_token')?.value;

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL('/app/dashboard', request.url));
  }

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    // TODO: Check if user is admin
    // For now, just check if authenticated
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
```

---

## STEP 6: CORE UTILITIES

### 6.1 Class Merge Utility (src/lib/utils/cn.ts)

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 6.2 Constants (src/lib/utils/constants.ts)

```typescript
export const APP_NAME = 'PromptShip';
export const APP_DESCRIPTION = 'Ship beautiful UIs with AI - curated prompts, one-click generation, and education.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://promptship.dev';

export const FRAMEWORKS = ['react', 'flutter', 'html', 'vue'] as const;
export type Framework = (typeof FRAMEWORKS)[number];

export const TIERS = ['free', 'starter', 'pro', 'team'] as const;
export type Tier = (typeof TIERS)[number];

export const TIER_LIMITS = {
  free: {
    promptCopies: 5,
    generations: 0,
    courseAccess: false,
  },
  starter: {
    promptCopies: 50,
    generations: 0,
    courseAccess: false,
  },
  pro: {
    promptCopies: Infinity,
    generations: 100,
    courseAccess: true,
  },
  team: {
    promptCopies: Infinity,
    generations: 500,
    courseAccess: true,
  },
} as const;

export const STYLES = [
  'minimal',
  'glassmorphism',
  'gradient',
  'bold',
  'neumorphism',
] as const;
export type Style = (typeof STYLES)[number];

export const ANIMATION_LEVELS = ['none', 'subtle', 'dynamic'] as const;
export type AnimationLevel = (typeof ANIMATION_LEVELS)[number];
```

### 6.3 Site Config (src/config/site.ts)

```typescript
export const siteConfig = {
  name: 'PromptShip',
  description: 'Ship beautiful UIs with AI - curated prompts, one-click generation, and education.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://promptship.dev',
  ogImage: 'https://promptship.dev/og.jpg',
  links: {
    twitter: 'https://twitter.com/promptship',
    github: 'https://github.com/promptship',
    discord: 'https://discord.gg/promptship',
  },
  creator: 'Mubashir Ahmed',
  keywords: [
    'AI prompts',
    'UI generation',
    'Flutter',
    'React',
    'Code generation',
    'Design system',
  ],
};

export type SiteConfig = typeof siteConfig;
```

### 6.4 Navigation Config (src/config/navigation.ts)

```typescript
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  GraduationCap,
  History,
  Settings,
  Users,
  BarChart3,
} from 'lucide-react';

export const appNavigation = [
  {
    title: 'Dashboard',
    href: '/app/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Prompts',
    href: '/app/prompts',
    icon: FileText,
  },
  {
    title: 'Generate',
    href: '/app/generate',
    icon: Sparkles,
  },
  {
    title: 'Learn',
    href: '/app/learn',
    icon: GraduationCap,
  },
  {
    title: 'History',
    href: '/app/history',
    icon: History,
  },
  {
    title: 'Settings',
    href: '/app/settings',
    icon: Settings,
  },
];

export const adminNavigation = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Prompts',
    href: '/admin/prompts',
    icon: FileText,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
];

export const marketingNavigation = [
  { title: 'Features', href: '/#features' },
  { title: 'Pricing', href: '/pricing' },
  { title: 'Blog', href: '/blog' },
  { title: 'Docs', href: '/docs' },
];
```

### 6.5 Pricing Config (src/config/pricing.ts)

```typescript
export const pricingPlans = {
  starter: {
    name: 'Starter',
    description: 'Perfect for trying out PromptShip',
    priceINR: 499,
    priceUSD: 9,
    isOneTime: true,
    features: [
      '50 premium prompts',
      'All frameworks (React, Flutter, HTML)',
      'Lifetime updates',
      'Community Discord access',
    ],
    limits: {
      promptCopies: 50,
      generations: 0,
    },
  },
  pro: {
    name: 'Pro',
    description: 'For serious developers',
    priceINR: {
      monthly: 999,
      yearly: 4999,
    },
    priceUSD: {
      monthly: 15,
      yearly: 99,
    },
    isOneTime: false,
    popular: true,
    features: [
      'Unlimited prompts',
      '100 AI generations/month',
      'Full course access',
      'Priority support',
      'New prompts weekly',
    ],
    limits: {
      promptCopies: Infinity,
      generations: 100,
    },
  },
  team: {
    name: 'Team',
    description: 'For agencies and teams',
    priceINR: {
      monthly: 2999,
    },
    priceUSD: {
      monthly: 49,
    },
    isOneTime: false,
    features: [
      'Everything in Pro',
      '5 team seats',
      '500 AI generations/month',
      'API access',
      'Custom branding',
      'Dedicated support',
    ],
    limits: {
      promptCopies: Infinity,
      generations: 500,
      seats: 5,
    },
  },
};

export type PlanKey = keyof typeof pricingPlans;
```

---

## STEP 7: GLOBAL STYLES

### 7.1 Global CSS (src/app/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 262.1 83.3% 57.8%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 262.1 83.3% 57.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

/* Custom scrollbar */
@layer utilities {
  .scrollbar-thin {
    scrollbar-width: thin;
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    @apply bg-muted rounded-full;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    @apply bg-muted-foreground/30 rounded-full;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    @apply bg-muted-foreground/50;
  }
}

/* Gradient text */
.gradient-text {
  @apply bg-gradient-to-r from-purple-500 via-cyan-500 to-orange-500 bg-clip-text text-transparent;
}

/* Glass effect */
.glass {
  @apply bg-white/10 backdrop-blur-lg border border-white/20;
}

.dark .glass {
  @apply bg-black/20 border-white/10;
}
```

---

## STEP 8: ROOT LAYOUT

### 8.1 Root Layout (src/app/layout.tsx)

```typescript
import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@promptship',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          jetbrainsMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## STEP 9: RUN THESE COMMANDS

After creating all files, run:

```bash
# Generate Drizzle migrations
pnpm drizzle-kit generate

# Push to database (creates tables)
pnpm drizzle-kit push

# Start dev server
pnpm dev
```

---

## IMPORTANT NOTES FOR CLAUDE CODE

1. **Create all files in exact paths specified** - The folder structure must match exactly.

2. **Install shadcn/ui components** - After initial setup, run:
   ```bash
   pnpm dlx shadcn@latest init
   pnpm dlx shadcn@latest add button card input label dialog dropdown-menu select tabs toast avatar badge separator skeleton tooltip accordion alert checkbox popover switch
   ```

3. **Create providers** - You need to create:
   - `src/components/providers/theme-provider.tsx`
   - `src/components/providers/query-provider.tsx`

4. **The architecture HTML file** should be placed in:
   - `public/docs/promptship-technical-architecture.html`
   - Then create a route at `src/app/(docs)/docs/architecture/page.tsx` that displays it

5. **Environment variables** - Copy `.env.example` to `.env.local` and fill in your actual values.

6. **Database first** - Make sure your Neon database is created and the DATABASE_URL is set before running migrations.

---

## NEXT STEPS AFTER FOUNDATION

Once this foundation is set up, proceed with:

1. **Week 2**: Dashboard layout, settings page, email templates
2. **Week 3**: Prompt library UI, search, categories, copy function

Reference the full architecture document at `/docs/architecture` for detailed specifications of each module.

---

**END OF PROMPT**
