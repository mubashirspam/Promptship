# Staging & Production Deployment Setup Guide

This guide provides complete instructions for setting up staging and production environments with seamless database migrations.

## 🏗️ Architecture Overview

- **Staging Branch**: `staging` → Staging Neon DB → Vercel Staging Environment
- **Production Branch**: `main` → Production Neon DB → Vercel Production Environment
- **Database Migrations**: Automated via GitHub Actions on every push

---

## 📋 Prerequisites

- Neon account with 2 projects (or 2 branches in one project)
- Vercel account
- GitHub repository
- Google Cloud Console (for OAuth)

---

## 🗄️ Step 1: Neon Database Setup

### Option A: Two Separate Projects (Recommended)

1. **Create Staging Project**
   - Go to [Neon Console](https://console.neon.tech/)
   - Click "New Project"
   - Name: `promptship-staging`
   - Region: Choose closest to your users
   - Copy the connection string → Save as `DATABASE_URL_STAGING`

2. **Create Production Project**
   - Click "New Project" again
   - Name: `promptship-production`
   - Same region as staging
   - Copy the connection string → Save as `DATABASE_URL_PRODUCTION`

### Option B: Two Branches in One Project

1. **Create Main Branch** (Production)
   - Go to your Neon project
   - Main branch is created by default
   - Copy connection string → Save as `DATABASE_URL_PRODUCTION`

2. **Create Staging Branch**
   - Click "Branches" → "New Branch"
   - Name: `staging`
   - Copy connection string → Save as `DATABASE_URL_STAGING`

---

## 🔐 Step 2: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen if not done
6. Application type: **Web application**
7. Add Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-staging-domain.vercel.app/api/auth/callback/google
   https://your-production-domain.com/api/auth/callback/google
   ```
8. Copy **Client ID** and **Client Secret**

---

## ☁️ Step 3: Vercel Setup

### 3.1 Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Do not deploy yet** - we need to configure environments first

### 3.2 Configure Environment Variables

#### **Staging Environment**

1. Go to Project Settings → Environment Variables
2. Add these variables for **Preview** environment:

```env
DATABASE_URL=<your_staging_database_url>
DATABASE_URL_STAGING=<your_staging_database_url>

BETTER_AUTH_SECRET=<generate_with_openssl_rand_base64_32>
BETTER_AUTH_URL=https://your-staging-domain.vercel.app

GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>

BLOB_READ_WRITE_TOKEN=<vercel_blob_token>

# Optional
RESEND_API_KEY=<your_resend_api_key>
FROM_EMAIL=noreply@yourdomain.com
UPSTASH_REDIS_REST_URL=<your_redis_url>
UPSTASH_REDIS_REST_TOKEN=<your_redis_token>
```

#### **Production Environment**

1. Add these variables for **Production** environment:

```env
DATABASE_URL=<your_production_database_url>
DATABASE_URL_PRODUCTION=<your_production_database_url>

BETTER_AUTH_SECRET=<generate_different_secret_for_production>
BETTER_AUTH_URL=https://your-production-domain.com

GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>

BLOB_READ_WRITE_TOKEN=<vercel_blob_token>

# Optional
RESEND_API_KEY=<your_resend_api_key>
FROM_EMAIL=noreply@yourdomain.com
UPSTASH_REDIS_REST_URL=<your_redis_url>
UPSTASH_REDIS_REST_TOKEN=<your_redis_token>
```

### 3.3 Get Vercel Tokens for GitHub Actions

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Create a new token → Copy it
3. Go to your Vercel project settings
4. Copy **Project ID** and **Org ID** from Settings → General

---

## 🔧 Step 4: GitHub Repository Setup

### 4.1 Create Branches

```bash
# Create staging branch
git checkout -b staging
git push -u origin staging

# Create main branch (if not exists)
git checkout -b main
git push -u origin main
```

### 4.2 Configure GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these **Repository Secrets**:

```
DATABASE_URL_STAGING=<neon_staging_connection_string>
DATABASE_URL_PRODUCTION=<neon_production_connection_string>

VERCEL_TOKEN=<vercel_token_from_step_3.3>
VERCEL_ORG_ID=<vercel_org_id>
VERCEL_PROJECT_ID=<vercel_project_id>
```

### 4.3 Branch Protection Rules (Optional but Recommended)

1. Go to Settings → Branches → Add rule
2. For `main` branch:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
3. For `staging` branch:
   - ✅ Require status checks to pass

---

## 🚀 Step 5: Initial Database Setup

### 5.1 Install Dependencies

```bash
pnpm install
```

### 5.2 Create Local Environment File

Create `.env.local`:

```env
DATABASE_URL=<your_local_or_staging_database_url>
DATABASE_URL_STAGING=<your_staging_database_url>
DATABASE_URL_PRODUCTION=<your_production_database_url>

BETTER_AUTH_SECRET=<generate_with_openssl_rand_base64_32>
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>

BLOB_READ_WRITE_TOKEN=<vercel_blob_token>
```

### 5.3 Generate Initial Migration

```bash
# Generate migration files from your schema
pnpm db:generate
```

This creates migration files in `src/lib/db/migrations/`

### 5.4 Apply Migrations to Staging

```bash
# Apply to staging database
pnpm db:migrate:staging
```

### 5.5 Apply Migrations to Production

```bash
# Apply to production database
pnpm db:migrate:production
```

---

## 🔄 Step 6: Workflow - How It Works

### Making Schema Changes

1. **Update Schema** (`src/lib/db/schema.ts`)
   ```typescript
   // Example: Add new column
   export const users = pgTable('users', {
     // ... existing fields
     newField: varchar('new_field', { length: 255 }),
   });
   ```

2. **Generate Migration**
   ```bash
   pnpm db:generate
   ```
   This creates a new migration file in `src/lib/db/migrations/`

3. **Test Locally** (Optional)
   ```bash
   # Apply to your local/dev database
   pnpm db:migrate
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new field to users table"
   ```

5. **Push to Staging**
   ```bash
   git checkout staging
   git merge your-feature-branch
   git push origin staging
   ```
   
   **What happens automatically:**
   - ✅ GitHub Actions triggers
   - ✅ Runs `pnpm db:migrate:staging`
   - ✅ Deploys to Vercel staging environment
   - ✅ Migration is applied to staging database

6. **Test on Staging**
   - Visit your staging URL
   - Test the new feature
   - Verify database changes

7. **Deploy to Production**
   ```bash
   git checkout main
   git merge staging
   git push origin main
   ```
   
   **What happens automatically:**
   - ✅ GitHub Actions triggers
   - ✅ Runs `pnpm db:migrate:production`
   - ✅ Deploys to Vercel production environment
   - ✅ Migration is applied to production database

---

## 🛠️ Available Commands

### Database Commands

```bash
# Generate migration from schema changes
pnpm db:generate

# Apply migrations (uses DATABASE_URL)
pnpm db:migrate

# Apply migrations to staging
pnpm db:migrate:staging

# Apply migrations to production
pnpm db:migrate:production

# Push schema directly (no migration files) - for development only
pnpm db:push
pnpm db:push:staging
pnpm db:push:production

# Open Drizzle Studio (database GUI)
pnpm db:studio

# Drop migration (careful!)
pnpm db:drop
```

### Check Migration Status

```bash
# Check what migrations are applied
NODE_ENV=staging tsx scripts/check-migrations.ts
NODE_ENV=production tsx scripts/check-migrations.ts
```

---

## 🔍 Troubleshooting

### Migration Failed on GitHub Actions

1. Check GitHub Actions logs
2. Verify database connection string in GitHub Secrets
3. Ensure database is accessible (not behind firewall)
4. Check migration SQL for syntax errors

### Migration Works Locally but Fails in CI/CD

1. Ensure `tsx` is installed: `pnpm add -D tsx`
2. Check that migration files are committed to git
3. Verify environment variables are set correctly

### Database Schema Out of Sync

```bash
# Check current migrations
NODE_ENV=staging tsx scripts/check-migrations.ts

# If needed, regenerate and apply
pnpm db:generate
pnpm db:migrate:staging
```

### Rollback a Migration

Drizzle doesn't support automatic rollbacks. To rollback:

1. **Option A**: Create a new migration that reverses changes
   ```bash
   # Manually edit schema to previous state
   pnpm db:generate
   pnpm db:migrate:staging
   ```

2. **Option B**: Use Neon's point-in-time restore
   - Go to Neon Console
   - Select your project/branch
   - Use "Restore" feature to go back in time

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - it's gitignored
2. **Use different secrets** for staging and production
3. **Rotate secrets regularly** (every 90 days)
4. **Use Vercel's environment variables** - never hardcode
5. **Enable branch protection** on `main` branch
6. **Review migrations** before merging to production

---

## 📊 Monitoring

### Check Database Health

```bash
# Staging
NODE_ENV=staging tsx scripts/check-migrations.ts

# Production
NODE_ENV=production tsx scripts/check-migrations.ts
```

### Vercel Deployment Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click on a deployment
4. View logs for build and runtime errors

### Neon Database Metrics

1. Go to Neon Console
2. Select your project
3. View "Monitoring" tab for:
   - Connection count
   - Query performance
   - Storage usage

---

## 🎯 Quick Reference

### Environment URLs

- **Local**: `http://localhost:3000`
- **Staging**: `https://your-app-staging.vercel.app`
- **Production**: `https://your-app.com`

### Git Workflow

```bash
# Feature development
git checkout -b feature/new-feature
# ... make changes ...
git commit -m "feat: add new feature"

# Deploy to staging
git checkout staging
git merge feature/new-feature
git push origin staging
# Wait for GitHub Actions to complete

# Deploy to production
git checkout main
git merge staging
git push origin main
# Wait for GitHub Actions to complete
```

### Emergency Rollback

```bash
# Revert last commit on production
git checkout main
git revert HEAD
git push origin main

# Or reset to previous commit (dangerous!)
git reset --hard HEAD~1
git push origin main --force
```

---

## ✅ Checklist

Before going live, ensure:

- [ ] Neon staging database created and accessible
- [ ] Neon production database created and accessible
- [ ] Google OAuth configured with all redirect URIs
- [ ] Vercel project created and connected to GitHub
- [ ] All environment variables set in Vercel (staging + production)
- [ ] GitHub secrets configured (DATABASE_URL_STAGING, DATABASE_URL_PRODUCTION, VERCEL_TOKEN, etc.)
- [ ] Initial migrations applied to both databases
- [ ] GitHub Actions workflows tested on staging
- [ ] Staging deployment successful and tested
- [ ] Production deployment successful
- [ ] Google OAuth working on all environments
- [ ] Database connections working on all environments

---

## 🆘 Support

If you encounter issues:

1. Check this documentation first
2. Review GitHub Actions logs
3. Check Vercel deployment logs
4. Verify Neon database connectivity
5. Ensure all environment variables are set correctly

---

## 📝 Notes

- **MCP Integration**: Once MCP is connected, it will handle database operations through the Neon connection strings you've configured
- **Automatic Migrations**: Every push to `staging` or `main` automatically runs migrations before deployment
- **Zero Downtime**: Migrations are designed to run before the new code is deployed
- **Rollback Strategy**: Always test on staging first; use Neon's point-in-time restore for emergencies
