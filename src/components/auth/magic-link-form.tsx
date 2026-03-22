'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MagicLinkFormProps {
  email: string;
  onResend: () => Promise<void>;
  className?: string;
}

const RESEND_COOLDOWN = 60;

export function MagicLinkForm({ email, onResend, className }: MagicLinkFormProps) {
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = useCallback(async () => {
    setIsResending(true);
    try {
      await onResend();
      setCountdown(RESEND_COOLDOWN);
    } finally {
      setIsResending(false);
    }
  }, [onResend]);

  return (
    <div className={cn('flex flex-col items-center gap-4 py-6', className)}>
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
        <Mail className="size-8 text-primary" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-medium">Check your email</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a magic link to
        </p>
        <p className="mt-1 font-medium">{email}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Click the link in the email to sign in. If you don&apos;t see it, check
          your spam folder.
        </p>
      </div>
      <Button
        variant="outline"
        size="lg"
        disabled={countdown > 0 || isResending}
        onClick={handleResend}
        className="mt-2"
      >
        {isResending ? (
          <>
            <RefreshCw className="size-4 animate-spin" />
            Sending...
          </>
        ) : countdown > 0 ? (
          `Resend in ${countdown}s`
        ) : (
          <>
            <RefreshCw className="size-4" />
            Resend magic link
          </>
        )}
      </Button>
    </div>
  );
}
