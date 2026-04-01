import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, sessions, accounts, verifications } from '@/lib/db/schema';

const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
const protocol = rootDomain.includes('localhost') ? 'http' : 'https';

// Dedicated db instance for auth to avoid lazy-init issues
const sql = neon(process.env.DATABASE_URL!);
const authDb = drizzle(sql);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || `${protocol}://${rootDomain}`,
  trustedOrigins: [
    `${protocol}://${rootDomain}`,
    `${protocol}://app.${rootDomain}`,
    `${protocol}://admin.${rootDomain}`,
  ],
  database: drizzleAdapter(authDb, {
    provider: 'pg',
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  advanced: {
    cookiePrefix: 'ps',
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      // Domain must start with . for subdomains to share cookies
      domain: rootDomain.includes('localhost')
        ? undefined // localhost doesn't need domain for subdomains
        : `.${rootDomain}`,
    },
  },
  user: {
    additionalFields: {
      tier: {
        type: 'string',
        defaultValue: 'free',
      },
      role: {
        type: 'string',
        defaultValue: 'user',
      },
      credits: {
        type: 'number',
        defaultValue: 0,
      },
    },
  },
  plugins: [admin()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
