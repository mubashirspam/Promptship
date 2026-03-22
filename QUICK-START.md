# Quick Start Guide - Staging & Production Setup

This is a condensed version of the full deployment setup. For detailed instructions, see `DEPLOYMENT-SETUP.md`.

## 🚀 Quick Setup (15 minutes)

### 1. Create Neon Databases

**Staging:**
- Go to https://console.neon.tech/
- Create project: `promptship-staging`
- Copy connection string

**Production:**
- Create project: `promptship-production`
- Copy connection string

### 2. Configure Google OAuth

- Go to https://console.cloud.google.com/
- Create OAuth 2.0 credentials
- Add redirect URIs:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://your-staging.vercel.app/api/auth/callback/google`
  - `https://your-production.com/api/auth/callback/google`
- Copy Client ID and Secret

### 3. Set Up Vercel

- Import GitHub repo to Vercel
- Add environment variables (see `ENV-TEMPLATE.md`)
- Copy Vercel Token, Org ID, Project ID

### 4. Configure GitHub Secrets

Go to GitHub repo → Settings → Secrets → Actions:

```
DATABASE_URL_STAGING=<neon_staging_url>
DATABASE_URL_PRODUCTION=<neon_production_url>
VERCEL_TOKEN=<vercel_token>
VERCEL_ORG_ID=<vercel_org_id>
VERCEL_PROJECT_ID=<vercel_project_id>
```

### 5. Create Branches

```bash
git checkout -b staging
git push -u origin staging

git checkout -b main
git push -u origin main
```

### 6. Install & Run Initial Migration

```bash
# Install dependencies
pnpm install

# Generate migration files
pnpm db:generate

# Apply to staging
pnpm db:migrate:staging

# Apply to production
pnpm db:migrate:production
```

## ✅ Done!

Now when you push to:
- `staging` branch → Auto-migrates & deploys to staging
- `main` branch → Auto-migrates & deploys to production

## 📝 Daily Workflow

1. Make schema changes in `src/lib/db/schema.ts`
2. Run `pnpm db:generate`
3. Commit and push to `staging`
4. Test on staging
5. Merge to `main` for production

## 🔧 Useful Commands

```bash
# Generate migration
pnpm db:generate

# Apply to staging
pnpm db:migrate:staging

# Apply to production
pnpm db:migrate:production

# Check migration status
NODE_ENV=staging tsx scripts/check-migrations.ts
NODE_ENV=production tsx scripts/check-migrations.ts

# Open database GUI
pnpm db:studio
```

## 📚 Need More Details?

See `DEPLOYMENT-SETUP.md` for comprehensive documentation.
