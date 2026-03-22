# MCP Server Setup with Neon

This guide explains how to connect MCP (Model Context Protocol) with your Neon database projects for seamless database operations.

## 🏗️ Architecture

You have **2 separate Neon projects**:
- **promptship-staging** - For staging/testing environment
- **promptship-production** - For production environment

**Local development** uses the staging database for testing.

---

## 📋 Step 1: Get Neon Connection Strings

### For Staging Project

1. Go to [Neon Console](https://console.neon.tech/)
2. Select **promptship-staging** project
3. Go to "Connection string" section
4. Copy the connection string (looks like: `postgresql://user:password@host/dbname?sslmode=require`)
5. Save as `DATABASE_URL_STAGING`

### For Production Project

1. Select **promptship-production** project
2. Copy the connection string
3. Save as `DATABASE_URL_PRODUCTION`

---

## 🔧 Step 2: Configure Environment Variables

### Local Development (.env.local)

```env
# Use staging database for local development
DATABASE_URL=postgresql://user:password@staging-host/neondb?sslmode=require

# Keep these for reference
DATABASE_URL_STAGING=postgresql://user:password@staging-host/neondb?sslmode=require
DATABASE_URL_PRODUCTION=postgresql://user:password@production-host/neondb?sslmode=require

# ... other variables
```

### Vercel Staging Environment

Go to Vercel Project Settings → Environment Variables → Preview:

```env
DATABASE_URL=postgresql://user:password@staging-host/neondb?sslmode=require
```

### Vercel Production Environment

Go to Vercel Project Settings → Environment Variables → Production:

```env
DATABASE_URL=postgresql://user:password@production-host/neondb?sslmode=require
```

---

## 🔌 Step 3: Connect MCP Server

### What is MCP?

MCP (Model Context Protocol) is a standard that allows AI systems to interact with external tools and services. In your case, it will handle all database operations through Neon.

### How to Connect MCP to Neon

1. **In your IDE/AI tool settings**, look for "MCP Servers" or "Model Context Protocol"
2. **Add a new MCP server** with these details:

   **Server Name**: `neon-staging`
   ```
   Type: Neon Database
   Project ID: [your-staging-project-id]
   Database: neondb
   Connection String: DATABASE_URL_STAGING
   ```

   **Server Name**: `neon-production`
   ```
   Type: Neon Database
   Project ID: [your-production-project-id]
   Database: neondb
   Connection String: DATABASE_URL_PRODUCTION
   ```

3. **Test the connection** - MCP should be able to query your databases

### Finding Your Neon Project IDs

1. Go to [Neon Console](https://console.neon.tech/)
2. Select a project
3. Look at the URL: `https://console.neon.tech/app/projects/[PROJECT_ID]`
4. Copy the `[PROJECT_ID]` part

---

## 💡 Step 4: Using MCP for Database Operations

Once MCP is connected, you can:

### Query Data
```
"Show me all users from the staging database"
```

### Create/Modify Schema
```
"Add a new column 'status' to the users table in production"
```

### Run Migrations
```
"Apply pending migrations to staging database"
```

### Check Database Status
```
"Show me the current schema of the production database"
```

---

## 🔄 Workflow with MCP

### Local Development
1. Make schema changes in `src/lib/db/schema.ts`
2. Run `pnpm db:generate` to create migration
3. Use MCP to test queries on staging database
4. Commit and push to staging branch

### Staging Deployment
1. Push to `staging` branch
2. GitHub Actions runs migrations on staging
3. Use MCP to verify changes on staging database
4. Test the app on staging URL

### Production Deployment
1. Merge staging to `main` branch
2. GitHub Actions runs migrations on production
3. Use MCP to verify changes on production database
4. Monitor production app

---

## 📊 MCP Commands Reference

### Database Inspection
```
"List all tables in the staging database"
"Show schema for users table"
"Get count of records in each table"
```

### Data Operations
```
"Query all active users from production"
"Update user tier for user ID xyz"
"Delete old sessions from staging"
```

### Migration Status
```
"Show applied migrations in staging"
"Check if production database is up to date"
```

### Performance
```
"Show slow queries in production"
"Analyze query performance for..."
"Suggest indexes for..."
```

---

## 🔐 Security Notes

- **Never share** your Neon connection strings publicly
- **Use different credentials** for staging and production
- **Restrict access** to production database
- **Enable IP whitelisting** in Neon if needed
- **Rotate credentials** periodically

---

## 🆘 Troubleshooting

### MCP Can't Connect
1. Verify connection string is correct
2. Check that Neon project is active
3. Ensure IP is whitelisted (if enabled)
4. Test connection in Neon console first

### Wrong Database Selected
1. Verify `DATABASE_URL` points to correct project
2. Check environment variables are set correctly
3. For staging: use `DATABASE_URL_STAGING`
4. For production: use `DATABASE_URL_PRODUCTION`

### Migrations Not Applied
1. Check GitHub Actions logs
2. Verify database connection in Vercel
3. Run `pnpm db:migrate:staging` locally to test
4. Check migration files exist in `src/lib/db/migrations/`

---

## 📝 Summary

| Environment | Database | Connection String | MCP Server |
|-------------|----------|-------------------|-----------|
| Local | Staging | `DATABASE_URL` | `neon-staging` |
| Vercel Staging | Staging | `DATABASE_URL` (Preview) | `neon-staging` |
| Vercel Production | Production | `DATABASE_URL` (Production) | `neon-production` |

Once MCP is connected, all database operations are handled automatically - no need to write SQL code!
