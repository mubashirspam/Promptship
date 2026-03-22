'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, CheckCircle } from 'lucide-react';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  className?: string;
  callbackURL?: string;
}

export function LoginForm({ className, callbackURL = '/dashboard' }: LoginFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    try {
      await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch {
      // Error is handled by better-auth client
    }
  }

  if (isSuccess) {
    return (
      <div className={cn('flex flex-col items-center gap-3 py-4', className)}>
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="size-6 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-medium">Check your email</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a magic link to{' '}
            <span className="font-medium text-foreground">
              {submittedEmail}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <GoogleSignInButton callbackURL={callbackURL} />

      <div className="relative flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground uppercase">or</span>
        <Separator className="flex-1" />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-9"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
          {isSubmitting ? 'Sending...' : 'Send Magic Link'}
        </Button>
      </form>
    </div>
  );
}
