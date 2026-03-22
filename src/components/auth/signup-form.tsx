'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User, CheckCircle } from 'lucide-react';
import { signupSchema, type SignupInput } from '@/lib/validations/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SignupFormProps {
  className?: string;
}

export function SignupForm({ className }: SignupFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupInput) {
    try {
      await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, name: data.name ?? '' }),
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
            We sent a verification link to{' '}
            <span className="font-medium text-foreground">
              {submittedEmail}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('flex flex-col gap-4', className)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">
          Name <span className="text-muted-foreground">(optional)</span>
        </Label>
        <div className="relative">
          <User className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            className="pl-9"
            aria-invalid={!!errors.name}
            {...register('name')}
          />
        </div>
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>
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
        {isSubmitting ? 'Creating...' : 'Create Account'}
      </Button>
    </form>
  );
}
