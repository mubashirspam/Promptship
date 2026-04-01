import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users, accounts } from '@/lib/db/schema';
import * as bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

/**
 * Setup endpoint to create admin account
 * This should only be run once in staging/production
 * Protect this endpoint or remove it after setup
 */
export async function POST(req: NextRequest) {
  // Simple protection - check for setup key
  const setupKey = req.headers.get('x-setup-key');
  if (setupKey !== process.env.ADMIN_SETUP_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create or update admin user
    const [adminUser] = await db
      .insert(users)
      .values({
        email,
        name,
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

    // Create or update admin account credentials
    await db
      .insert(accounts)
      .values({
        userId: adminUser.id,
        accountId: email,
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

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin account' },
      { status: 500 }
    );
  }
}
