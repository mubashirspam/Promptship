"use client";

import { useUIStore } from "@/stores/ui-store";
import { siteConfig } from "@/config/site";
import { pricingPlans, type PlanKey } from "@/config/pricing";
import { useProductPrices } from "@/hooks/use-product-prices";
import { Check, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";

type Currency = "USD" | "INR";

const planIcons: Record<PlanKey, React.ElementType> = {
  basic: Zap,
  pro: Sparkles,
  premium: Crown,
};

function formatPrice(amount: number, curr: Currency) {
  return new Intl.NumberFormat(curr === "USD" ? "en-US" : "en-IN", {
    style: "currency",
    currency: curr,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PricingCards() {
  const { currency, setCurrency } = useUIStore();
  const livePrices = useProductPrices();

  // Admin-managed DB price wins; static config is the fallback
  const priceOf = (k: PlanKey) => {
    const cfg = pricingPlans[k];
    const live = livePrices[cfg.productId];
    if (live) return currency === "USD" ? live.usd : live.inr;
    return currency === "USD" ? cfg.priceUSD : cfg.priceINR;
  };
  const anchorOf = (k: PlanKey) => {
    const cfg = pricingPlans[k];
    return currency === "USD" ? cfg.anchorUSD : cfg.anchorINR;
  };

  const planEntries = Object.entries(pricingPlans) as [
    PlanKey,
    (typeof pricingPlans)[PlanKey],
  ][];
  const proDelta = priceOf("premium") - priceOf("pro");

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] px-4 pb-24 pt-20 font-sans text-slate-200 selection:bg-purple-500/30 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-pink-500/10 mix-blend-screen blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] h-[50%] w-[50%] rounded-full bg-purple-600/10 mix-blend-screen blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] h-[60%] w-[60%] rounded-full bg-indigo-500/10 mix-blend-screen blur-[150px]" />
        {/* Subtle grid pattern for depth */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-6xl">
            400+ templates. One price.
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Every framework.
            </span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-slate-400">
            Pay once, own it forever. No subscriptions, no renewals, no hidden
            fees. Ship your next project faster than ever.
          </p>

          {/* Currency toggle */}
          <div className="inline-flex items-center rounded-full border border-white/10 bg-black/40 p-1.5 shadow-2xl backdrop-blur-xl">
            {(["USD", "INR"] as Currency[]).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`relative rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ease-out ${
                  currency === curr
                    ? "text-white shadow-lg"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {currency === curr && (
                  <span
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-100 transition-opacity duration-300"
                    style={{ zIndex: -1 }}
                  />
                )}
                {curr === "USD" ? "USD ($)" : "INR (₹)"}
              </button>
            ))}
          </div>
        </div>

        {/* Cards — 1 col mobile, 3 cols md+ */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-6 px-2 sm:px-0 md:grid-cols-3 lg:gap-8">
          {planEntries.map(([key, plan]) => {
            const Icon = planIcons[key];
            const highlighted = "bestValue" in plan && plan.bestValue;
            const badge = highlighted
              ? "Best Value"
              : "popular" in plan && plan.popular
                ? "Popular"
                : null;
            const price = priceOf(key);
            const anchor = anchorOf(key);
            const savePct =
              anchor && anchor > price
                ? Math.round((1 - price / anchor) * 100)
                : null;
            const features = highlighted
              ? [
                  `The entire library — only ${formatPrice(proDelta, currency)} more than Pro`,
                  ...plan.features,
                ]
              : [...plan.features];

            return (
              <div
                key={key}
                className={`relative mt-4 flex flex-col rounded-3xl border p-6 backdrop-blur-xl transition-all duration-500 md:mt-0 lg:p-8 ${
                  highlighted
                    ? "z-10 border-purple-500/40 bg-gradient-to-b from-purple-900/40 to-black/60 shadow-[0_0_50px_-12px_rgba(168,85,247,0.4)] md:-translate-y-4"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                {/* Highlighted glow line */}
                {highlighted && (
                  <div className="absolute -top-[1px] left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-70" />
                )}

                {/* Top badges: Popular/Best Value + Save % */}
                <div className="absolute -top-4 left-0 right-0 z-20 flex justify-center gap-2 px-2">
                  {badge && (
                    <span
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-lg lg:text-xs ${
                        highlighted
                          ? "border border-purple-400/30 bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "border border-slate-600 bg-slate-800 text-slate-300"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                  {savePct && (
                    <span className="whitespace-nowrap rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400 shadow-lg backdrop-blur-md lg:text-xs">
                      Save {savePct}%
                    </span>
                  )}
                </div>

                {/* Card header */}
                <div className="mb-6 mt-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className={`rounded-xl p-2 ${
                        highlighted
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-white/5 text-slate-300"
                      }`}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="text-xl font-bold tracking-wide text-white">
                      {plan.name}
                    </h3>
                  </div>
                  <p className="h-10 text-sm leading-relaxed text-slate-400">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8 border-b border-white/5 pb-8">
                  <div className="mb-2 flex flex-wrap items-end gap-x-2 gap-y-1">
                    <span className="text-4xl font-extrabold tracking-tighter text-white lg:text-5xl">
                      {formatPrice(price, currency)}
                    </span>
                    {anchor && (
                      <div className="flex flex-col pb-1.5">
                        <span className="text-xs font-medium text-slate-400 lg:text-sm">
                          instead of{" "}
                          <span className="ml-1 font-bold text-slate-300 line-through decoration-pink-500/60 decoration-2">
                            {formatPrice(anchor, currency)}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-400">one-time</p>
                </div>

                {/* Features */}
                <div className="mb-8 flex-1 space-y-4">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 shrink-0 rounded-full p-0.5 ${
                          highlighted
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-white/5 text-slate-400"
                        }`}
                      >
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span
                        className={`text-sm leading-snug ${
                          highlighted && idx === 0
                            ? "font-semibold text-white"
                            : "text-slate-300"
                        }`}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={`${siteConfig.appUrl}/upgrade?product=${plan.productId}`}
                  className={`group mt-auto flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold transition-all duration-300 ${
                    highlighted
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:-translate-y-1 hover:shadow-purple-500/40"
                      : "border border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  {plan.ctaLabel}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1.5"
                  />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
