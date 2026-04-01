# Admin Account Setup Guide

This guide explains how to set up the admin account for PromptShip with proper authentication.

## Production-Level Authentication Flow

### Architecture Overview

**Subdomain Routing:**
- `app.yourdomain.com` - Regular users (OAuth with Google/GitHub)
- `admin.yourdomain.com` - Admin only (Email/Password authentication)
- Root domain redirects to appropriate subdomain based on user role

**Authentication Methods:**
- **Regular Users**: Google OAuth, GitHub OAuth only
- **Admin Users**: Email/Password only (for security and control)

### Middleware Protection

The middleware (`middleware.ts`) handles:
1. Session validation using Better Auth
2. Subdomain-based routing
3. Role-based access control
4. Automatic redirects based on user role

## Setup Instructions

### 1. Environment Variables

Add to your `.env.local`:

```bash
# Root domain (without protocol)
NEXT_PUBLIC_ROOT_DOMAIN=yourdomain.com  # or localhost:3000 for local dev

# Better Auth
BETTER_AUTH_URL=https://app.yourdomain.com  # or http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-here

# Database
DATABASE_URL=your-neon-database-url

# OAuth Providers (for regular users)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Admin Setup (one-time use)
ADMIN_SETUP_KEY=your-random-setup-key-here
```

### 2. Create Admin Account

**Option A: Using the Setup API (Recommended)**

1. Generate a random setup key and add it to your environment variables:
   ```bash
   ADMIN_SETUP_KEY=$(openssl rand -base64 32)
   ```

2. Call the setup endpoint:
   ```bash
   curl -X POST https://app.yourdomain.com/api/admin/setup \
     -H "Content-Type: application/json" \
     -H "x-setup-key: your-setup-key-here" \
     -d '{
       "email": "admin@promptship.dev",
       "password": "YourSecurePassword123!",
       "name": "Admin User"
     }'
   ```

3. **Important**: After creating the admin account, delete or disable the setup endpoint by removing `/src/app/api/admin/setup/route.ts`

**Option B: Using the Script**

1. Run the admin creation script:
   ```bash
   pnpm exec tsx scripts/create-admin.ts
   ```

2. The default password is `Admin@123` - **change this immediately after first login**

### 3. Subdomain Configuration

**For Local Development:**

Add to your `/etc/hosts`:
```
127.0.0.1 localhost
127.0.0.1 app.localhost
127.0.0.1 admin.localhost
```

Then access:
- Regular users: `http://app.localhost:3000`
- Admin: `http://admin.localhost:3000`

**For Production (Vercel):**

1. Add custom domains in Vercel:
   - `app.yourdomain.com`
   - `admin.yourdomain.com`

2. Configure DNS:
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com

   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   ```

3. Update environment variables in Vercel with production values

### 4. Testing the Flow

**Regular User Flow:**
1. Visit `app.yourdomain.com/login`
2. Click "Google" or "GitHub" button
3. Complete OAuth flow
4. Redirected to `/dashboard`

**Admin Flow:**
1. Visit `admin.yourdomain.com` (or `app.yourdomain.com/login`)
2. Click "Admin Login" at the bottom
3. Enter email and password
4. Redirected to `admin.yourdomain.com/admin`

**Security Features:**
- Admin subdomain requires authentication + admin role
- Regular users cannot access admin subdomain
- Admin can access both user and admin interfaces
- Sessions are shared across subdomains via cookie domain
- Middleware validates every request

## User Roles

### Admin Role
- **Email**: admin@promptship.dev
- **Access**: Full system access
- **Subdomain**: admin.yourdomain.com
- **Auth Method**: Email/Password only
- **Capabilities**: 
  - Create/edit/delete prompts
  - Manage users
  - View analytics
  - System configuration

### User Role
- **Access**: Standard user features
- **Subdomain**: app.yourdomain.com
- **Auth Method**: Google/GitHub OAuth only
- **Capabilities**:
  - Browse prompts
  - Generate code
  - Save favorites
  - View history

## Security Best Practices

1. **Change Default Password**: Immediately change the admin password after first login
2. **Remove Setup Endpoint**: Delete `/src/app/api/admin/setup/route.ts` after creating admin account
3. **Use Strong Passwords**: Admin password should be 16+ characters with mixed case, numbers, symbols
4. **Enable 2FA**: Consider adding 2FA for admin accounts (future enhancement)
5. **Monitor Access**: Review admin access logs regularly
6. **Rotate Secrets**: Rotate `BETTER_AUTH_SECRET` periodically

## Troubleshooting

### "Not authenticated" on admin subdomain
- Check that admin user exists in database
- Verify session cookie is being set with correct domain
- Check middleware is running (look for console logs)

### OAuth redirect issues
- Verify OAuth callback URLs include both `app.yourdomain.com` and `admin.yourdomain.com`
- Check `BETTER_AUTH_URL` matches your app subdomain
- Ensure `trustedOrigins` in auth config includes both subdomains

### Subdomain not working locally
- Check `/etc/hosts` has entries for `app.localhost` and `admin.localhost`
- Use `http://` not `https://` for localhost
- Clear browser cookies and try again

## Database Schema

The auth system uses these tables:
- `users` - User profiles with role field
- `accounts` - OAuth accounts and password credentials
- `sessions` - Active user sessions
- `verifications` - Email verification tokens

All managed by Better Auth with Drizzle ORM.
