import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthCard } from '@/components/auth/auth-card';
import { VerifyContent } from './verify-content';

export const metadata: Metadata = {
  title: 'Check Your Email',
};

export default function VerifyPage() {
  return (
    <AuthCard
      title="Check your email"
      description="We sent you a magic link to sign in"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyContent />
      </Suspense>
    </AuthCard>
  );
}
