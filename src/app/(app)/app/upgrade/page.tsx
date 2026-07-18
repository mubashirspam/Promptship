'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, Crown, Figma, Sparkles, GraduationCap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { pricingPlans, coursesAddon, type PlanKey } from '@/config/pricing';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui-store';
import { useProductPrices } from '@/hooks/use-product-prices';

const planIcons: Record<PlanKey, React.ReactNode> = {
  basic: <Figma className="size-5" />,
  pro: <Sparkles className="size-5" />,
  premium: <Crown className="size-5" />,
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function UpgradeContent() {
  const searchParams = useSearchParams();
  const { currency, setCurrency } = useUIStore();
  const [busyProduct, setBusyProduct] = useState<string | null>(null);
  const livePrices = useProductPrices();

  function priceFor(productId: string, fallbackUsd: number, fallbackInr: number) {
    const live = livePrices[productId];
    if (!live) return currency === 'USD' ? fallbackUsd : fallbackInr;
    return currency === 'USD' ? live.usd : live.inr;
  }

  const highlighted = searchParams.get('product');

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      toast.success('Payment received! Your access is being activated…');
    } else if (status === 'cancelled') {
      toast.info('Checkout cancelled.');
    }
  }, [searchParams]);

  async function buy(productId: string) {
    setBusyProduct(productId);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, currency }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.error?.message ?? 'Checkout failed');
        return;
      }

      if (json.data.provider === 'stripe') {
        window.location.href = json.data.url;
        return;
      }

      // Razorpay: open the client widget for the created order
      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) {
        toast.error('Could not load Razorpay — try USD checkout instead');
        return;
      }
      new window.Razorpay({
        key: json.data.keyId,
        order_id: json.data.orderId,
        amount: json.data.amount,
        currency: 'INR',
        name: 'Promtify',
        handler: () => {
          toast.success('Payment received! Your access is being activated…');
          setTimeout(() => window.location.replace('/dashboard'), 1500);
        },
      }).open();
    } catch {
      toast.error('Checkout failed — please try again');
    } finally {
      setBusyProduct(null);
    }
  }

  const symbol = currency === 'USD' ? '$' : '₹';

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Choose your plan</h1>
        <p className="mx-auto max-w-lg text-muted-foreground">
          One-time purchase, lifetime access. Courses available as an add-on.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-lg border bg-muted/50 p-1">
          {(['USD', 'INR'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                currency === c
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {c === 'USD' ? 'USD ($)' : 'INR (₹)'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {(Object.keys(pricingPlans) as PlanKey[]).map((key) => {
          const plan = pricingPlans[key];
          const isPopular = 'popular' in plan && plan.popular;
          const isBestValue = 'bestValue' in plan && plan.bestValue;
          const isHighlighted = highlighted === plan.productId;
          const price = priceFor(plan.productId, plan.priceUSD, plan.priceINR);

          return (
            <Card
              key={key}
              className={cn(
                'relative flex flex-col',
                (isPopular || isHighlighted) && 'ring-1 ring-purple-500/50',
                isBestValue && 'ring-2 ring-amber-500/60 shadow-lg shadow-amber-500/10 md:scale-[1.03]'
              )}
            >
              {isPopular && !isBestValue && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="border-0 bg-gradient-to-r from-purple-600 to-violet-600 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}
              {isBestValue && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1 border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Crown className="size-3" />
                    Best Value
                  </Badge>
                </div>
              )}

              <CardHeader>
                <div className="mb-1 text-primary">{planIcons[key]}</div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    {symbol}
                    {price}
                  </span>
                  <span className="text-sm text-muted-foreground">one-time</span>
                </div>
                <ul className="flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-green-500" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={cn(
                    'w-full',
                    isBestValue &&
                      'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                  )}
                  variant={isPopular || isBestValue ? 'default' : 'outline'}
                  disabled={busyProduct !== null}
                  onClick={() => buy(plan.productId)}
                >
                  {busyProduct === plan.productId ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    plan.ctaLabel
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Courses add-on */}
      <Card className={cn(highlighted === coursesAddon.productId && 'ring-2 ring-purple-500')}>
        <CardContent className="flex flex-col items-start justify-between gap-4 py-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 text-white">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <p className="font-semibold">{coursesAddon.name}</p>
              <p className="text-sm text-muted-foreground">{coursesAddon.description}</p>
            </div>
          </div>
          <Button
            variant="outline"
            disabled={busyProduct !== null}
            onClick={() => buy(coursesAddon.productId)}
          >
            {busyProduct === coursesAddon.productId ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              `Add for ${symbol}${priceFor(coursesAddon.productId, coursesAddon.priceUSD, coursesAddon.priceINR)}`
            )}
          </Button>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Single templates can also be bought individually from the library. AI
        generation and the creator marketplace are coming in the next launch.
      </p>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <UpgradeContent />
    </Suspense>
  );
}
