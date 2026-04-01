import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, accounts } from '@/lib/db/schema';
import * as bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function createAdmin() {
  const adminEmail = 'admin@promptship.dev';
  const adminPassword = 'Admin@123'; // Change this after first login
  const adminName = 'Admin User';

  console.log('Creating admin account...');

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create or update admin user
  const [adminUser] = await db
    .insert(users)
    .values({
      email: adminEmail,
      name: adminName,
      role: 'admin',
      tier: 'pro',
      credits: 10000,
      emailVerified: true,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        role: 'admin',
        tier: 'pro',
        credits: 10000,
        emailVerified: true,
        updatedAt: new Date(),
      },
    })
    .returning();

  console.log('Admin user created:', adminUser);

  // Create or update admin account credentials
  const [adminAccount] = await db
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
    })
    .returning();

  console.log('Admin account created:', adminAccount);
  console.log('\n✅ Admin account ready!');
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log('\n⚠️  Please change the password after first login!');
}

createAdmin()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error creating admin:', error);
    process.exit(1);
  });
