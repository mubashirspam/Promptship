# Agent Constraint System for PromptShip

This document explains the multi-layered AI agent constraint system that keeps code generation aligned with PromptShip's architecture.

## 🎯 System Overview

The constraint system combines **5 complementary approaches** to prevent architectural drift:

```
┌─────────────────────────────────────────────────────────┐
│  1. AGENTS.md - Living Architecture Document           │
│     → Comprehensive patterns & anti-patterns           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  2. .windsurfrules - Auto-enforced Constraints         │
│     → Fires on every generation automatically          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  3. Module CONTEXT.md Files - Local Constraints        │
│     → Feature-specific patterns & dependencies          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  4. Scaffolding Scripts - Structural Lock               │
│     → Pre-built templates eliminate drift               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  5. Architecture Review Workflow - Validation           │
│     → Post-generation verification & auto-fix           │
└─────────────────────────────────────────────────────────┘
```

---

## 📚 Layer 1: AGENTS.md

**Location**: `/AGENTS.md`

**Purpose**: Single source of truth for architectural constraints, patterns, and anti-patterns.

**When it's used**:
- Automatically referenced by Windsurf/Cursor on every generation
- Manually referenced when uncertain about patterns
- Updated when new patterns emerge

**Key sections**:
- Folder structure (immutable)
- Anti-patterns (what NOT to do)
- Mandatory patterns (what to ALWAYS do)
- State management rules
- Security & performance guidelines

**Example constraint**:
```typescript
// ❌ WRONG - Direct database insert without validation
await db.insert(prompts).values(req.body);

// ✅ CORRECT - Validate first
const validated = createPromptSchema.parse(req.body);
await db.insert(prompts).values(validated);
```

---

## 🔒 Layer 2: .windsurfrules

**Location**: `/.windsurfrules`

**Purpose**: Automatically enforced rules on every AI code generation.

**When it's used**:
- Fires automatically in Windsurf IDE
- No manual invocation needed
- Acts as a pre-generation filter

**Key constraints**:
- File structure boundaries
- Import patterns
- Component type rules (Server vs Client)
- Database validation requirements
- Security checks

**Example rule**:
```
- NEVER create files outside src/{app,components,lib,hooks,stores,types,config}
- ALWAYS validate user inputs with Zod before database operations
- NEVER use 'any' type
```

---

## 📁 Layer 3: Module CONTEXT.md Files

**Location**: `src/components/{module}/CONTEXT.md`, `src/lib/{module}/CONTEXT.md`

**Purpose**: Feature-specific constraints, dependencies, and patterns.

**Existing modules**:
- `src/components/generator/CONTEXT.md` - AI code generation
- `src/components/auth/CONTEXT.md` - Authentication patterns
- `src/lib/payments/CONTEXT.md` - Payment integration

**When to create new CONTEXT.md**:
- New feature module added
- Complex integration patterns
- Module-specific security rules
- Non-obvious dependencies

**Example content**:
```markdown
## Dependencies
- `@/lib/ai/anthropic` - Claude API client
- `@/lib/validations/generator` - Input validation

## Key Constraints
- NEVER instantiate AI clients directly in components
- ALWAYS use `generateCode()` abstraction
- Rate limit: Check user tier before generation
```

---

## 🏗️ Layer 4: Scaffolding Scripts

**Location**: `/scripts/scaffold-component.ts`

**Purpose**: Generate boilerplate code that follows architecture automatically.

**Available commands**:
```bash
# Generate component
pnpm scaffold:component auth LoginForm --client
pnpm scaffold:component shared Card

# Generate API route
pnpm scaffold:api prompts/[id]

# Generate server action
pnpm scaffold:action createPrompt

# Generate validation schema
pnpm scaffold:validation prompt
```

**Benefits**:
- Eliminates structural drift entirely
- Enforces naming conventions
- Includes proper imports and patterns
- Adds error handling by default

**Generated patterns**:
- Server Components (default)
- Client Components (with `--client`)
- API routes with rate limiting + auth
- Server actions with validation
- Zod schemas with TypeScript inference

---

## ✅ Layer 5: Architecture Review Workflow

**Location**: `/.windsurf/workflows/architecture-review.md`

**Purpose**: Post-generation validation to catch violations.

**When to run**:
```bash
# After any AI code generation session
/architecture-review
```

**What it checks**:
1. ✅ File locations match structure
2. ✅ Import patterns (absolute vs relative)
3. ✅ TypeScript strictness (no `any`)
4. ✅ Component patterns (Server vs Client)
5. ✅ Database operations (validation + query builder)
6. ✅ Security (no hardcoded secrets, auth checks)
7. ✅ Naming conventions
8. ✅ shadcn/ui modifications
9. ✅ Error handling
10. ✅ Final checklist

**Auto-fix capabilities**:
```bash
# Format code
pnpm prettier --write src/

# Type check
pnpm tsc --noEmit
```

---

## 🔄 Workflow: How to Use the System

### For New Features

1. **Check AGENTS.md** for similar patterns
2. **Use scaffolding** to generate boilerplate:
   ```bash
   pnpm scaffold:component generator CodePreview --client
   pnpm scaffold:validation codeGeneration
   pnpm scaffold:api generator/preview
   ```
3. **Reference module CONTEXT.md** for feature-specific rules
4. **Let AI fill in business logic** (structure is locked)
5. **Run architecture review**:
   ```bash
   /architecture-review
   ```

### For AI-Generated Code

1. **AI reads AGENTS.md** automatically
2. **.windsurfrules** enforces constraints during generation
3. **Module CONTEXT.md** provides local context
4. **Review output** against patterns
5. **Run architecture review** to validate

### For Refactoring

1. **Read existing patterns** in AGENTS.md
2. **Update module CONTEXT.md** if patterns change
3. **Use scaffolding** for new components
4. **Run architecture review** before committing
5. **Update AGENTS.md** if new patterns discovered

---

## 🚨 Common Violations & Fixes

### Violation: Files in wrong location
```bash
# ❌ Wrong
src/helpers/utils.ts
src/services/api.ts

# ✅ Fix
src/lib/utils/helpers.ts
src/lib/utils/api.ts
```

### Violation: Relative imports
```typescript
// ❌ Wrong
import { Button } from '../../../components/ui/button';

// ✅ Fix
import { Button } from '@/components/ui/button';
```

### Violation: Unvalidated database operations
```typescript
// ❌ Wrong
await db.insert(prompts).values(req.body);

// ✅ Fix
const validated = createPromptSchema.parse(req.body);
await db.insert(prompts).values(validated);
```

### Violation: Client Component for static content
```typescript
// ❌ Wrong
'use client';
export default function StaticPage() {
  return <div>Static content</div>;
}

// ✅ Fix (remove 'use client')
export default function StaticPage() {
  return <div>Static content</div>;
}
```

---

## 📊 Maintenance

### When to Update AGENTS.md

- New architectural pattern discovered
- Anti-pattern identified in code review
- Technology stack changes
- Security vulnerability pattern found
- Performance optimization pattern emerges

### When to Create Module CONTEXT.md

- New feature module added (e.g., `src/components/analytics/`)
- Complex integration with external service
- Module-specific security requirements
- Non-obvious dependencies or patterns

### When to Update .windsurfrules

- Critical constraint violated repeatedly
- New security requirement
- Breaking change in dependencies
- Team-wide coding standard changes

---

## 🎓 Training New AI Agents

When working with a new AI agent (Claude, GPT-4, etc.):

1. **Point to AGENTS.md first**: "Read `/AGENTS.md` for architecture constraints"
2. **Reference module context**: "Check `src/components/auth/CONTEXT.md` for auth patterns"
3. **Use scaffolding**: "Generate with `pnpm scaffold:component auth LoginForm --client`"
4. **Validate output**: "Run `/architecture-review` to check compliance"

---

## 📈 Success Metrics

The system is working if:

- ✅ Zero files created outside defined structure
- ✅ Zero `any` types in new code
- ✅ Zero unvalidated database operations
- ✅ Zero inline styles
- ✅ Zero hardcoded secrets
- ✅ 100% absolute imports with `@/` alias
- ✅ Architecture review passes without violations

---

## 🔗 Quick Links

- **Architecture Document**: `/AGENTS.md`
- **Auto-enforced Rules**: `/.windsurfrules`
- **Module Contexts**: `src/components/*/CONTEXT.md`, `src/lib/*/CONTEXT.md`
- **Scaffolding Script**: `/scripts/scaffold-component.ts`
- **Review Workflow**: `/.windsurf/workflows/architecture-review.md`

---

## 💡 Pro Tips

1. **Always scaffold first** - Don't write boilerplate manually
2. **Reference CONTEXT.md** - Module-specific rules save time
3. **Run review early** - Catch violations before they compound
4. **Update docs immediately** - New patterns should be documented
5. **Use absolute imports** - Easier to refactor and maintain

---

**Last Updated**: 2026-04-01  
**Maintained By**: PromptShip Team  
**Questions?** Check `/AGENTS.md` or create an issue
