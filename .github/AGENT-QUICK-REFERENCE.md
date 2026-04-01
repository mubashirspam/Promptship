# AI Agent Quick Reference

> **For AI Agents**: This is your cheat sheet. Read this FIRST before generating any code.

---

## 🚦 Before You Generate Code

### 1. Check File Location
```
✅ src/components/{ui,shared,layout,auth,dashboard,prompts,generator,marketing,admin,providers}/
✅ src/lib/{db,auth,ai,payments,email,validations,utils}/
✅ src/app/{(marketing),(auth),(app),(admin),(docs),api}/
✅ src/{hooks,stores,types,config}/

❌ src/helpers/
❌ src/services/
❌ src/features/
```

### 2. Choose Component Type
```typescript
// Server Component (DEFAULT)
export function MyComponent() { }

// Client Component (ONLY if needed)
'use client';
export function MyComponent() { }
```

**Use Client Component ONLY for**:
- `useState`, `useEffect`, `useContext`
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`window`, `localStorage`)
- Third-party hooks

### 3. Import Pattern
```typescript
// ✅ ALWAYS
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';

// ❌ NEVER
import { Button } from '../../../components/ui/button';
```

---

## 📋 Common Patterns

### API Route
```typescript
// src/app/api/your-route/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { rateLimit } from '@/lib/utils/rate-limit';

export async function POST(req: NextRequest) {
  try {
    await rateLimit(req);
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const body = await req.json();
    const validated = yourSchema.parse(body);
    
    // Business logic here
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### Server Action
```typescript
// src/app/actions/your-action.ts
'use server';

import { auth } from '@/lib/auth';

export async function yourAction(data: unknown) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  
  const validated = yourSchema.parse(data);
  
  // Business logic here
  
  return { success: true };
}
```

### Validation Schema
```typescript
// src/lib/validations/your-module.ts
import { z } from 'zod';

export const yourSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(10),
});

export type YourInput = z.infer<typeof yourSchema>;
```

### Database Query
```typescript
// ✅ CORRECT
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';

const result = await db
  .select()
  .from(prompts)
  .where(eq(prompts.userId, userId));

// ❌ WRONG
const result = await db.execute(sql`SELECT * FROM prompts`);
```

---

## 🚫 Never Do This

```typescript
// ❌ 'any' type
const data: any = {};

// ❌ Inline styles
<div style={{ padding: '20px' }}>

// ❌ Hardcoded secrets
const apiKey = 'sk_test_123';

// ❌ Unvalidated database insert
await db.insert(table).values(req.body);

// ❌ Missing auth check in protected route
export async function POST(req: NextRequest) {
  // Missing: const session = await auth();
}

// ❌ Modifying shadcn/ui components
// src/components/ui/button.tsx

// ❌ Creating new folders
// src/helpers/
// src/services/
```

---

## ✅ Always Do This

```typescript
// ✅ Validate inputs
const validated = schema.parse(data);

// ✅ Check auth
const session = await auth();
if (!session) throw new Error('Unauthorized');

// ✅ Handle errors
try {
  // risky operation
} catch (error) {
  console.error(error);
  return { success: false, error: 'Operation failed' };
}

// ✅ Use absolute imports
import { cn } from '@/lib/utils/cn';

// ✅ Type everything
interface Props {
  title: string;
}

// ✅ Use Tailwind classes
<div className="rounded-lg border p-4">
```

---

## 🎯 Scaffolding Commands

```bash
# Component
pnpm scaffold:component auth LoginForm --client
pnpm scaffold:component shared Card

# API Route
pnpm scaffold:api prompts/[id]

# Server Action
pnpm scaffold:action createPrompt

# Validation
pnpm scaffold:validation prompt
```

---

## 📚 Reference Documents

1. **Full Architecture**: `/AGENTS.md`
2. **Auto-enforced Rules**: `/.windsurfrules`
3. **Module Context**: `src/components/{module}/CONTEXT.md`
4. **System Overview**: `/AGENT-SYSTEM.md`

---

## 🔍 Quick Checks

Before submitting code, verify:

- [ ] File in correct folder
- [ ] Absolute imports (`@/`)
- [ ] No `any` types
- [ ] Server Component (unless needs client features)
- [ ] Zod validation for inputs
- [ ] Auth check in protected routes
- [ ] Error handling
- [ ] Tailwind classes (no inline styles)
- [ ] No hardcoded secrets

---

**Remember**: When in doubt, check `/AGENTS.md` or use scaffolding!
