import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: 'Sign In - PromptShip',
};

export default function LoginPage() {
  return <AuthForm />;
}
