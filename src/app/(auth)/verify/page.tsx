import type { Metadata } from 'next';
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
      <VerifyContent />
    </AuthCard>
  );
}
