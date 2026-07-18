/**
 * Enable TOTP two-factor auth for the admin account (or any email/password
 * user) without needing enrollment UI:
 *
 *   pnpm admin:2fa                → staging/local admin
 *   pnpm admin:2fa:production     → production admin
 *
 * Prints the otpauth:// URI (add it to Google Authenticator / 1Password via
 * "enter setup key" using the secret) and one-time backup codes — store them
 * somewhere safe.
 */

const env = (process.env.NODE_ENV as string) || 'development';
const email = process.env.ADMIN_EMAIL;
const password =
  process.env.ADMIN_PASSWORD ||
  (env === 'production'
    ? process.env.ADMIN_PASSWORD_PRODUCTION
    : process.env.ADMIN_PASSWORD_STAGING);

async function main() {
  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and the ADMIN_PASSWORD_* vars in .env.local');
  }

  // The auth instance connects to DATABASE_URL — point it at the right DB
  // before importing
  if (env === 'production' && process.env.DATABASE_URL_PRODUCTION) {
    process.env.DATABASE_URL = process.env.DATABASE_URL_PRODUCTION;
  } else if (env === 'staging' && process.env.DATABASE_URL_STAGING) {
    process.env.DATABASE_URL = process.env.DATABASE_URL_STAGING;
  }
  const { auth } = await import('@/lib/auth');

  // Sign in to get a session cookie for the enable call
  const signIn = await auth.api.signInEmail({
    body: { email, password },
    returnHeaders: true,
  });
  const cookie = signIn.headers.get('set-cookie');
  if (!cookie) throw new Error('Sign-in did not return a session cookie');

  const result = await auth.api.enableTwoFactor({
    body: { password },
    headers: { cookie },
  });

  console.log(`\n✅ 2FA enabled for ${email} (${env})\n`);
  console.log('Add to your authenticator app (otpauth URI):\n');
  console.log(`  ${result.totpURI}\n`);
  const secret = /secret=([^&]+)/.exec(result.totpURI)?.[1];
  if (secret) console.log(`  Manual setup key: ${secret}\n`);
  console.log('Backup codes (one-time use — store safely):\n');
  for (const code of result.backupCodes) console.log(`  ${code}`);
  console.log();
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Failed to enable 2FA:', e);
    process.exit(1);
  });
