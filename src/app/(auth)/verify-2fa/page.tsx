'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { authClient } from '@/lib/auth/client';
import { getRedirectUrl } from '@/lib/auth/redirect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function VerifyTwoFactorPage() {
  const [code, setCode] = useState('');
  const [useBackup, setUseBackup] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = useBackup
        ? await authClient.twoFactor.verifyBackupCode({ code })
        : await authClient.twoFactor.verifyTotp({ code });

      if (result.error) {
        setError(result.error.message || 'Invalid code — try again');
        return;
      }

      const user = result.data?.user as { role?: string } | undefined;
      window.location.replace(getRedirectUrl(user ?? {}));
    } catch {
      setError('Unable to verify. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <ShieldCheck className="size-8 text-primary" />
        <h1 className="text-xl font-semibold">Two-factor verification</h1>
        <p className="text-sm text-muted-foreground">
          {useBackup
            ? 'Enter one of your backup codes'
            : 'Enter the 6-digit code from your authenticator app'}
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="totp-code">{useBackup ? 'Backup code' : 'Code'}</Label>
          <Input
            id="totp-code"
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            inputMode={useBackup ? 'text' : 'numeric'}
            autoComplete="one-time-code"
            placeholder={useBackup ? 'xxxxx-xxxxx' : '123456'}
            autoFocus
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={submitting || code.length < 6}>
          {submitting ? 'Verifying…' : 'Verify'}
        </Button>

        <button
          type="button"
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => {
            setUseBackup((v) => !v);
            setCode('');
            setError('');
          }}
        >
          {useBackup ? 'Use authenticator code instead' : 'Use a backup code'}
        </button>
      </form>
    </div>
  );
}
