'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import {
  signInSchema,
  type SignInInput,
} from '@/lib/validations/auth';
import { authClient } from '@/lib/auth/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SocialButtons } from '@/components/auth/social-buttons';
import { getRedirectUrl } from '@/lib/auth/redirect';

export function AuthForm() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="w-full max-w-[420px]">
      {!showAdminLogin ? (
        <>
          {/* Regular user login */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Welcome to PromptShip</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in with your Google or GitHub account to get started
            </p>
          </div>

          {/* Social buttons for regular users */}
          <SocialButtons />

          {/* Admin login toggle */}
          <div className="mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => setShowAdminLogin(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
            >
              <ShieldCheck className="size-4" />
              Admin Login
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Admin login */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Admin Access</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in with your admin credentials
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Admin email/password form */}
          <AdminSignInForm
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            setError={setError}
          />

          {/* Back to user login */}
          <button
            type="button"
            onClick={() => {
              setShowAdminLogin(false);
              setError('');
            }}
            className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to user login
          </button>
        </>
      )}
    </div>
  );
}

// ─── Admin Sign In Form ────────────────────────────────────────

function AdminSignInForm({
  showPassword,
  setShowPassword,
  setError,
}: {
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  setError: (v: string) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(data: SignInInput) {
    setError('');
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      
      if (result.error) {
        setError(result.error.message || 'Invalid admin credentials');
        return;
      }

      // Verify admin role
      const user = result.data?.user as { role?: string } | undefined;
      if (user?.role !== 'admin') {
        setError('Admin access required');
        await authClient.signOut();
        return;
      }

      // Redirect to admin subdomain
      const redirectUrl = getRedirectUrl(user);
      window.location.replace(redirectUrl);
    } catch {
      setError('Unable to connect. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signin-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signin-email"
            type="email"
            placeholder="you@example.com"
            className="pl-10"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signin-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signin-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="pl-10 pr-10"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" className="mt-2 w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
}

