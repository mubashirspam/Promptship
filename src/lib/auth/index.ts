import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/lib/db';
import { users, sessions } from '@/lib/db/schema';
import { sendMagicLinkEmail } from '@/lib/email';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: users,
      session: sessions,
    },
  }),
  emailAndPassword: {
    enabled: false,
  },
  magicLink: {
    enabled: true,
    sendMagicLink: async ({ email, url }: { email: string; url: string }) => {
      await sendMagicLinkEmail({ email, url });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
  user: {
    additionalFields: {
      tier: {
        type: 'string',
        defaultValue: 'free',
      },
      credits: {
        type: 'number',
        defaultValue: 0,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
