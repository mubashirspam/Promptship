# AGENTS.md - AI Agent Constraints for PromptShip

> **Purpose**: This document defines architectural constraints, patterns, and anti-patterns for AI code generation. It is NOT documentation for humans—it's a contract for agents.

---

## 🏗️ ARCHITECTURE OVERVIEW

**Stack**: Next.js 15 (App Router) + React 19 + TypeScript + Drizzle ORM + Neon Postgres + Better Auth

**Key Principles**:
- Server Components by default, Client Components only when needed
- Colocated route handlers in `app/api/`
- Database-first design with Drizzle schema as source of truth
- Type safety everywhere—no `any` types
- Zod validation for all user inputs

---

## 📁 FOLDER STRUCTURE (IMMUTABLE)

```
src/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Public pages (/, /pricing, /blog)
│   ├── (auth)/                   # Auth pages (/login, /signup)
│   ├── (app)/                    # Protected app pages (/dashboard, /prompts, /generator)
│   ├── (admin)/                  # Admin pages (/admin/*)
│   ├── (docs)/                   # Docs pages (/docs/*)
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/
│   ├── ui/                       # shadcn/ui primitives (DO NOT MODIFY)
│   ├── shared/                   # Reusable components (Button, Card, etc.)
│   ├── layout/                   # Layout components (Navbar, Footer, Sidebar)
│   ├── auth/                     # Auth-specific components
│   ├── dashboard/                # Dashboard-specific components
│   ├── prompts/                  # Prompt library components
│   ├── generator/                # Code generator components
│   ├── marketing/                # Marketing page components
│   ├── admin/                    # Admin panel components
│   └── providers/                # Context providers
│
├── lib/
│   ├── db/
│   │   ├── schema.ts             # Drizzle schema (SINGLE SOURCE OF TRUTH)
│   │   └── index.ts              # Database client
│   ├── auth/
│   │   └── index.ts              # Better Auth config
│   ├── ai/
│   │   ├── anthropic.ts          # Claude integration
│   │   └── openai.ts             # OpenAI integration
│   ├── payments/
│   │   ├── stripe.ts             # Stripe integration
│   │   └── razorpay.ts           # Razorpay integration
│   ├── email/
│   │   └── resend.ts             # Email service
│   ├── validations/              # Zod schemas
│   │   ├── auth.ts
│   │   ├── prompts.ts
│   │   └── generator.ts
│   └── utils/
│       ├── cn.ts                 # Tailwind merge utility
│       ├── rate-limit.ts         # Rate limiting
│       └── errors.ts             # Error handling
│
├── hooks/                        # Custom React hooks
├── stores/                       # Zustand stores
├── types/                        # TypeScript types
└── config/                       # App configuration
```

---

## 🚫 ANTI-PATTERNS (NEVER DO THIS)

### 1. **DO NOT** Create Files Outside This Structure
```typescript
// ❌ WRONG
src/helpers/utils.ts
src/services/api.ts
src/features/auth/components/LoginForm.tsx

// ✅ CORRECT
src/lib/utils/helpers.ts
src/lib/utils/api.ts
src/components/auth/LoginForm.tsx
```

### 2. **DO NOT** Use Client Components Unnecessarily
```typescript
// ❌ WRONG - Server Component marked as client
'use client';
export default function StaticPage() {
  return <div>Static content</div>;
}

// ✅ CORRECT - Server Component by default
export default function StaticPage() {
  return <div>Static content</div>;
}
```

### 3. **DO NOT** Bypass Validation
```typescript
// ❌ WRONG - Direct database insert without validation
await db.insert(prompts).values(req.body);

// ✅ CORRECT - Validate first
const validated = createPromptSchema.parse(req.body);
await db.insert(prompts).values(validated);
```

### 4. **DO NOT** Hardcode Configuration
```typescript
// ❌ WRONG
const apiKey = 'sk_test_123456789';

// ✅ CORRECT
const apiKey = process.env.STRIPE_SECRET_KEY!;
```

### 5. **DO NOT** Modify shadcn/ui Components
```typescript
// ❌ WRONG - Editing src/components/ui/button.tsx
// ✅ CORRECT - Create wrapper in src/components/shared/
```

### 6. **DO NOT** Use Inline Styles
```typescript
// ❌ WRONG
<div style={{ padding: '20px', color: 'red' }}>

// ✅ CORRECT
<div className="p-5 text-red-500">
```

### 7. **DO NOT** Create Duplicate Utilities
```typescript
// ❌ WRONG - Creating new cn() function
export function classNames(...classes: string[]) { }

// ✅ CORRECT - Use existing cn() from lib/utils/cn.ts
import { cn } from '@/lib/utils/cn';
```

---

## ✅ MANDATORY PATTERNS

### 1. **Database Schema First**
```typescript
// ALWAYS define schema in src/lib/db/schema.ts first
export const prompts = pgTable('prompts', {
  id: textId('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  // ... rest of schema
});

// Then generate types
export type Prompt = typeof prompts.$inferSelect;
export type NewPrompt = typeof prompts.$inferInsert;
```

### 2. **Zod Validation for All Inputs**
```typescript
// src/lib/validations/prompts.ts
export const createPromptSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(10),
  category: z.enum(['ui', 'ux', 'components']),
});

// Use in API routes
const validated = createPromptSchema.parse(await req.json());
```

### 3. **Server Actions Pattern**
```typescript
// app/actions/prompts.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function createPrompt(data: unknown) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  
  const validated = createPromptSchema.parse(data);
  return await db.insert(prompts).values(validated);
}
```

### 4. **Error Handling**
```typescript
// Always use try-catch with proper error types
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  if (error instanceof ZodError) {
    return { success: false, error: 'Validation failed' };
  }
  throw error; // Re-throw unexpected errors
}
```

### 5. **Component Structure**
```typescript
// 1. Imports (grouped: react, next, third-party, local)
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

// 2. Types
interface Props {
  title: string;
}

// 3. Component
export function MyComponent({ title }: Props) {
  // 4. Hooks
  const router = useRouter();
  const [state, setState] = useState();
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Render
  return <div>{title}</div>;
}
```

### 6. **API Route Pattern**
```typescript
// app/api/prompts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/utils/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting
    await rateLimit(req);
    
    // 2. Authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 3. Validation
    const body = await req.json();
    const validated = createPromptSchema.parse(body);
    
    // 4. Business logic
    const result = await db.insert(prompts).values(validated);
    
    // 5. Response
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

---

## 🎯 STATE MANAGEMENT RULES

### 1. **Server State** → React Query
```typescript
// Use for data fetching
const { data, isLoading } = useQuery({
  queryKey: ['prompts'],
  queryFn: () => fetch('/api/prompts').then(r => r.json()),
});
```

### 2. **Client State** → Zustand
```typescript
// src/stores/generator-store.ts
import { create } from 'zustand';

interface GeneratorState {
  framework: 'react' | 'flutter' | 'html';
  setFramework: (framework: GeneratorState['framework']) => void;
}

export const useGeneratorStore = create<GeneratorState>((set) => ({
  framework: 'react',
  setFramework: (framework) => set({ framework }),
}));
```

### 3. **Form State** → React Hook Form
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(createPromptSchema),
  defaultValues: { title: '', description: '' },
});
```

---

## 🔒 AUTHENTICATION RULES

1. **ALWAYS** check auth in API routes and Server Actions
2. **NEVER** trust client-side auth state for authorization
3. **USE** Better Auth session management
4. **PROTECT** routes with middleware when needed

```typescript
// Middleware pattern
import { auth } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const session = await auth();
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}
```

---

## 💾 DATABASE RULES

1. **Schema is source of truth** - All types derive from `schema.ts`
2. **Use transactions** for multi-table operations
3. **Index frequently queried columns**
4. **Use enums** for fixed value sets (defined in schema)
5. **Never use raw SQL** unless absolutely necessary

```typescript
// ✅ CORRECT - Using Drizzle query builder
const result = await db
  .select()
  .from(prompts)
  .where(eq(prompts.userId, userId))
  .limit(10);

// ❌ WRONG - Raw SQL
const result = await db.execute(sql`SELECT * FROM prompts WHERE user_id = ${userId}`);
```

---

## 🎨 STYLING RULES

1. **USE** Tailwind CSS utility classes
2. **USE** `cn()` utility for conditional classes
3. **USE** CSS variables for theme colors (defined in globals.css)
4. **NEVER** use inline styles
5. **NEVER** create separate CSS modules

```typescript
// ✅ CORRECT
import { cn } from '@/lib/utils/cn';

<div className={cn(
  "rounded-lg border p-4",
  isActive && "bg-primary text-primary-foreground"
)}>
```

---

## 🧪 TESTING RULES

1. **Write tests** for utility functions
2. **Write tests** for validation schemas
3. **Write tests** for API routes
4. **DO NOT** test UI components unless critical

---

## 📦 IMPORT RULES

1. **USE** absolute imports with `@/` alias
2. **GROUP** imports: react → next → third-party → local
3. **NEVER** use relative imports beyond parent directory

```typescript
// ✅ CORRECT
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';

// ❌ WRONG
import { Button } from '../../../components/ui/button';
```

---

## 🚀 PERFORMANCE RULES

1. **USE** Server Components by default
2. **USE** `loading.tsx` for route loading states
3. **USE** `error.tsx` for error boundaries
4. **USE** dynamic imports for heavy components
5. **AVOID** client-side data fetching when server-side is possible

```typescript
// Dynamic import for heavy components
const HeavyChart = dynamic(() => import('@/components/charts/HeavyChart'), {
  loading: () => <Skeleton />,
});
```

---

## 🔐 SECURITY RULES

1. **VALIDATE** all user inputs with Zod
2. **SANITIZE** user-generated content before rendering
3. **USE** environment variables for secrets
4. **NEVER** expose API keys to client
5. **IMPLEMENT** rate limiting on public endpoints
6. **USE** CSRF protection for mutations

---

## 📝 NAMING CONVENTIONS

### Files
- **Components**: PascalCase (`LoginForm.tsx`)
- **Utilities**: kebab-case (`rate-limit.ts`)
- **API Routes**: kebab-case (`route.ts`, `[id]/route.ts`)
- **Types**: kebab-case (`auth-types.ts`)

### Code
- **Components**: PascalCase (`LoginForm`)
- **Functions**: camelCase (`getUserById`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_PROMPTS_PER_USER`)
- **Types/Interfaces**: PascalCase (`UserSession`, `PromptData`)

---

## 🔄 WHEN MODIFYING EXISTING CODE

1. **READ** the entire file first
2. **PRESERVE** existing patterns and style
3. **MATCH** indentation and formatting
4. **UPDATE** related types if schema changes
5. **TEST** the change doesn't break existing functionality

---

## 🆕 WHEN ADDING NEW FEATURES

1. **CHECK** if similar functionality exists
2. **FOLLOW** the folder structure exactly
3. **CREATE** validation schema first
4. **CREATE** database schema if needed
5. **CREATE** types from schema
6. **IMPLEMENT** server action or API route
7. **IMPLEMENT** UI component
8. **ADD** error handling
9. **ADD** loading states

---

## 🎯 PROMPT GENERATION SPECIFIC RULES

### AI Provider Integration
```typescript
// ALWAYS use the abstracted AI client
import { generateCode } from '@/lib/ai/anthropic';

// NEVER instantiate providers directly in components
// ❌ WRONG
const anthropic = new Anthropic({ apiKey: '...' });
```

### Code Generation Output
```typescript
// ALWAYS return structured output
interface GeneratedCode {
  code: string;
  framework: 'react' | 'flutter' | 'html' | 'vue';
  dependencies: string[];
  instructions?: string;
}
```

---

## 🎓 LEARNING HUB RULES

1. **Videos** stored as metadata (URL, duration, thumbnail)
2. **Progress tracking** in database
3. **Gated content** based on user tier
4. **NO** video hosting—use external providers

---

## 💳 PAYMENT RULES

1. **Dual provider support**: Stripe (international) + Razorpay (India)
2. **Webhook handlers** in `app/api/webhooks/[provider]/route.ts`
3. **Idempotency** for all payment operations
4. **Audit trail** in database

---

## 📊 ANALYTICS & MONITORING

1. **Log** all AI generation requests
2. **Track** user tier usage limits
3. **Monitor** API rate limits
4. **Store** generation history for users

---

## 🔧 ENVIRONMENT VARIABLES

Required variables (defined in `.env.example`):
- `DATABASE_URL` - Neon Postgres connection
- `BETTER_AUTH_SECRET` - Auth secret
- `ANTHROPIC_API_KEY` - Claude API
- `OPENAI_API_KEY` - OpenAI API
- `STRIPE_SECRET_KEY` - Stripe
- `RAZORPAY_KEY_ID` - Razorpay
- `RESEND_API_KEY` - Email service
- `UPSTASH_REDIS_URL` - Rate limiting

**NEVER** commit `.env.local` to git.

---

## 🎯 SUMMARY FOR AGENTS

**Before generating ANY code:**
1. ✅ Verify the file location matches the folder structure
2. ✅ Check if similar functionality exists
3. ✅ Use existing patterns and utilities
4. ✅ Validate inputs with Zod
5. ✅ Follow naming conventions
6. ✅ Add proper error handling
7. ✅ Use TypeScript strictly (no `any`)
8. ✅ Prefer Server Components
9. ✅ Use absolute imports
10. ✅ Match existing code style

**Red flags that indicate you're doing it wrong:**
- 🚫 Creating new folders in `src/`
- 🚫 Using `any` type
- 🚫 Skipping validation
- 🚫 Hardcoding values
- 🚫 Using inline styles
- 🚫 Creating duplicate utilities
- 🚫 Modifying `components/ui/`
- 🚫 Using relative imports
- 🚫 Client Components for static content
- 🚫 Missing error handling

---

**Last Updated**: 2026-04-01
**Version**: 1.0.0
