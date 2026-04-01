---
description: Review code changes against architecture rules
---

# Architecture Review Workflow

Run this after any AI code generation session to catch architectural violations.

## Step 1: Review File Locations

Check that all new/modified files are in the correct locations:

```bash
git status
```

**Verify:**
- ✅ Components in `src/components/{ui,shared,layout,auth,dashboard,prompts,generator,marketing,admin,providers}/`
- ✅ Utilities in `src/lib/{db,auth,ai,payments,email,validations,utils}/`
- ✅ API routes in `src/app/api/`
- ✅ Pages in `src/app/(marketing|auth|app|admin|docs)/`
- ❌ NO files in `src/helpers/`, `src/services/`, `src/features/`

## Step 2: Check Import Patterns

```bash
# Find relative imports beyond parent directory
rg "from ['\"]\.\.\/\.\.\/\.\.\/" src/
```

**Should return:** No results

```bash
# Find non-absolute imports in components
rg "from ['\"]\.\.?\/" src/components/ src/lib/
```

**Should use:** `@/` alias instead

## Step 3: Validate TypeScript Strictness

```bash
# Find 'any' types
rg ": any\b|as any\b" src/ --type ts --type tsx
```

**Should return:** Minimal results (only where absolutely necessary)

## Step 4: Check Component Patterns

```bash
# Find unnecessary 'use client' directives
rg "^'use client'" src/app/\(marketing\)/ src/app/\(docs\)/
```

**Should return:** No results (marketing/docs should be server components)

```bash
# Find inline styles
rg "style=\{\{" src/
```

**Should return:** No results

## Step 5: Validate Database Operations

```bash
# Find raw SQL usage
rg "db\.execute\(sql" src/
```

**Should return:** No results (use Drizzle query builder)

```bash
# Find unvalidated database inserts
rg "db\.insert.*\.values\(req\.body\)" src/
```

**Should return:** No results (should validate with Zod first)

## Step 6: Check Security Patterns

```bash
# Find hardcoded secrets
rg "(api_key|secret|password)\s*=\s*['\"]" src/ --type ts --type tsx
```

**Should return:** No results

```bash
# Find missing auth checks in API routes
rg "export async function (GET|POST|PUT|DELETE)" src/app/api/ -A 5 | rg -v "auth\(\)"
```

**Review:** Each API route should check auth (unless intentionally public)

## Step 7: Validate Naming Conventions

```bash
# Find incorrectly named component files
fd -e tsx -e ts . src/components/ | rg "[a-z]+-[a-z]+\.tsx$"
```

**Should return:** No results (components should be PascalCase)

```bash
# Find incorrectly named utility files  
fd -e ts . src/lib/utils/ | rg "[A-Z]"
```

**Should return:** No results (utilities should be kebab-case)

## Step 8: Check shadcn/ui Modifications

```bash
# Check if ui components were modified
git diff src/components/ui/
```

**Should return:** No changes (never modify shadcn primitives)

## Step 9: Validate Error Handling

```bash
# Find try-catch blocks without proper error handling
rg "catch \(error\)" src/ -A 2 | rg -v "(console\.|throw|return.*error)"
```

**Review:** Each catch should log, throw, or return structured error

## Step 10: Final Checklist

- [ ] All files in correct folders
- [ ] Absolute imports with `@/` alias
- [ ] No `any` types (except where necessary)
- [ ] Server Components by default
- [ ] Zod validation before database operations
- [ ] No inline styles
- [ ] No hardcoded secrets
- [ ] Auth checks in protected routes
- [ ] Proper error handling
- [ ] Correct naming conventions

## Auto-Fix Common Issues

```bash
# Fix import aliases (manual review required)
# Replace relative imports with absolute

# Format code
pnpm prettier --write src/

# Type check
pnpm tsc --noEmit
```

## If Violations Found

1. Document the violation
2. Determine root cause
3. Fix immediately or create task
4. Update AGENTS.md if new pattern discovered
5. Re-run this review
