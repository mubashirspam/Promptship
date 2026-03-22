import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Create Account - PromptShip',
};

export default function SignupPage() {
  return <AuthForm />;
}
