import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/lib/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const auth = betterAuth({
  baseURL: 'http://localhost:3000',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: { enabled: true },
});

async function test() {
  try {
    const result = await auth.api.signUpEmail({
      body: { email: 'admin@promtify.dev', password: 'Admin@123', name: 'Mubashir Ahmed' },
    });
    console.log('SUCCESS:', JSON.stringify(result, null, 2));
  } catch (error: unknown) {
    const err = error as Error;
    console.log('ERROR:', err.message);
    console.log('STACK:', err.stack);
    if (err.cause) console.log('CAUSE:', err.cause);
  }
  process.exit(0);
}

test();
