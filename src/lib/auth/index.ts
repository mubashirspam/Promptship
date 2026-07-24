import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, twoFactor } from 'better-auth/plugins';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { resolveDatabaseUrl } from '@/lib/db';
import {
  users,
  sessions,
  accounts,
  verifications,
  twoFactors,
} from '@/lib/db/schema';

const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lvh.me:3000';
// A port in the root domain means local dev over http; real domains are https
const protocol = rootDomain.includes(':') ? 'http' : 'https';
// Leading dot shares the session cookie across app./admin. in every environment
const cookieDomain = '.' + rootDomain.split(':')[0];

// Dedicated db instance for auth to avoid lazy-init issues.
// Uses the same per-environment resolver as the main db so auth data
// (users/sessions) always lives in the same database as everything else.
const sql = neon(resolveDatabaseUrl()!);
const authDb = drizzle(sql);

export const auth = betterAuth({
  appName: 'Promtify',
  baseURL: process.env.BETTER_AUTH_URL || `${protocol}://app.${rootDomain}`,
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
      twoFactor: twoFactors,
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
  rateLimit: {
    enabled: true,
    window: 60,
    max: 60,
    customRules: {
      '/sign-in/email': { window: 60, max: 5 },
      '/sign-up/email': { window: 60, max: 5 },
    },
  },
  advanced: {
    cookiePrefix: 'ps',
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: protocol === 'https',
      domain: cookieDomain,
    },
  },
  user: {
    additionalFields: {
      // input: false — these are set only server-side (scripts, webhooks,
      // admin APIs) and must never be accepted from signup/update requests
      role: {
        type: 'string',
        defaultValue: 'user',
        input: false,
      },
      credits: {
        type: 'number',
        defaultValue: 0,
        input: false,
      },
    },
  },
  plugins: [
    admin(),
    // CLI enrollment (pnpm admin:2fa) — activate immediately on enable
    twoFactor({ skipVerificationOnEnable: true }),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
