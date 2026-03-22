'use client';

import { useSearchParams } from 'next/navigation';
import { MagicLinkForm } from '@/components/auth/magic-link-form';

export function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const handleResend = async () => {
    if (!email) return;
    await fetch('/api/auth/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  };

  return <MagicLinkForm email={email} onResend={handleResend} />;
}
