import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, accounts } from '@/lib/db/schema';
import { hashPassword } from 'better-auth/crypto';

/**
 * Creates (or resets) the admin account in the env-selected database.
 * This is the ONLY way admins are provisioned — there is no admin-creation
 * surface in the deployed app.
 *
 *   pnpm admin:create              → local/staging DB (DATABASE_URL)
 *   pnpm admin:create:production   → production DB (DATABASE_URL_PRODUCTION)
 *
 * Credentials come from .env.local: ADMIN_EMAIL + ADMIN_PASSWORD_STAGING /
 * ADMIN_PASSWORD_PRODUCTION (ADMIN_PASSWORD overrides both if set).
 */

const env = (process.env.NODE_ENV as string) || 'development';

const databaseUrl =
  env === 'production'
    ? process.env.DATABASE_URL_PRODUCTION
    : env === 'staging'
      ? process.env.DATABASE_URL_STAGING
      : process.env.DATABASE_URL;

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword =
  process.env.ADMIN_PASSWORD ||
  (env === 'production'
    ? process.env.ADMIN_PASSWORD_PRODUCTION
    : process.env.ADMIN_PASSWORD_STAGING);

async function createAdmin() {
  if (!databaseUrl) throw new Error(`No database URL configured for env "${env}"`);
  if (!adminEmail || !adminPassword) {
    throw new Error(
      'Set ADMIN_EMAIL and ADMIN_PASSWORD_STAGING / ADMIN_PASSWORD_PRODUCTION in .env.local'
    );
  }
  if (adminPassword.length < 12) throw new Error('Admin password must be at least 12 characters');

  const db = drizzle(neon(databaseUrl));

  console.log(`Creating admin account in ${env} database...`);

  // better-auth verifies credentials with its own scrypt format — must use
  // its hasher, not bcrypt, or login will always fail
  const hashedPassword = await hashPassword(adminPassword);

  const [adminUser] = await db
    .insert(users)
    .values({
      email: adminEmail,
      name: 'Admin',
      role: 'admin',
      credits: 10000,
      emailVerified: true,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        role: 'admin',
        emailVerified: true,
        updatedAt: new Date(),
      },
    })
    .returning();

  await db
    .insert(accounts)
    .values({
      userId: adminUser.id,
      accountId: adminEmail,
      providerId: 'credential',
      password: hashedPassword,
    })
    .onConflictDoUpdate({
      target: [accounts.providerId, accounts.accountId],
      set: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

  console.log(`✅ Admin ready in ${env}: ${adminEmail} (password from .env.local)`);
}

createAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error creating admin:', error);
    process.exit(1);
  });
