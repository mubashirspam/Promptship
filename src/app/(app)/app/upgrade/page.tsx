'use client';

import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { pricingPlans, type PlanKey } from '@/config/pricing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, Sparkles, Zap, Users } from 'lucide-react';
import { toast } from 'sonner';

const PLAN_ICONS: Record<PlanKey, React.ReactNode> = {
  starter: <Zap className="size-5" />,
  pro: <Sparkles className="size-5" />,
  team: <Users className="size-5" />,
};

const PLAN_GRADIENTS: Record<PlanKey, string> = {
  starter: 'from-cyan-600 to-blue-600',
  pro: 'from-purple-600 to-violet-600',
  team: 'from-pink-600 to-rose-600',
};

function getPriceDisplay(plan: (typeof pricingPlans)[PlanKey], currency: 'USD' | 'INR' = 'USD') {
  if (plan.isOneTime) {
    const price = currency === 'USD' ? plan.priceUSD : plan.priceINR;
    const symbol = currency === 'USD' ? '$' : '\u20B9';
    return { amount: `${symbol}${price}`, period: 'one-time' };
  }

  const priceObj = currency === 'USD' ? plan.priceUSD : plan.priceINR;
  if (typeof priceObj === 'object' && priceObj !== null && 'monthly' in priceObj) {
    const symbol = currency === 'USD' ? '$' : '\u20B9';
    return { amount: `${symbol}${priceObj.monthly}`, period: '/mo' };
  }

  return { amount: '', period: '' };
}

export default function UpgradePage() {
  const { user } = useAuth();
  const currentTier = ((user as Record<string, unknown>)?.tier as string) ?? 'free';

  const handleUpgrade = (planKey: PlanKey) => {
    toast.success(`Redirecting to checkout for ${pricingPlans[planKey].name} plan...`);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Upgrade Your Plan</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Unlock the full potential of Promtify. Choose the plan that fits your needs.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(Object.keys(pricingPlans) as PlanKey[]).map((key) => {
          const plan = pricingPlans[key];
          const { amount, period } = getPriceDisplay(plan);
          const isPopular = 'popular' in plan && plan.popular;
          const isCurrent = currentTier === key;

          return (
            <Card
              key={key}
              className={cn(
                'relative flex flex-col',
                isPopular && 'ring-2 ring-purple-500'
              )}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-violet-600 text-white border-0">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div
                  className={cn(
                    'mx-auto flex size-12 items-center justify-center rounded-xl bg-gradient-to-br text-white mb-2',
                    PLAN_GRADIENTS[key]
                  )}
                >
                  {PLAN_ICONS[key]}
                </div>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col">
                {/* Price */}
                <div className="text-center mb-5">
                  <span className="text-3xl font-bold">{amount}</span>
                  <span className="text-sm text-muted-foreground ml-1">{period}</span>
                </div>

                <Separator className="mb-5" />

                {/* Features */}
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="size-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  onClick={() => handleUpgrade(key)}
                  disabled={isCurrent}
                  className={cn(
                    'w-full mt-6',
                    isPopular &&
                      'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 border-0'
                  )}
                  variant={isPopular ? 'default' : 'outline'}
                >
                  {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground">
        All plans include access to the prompt library. Prices shown in USD.
        Cancel or change your plan anytime.
      </p>
    </div>
  );
}
