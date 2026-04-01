import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users } from '@/lib/db/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function createTestUser() {
  const testEmail = 'user@promptship.dev';
  const testName = 'Test User';

  console.log('Creating test user account...');

  // Create or update test user
  const [testUser] = await db
    .insert(users)
    .values({
      email: testEmail,
      name: testName,
      role: 'user',
      tier: 'free',
      credits: 50,
      emailVerified: true,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        role: 'user',
        tier: 'free',
        emailVerified: true,
        updatedAt: new Date(),
      },
    })
    .returning();

  console.log('Test user created:', testUser);
  console.log('\n✅ Test user ready!');
  console.log(`Email: ${testEmail}`);
  console.log('This user can login with Google or GitHub OAuth');
}

createTestUser()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error creating test user:', error);
    process.exit(1);
  });
