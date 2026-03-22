"use client";

import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { siteConfig } from "@/config/site";
import { pricingPlans, type PlanKey } from "@/config/pricing";
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
import { Check } from "lucide-react";

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

  const planEntries = Object.entries(pricingPlans) as [
    PlanKey,
    (typeof pricingPlans)[PlanKey],
  ][];

  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent{" "}
            <span className="gradient-text">pricing</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start free, upgrade when you&apos;re ready. No hidden fees.
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

        <div className="grid gap-6 md:grid-cols-3">
          {planEntries.map(([key, plan]) => {
            const isPopular = "popular" in plan && plan.popular;
            const rawPrice =
              currency === "USD" ? plan.priceUSD : plan.priceINR;
            const priceInfo = formatPrice(rawPrice, currency, plan.isOneTime);

            return (
              <Card
                key={key}
                className={cn(
                  "relative flex flex-col transition-all duration-300",
                  isPopular &&
                    "ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/10"
                )}
              >
                {isPopular && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-linear-to-r from-purple-500 to-cyan-500 text-white">
                    Popular
                  </Badge>
                )}

                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <div className="mb-6">
                    <span className="text-4xl font-bold tracking-tight">
                      {priceInfo.display}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">
                      {priceInfo.period}
                    </span>
                    {priceInfo.yearly && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        or {priceInfo.yearly} billed yearly
                      </p>
                    )}
                  </div>

                  <ul className="flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-green-500" />
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
                    variant={isPopular ? "default" : "outline"}
                    className={cn(
                      "w-full",
                      isPopular &&
                        "bg-linear-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600"
                    )}
                  >
                    <a href={`${siteConfig.appUrl}/signup`}>
                      {key === "starter" ? "Get Started" : "Subscribe"}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
