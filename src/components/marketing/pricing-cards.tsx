"use client";

import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { siteConfig } from "@/config/site";
import { pricingPlans, type PlanKey } from "@/config/pricing";
import { useProductPrices } from "@/hooks/use-product-prices";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Crown, Figma, Sparkles } from "lucide-react";

const planIcons: Record<string, React.ReactNode> = {
  basic: <Figma className="size-5" />,
  pro: <Sparkles className="size-5" />,
  premium: <Crown className="size-5" />,
};

function formatPrice(
  price: number | { monthly: number; yearly?: number },
  currency: "USD" | "INR",
  isOneTime: boolean
) {
  const symbol = currency === "USD" ? "$" : "\u20B9";
  if (typeof price === "number") {
    return {
      display: `${symbol}${price}`,
      period: isOneTime ? "one-time" : "/mo",
    };
  }
  return {
    display: `${symbol}${price.monthly}`,
    period: "/mo",
    yearly: price.yearly ? `${symbol}${price.yearly}/yr` : undefined,
  };
}

export function PricingCards() {
  const { currency, setCurrency } = useUIStore();
  const livePrices = useProductPrices();

  const planEntries = Object.entries(pricingPlans) as [
    PlanKey,
    (typeof pricingPlans)[PlanKey],
  ][];

  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">400+ templates.</span> One price.
            <br className="hidden sm:block" /> Every framework.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Pay once, own it forever. No subscriptions, no renewals, no hidden
            fees.
          </p>

          {/* Currency toggle */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-lg border bg-muted/50 p-1">
            <button
              onClick={() => setCurrency("USD")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                currency === "USD"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency("INR")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                currency === "INR"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              INR ({"\u20B9"})
            </button>
          </div>
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-3">
          {planEntries.map(([key, plan]) => {
            const isPopular = "popular" in plan && plan.popular;
            const isBestValue = "bestValue" in plan && plan.bestValue;
            // Admin-managed DB price wins; static config is the fallback
            const priceOf = (k: PlanKey) => {
              const cfg = pricingPlans[k];
              const l = livePrices[cfg.productId];
              if (l) return currency === "USD" ? l.usd : l.inr;
              return currency === "USD" ? cfg.priceUSD : cfg.priceINR;
            };
            const rawPrice = priceOf(key);
            const priceInfo = formatPrice(rawPrice, currency, plan.isOneTime);
            const symbol = currency === "USD" ? "$" : "\u20B9";
            const proDelta = priceOf("premium") - priceOf("pro");
            const anchor =
              currency === "USD"
                ? "anchorUSD" in plan
                  ? plan.anchorUSD
                  : undefined
                : "anchorINR" in plan
                  ? plan.anchorINR
                  : undefined;
            const savePct =
              anchor && typeof rawPrice === "number" && anchor > rawPrice
                ? Math.round((1 - rawPrice / anchor) * 100)
                : null;
            const ctaLabel =
              "ctaLabel" in plan ? plan.ctaLabel : "Get Started";

            return (
              <Card
                key={key}
                className={cn(
                  "relative flex flex-col transition-all duration-300",
                  isPopular && "ring-1 ring-purple-500/40",
                  isBestValue &&
                    "z-10 bg-gradient-to-b from-amber-500/[0.06] to-transparent ring-2 ring-amber-500/60 shadow-xl shadow-amber-500/15 md:scale-[1.05]"
                )}
              >
                {isPopular && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 border border-purple-500/30 bg-background text-purple-500"
                  >
                    Popular
                  </Badge>
                )}
                {isBestValue && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1 border-0 bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-white shadow-md">
                    <Crown className="size-3" />
                    Best Value
                  </Badge>
                )}

                <CardHeader>
                  <div
                    className={cn(
                      "mb-1 flex size-9 items-center justify-center rounded-lg",
                      isBestValue
                        ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {planIcons[key]}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={cn(
                          "text-4xl font-bold tracking-tight",
                          isBestValue &&
                            "bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"
                        )}
                      >
                        {priceInfo.display}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {priceInfo.period}
                      </span>
                      {anchor && (
                        <span className="text-base font-medium text-muted-foreground/60 line-through">
                          {symbol}
                          {anchor}
                        </span>
                      )}
                    </div>
                    {savePct && (
                      <Badge className="mt-2 border-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Save {savePct}%
                      </Badge>
                    )}
                    {isBestValue && proDelta > 0 && (
                      <p className="mt-1.5 text-sm font-medium text-amber-600 dark:text-amber-400">
                        The entire library — only {symbol}
                        {proDelta} more than Pro
                      </p>
                    )}
                  </div>

                  <ul className="flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check
                          className={cn(
                            "mt-0.5 size-4 shrink-0",
                            isBestValue ? "text-amber-500" : "text-green-500"
                          )}
                        />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    asChild
                    variant={isBestValue || isPopular ? "default" : "outline"}
                    size="lg"
                    className={cn(
                      "w-full",
                      isBestValue &&
                        "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600"
                    )}
                  >
                    <a
                      href={
                        'productId' in plan && plan.productId
                          ? `${siteConfig.appUrl}/upgrade?product=${plan.productId}`
                          : `${siteConfig.appUrl}/signup`
                      }
                    >
                      {ctaLabel}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
          400+ templates today, new ones added every week. One payment —
          every framework, every update.
        </p>
      </div>
    </section>
  );
}
