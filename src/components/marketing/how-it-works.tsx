"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";
import { Search, Copy, Code, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Templates",
    description:
      "Explore 400+ Figma Kits, AI Prompts and Code Starters — filter by category, platform and framework.",
    accent: "blue",
  },
  {
    icon: Copy,
    title: "Unlock Once",
    description:
      "Free templates are yours instantly. Unlock everything with a one-time plan — Basic, Pro or Premium. No subscriptions.",
    accent: "purple",
  },
  {
    icon: Code,
    title: "Grab the Assets",
    description:
      "Open the Figma file, copy the prompt, or download the source zip — and ship your site or app the same day.",
    accent: "cyan",
  },
  {
    icon: Rocket,
    title: "Ship It",
    description:
      "Production-ready designs, prompts and code — drop them straight into your project and launch.",
    accent: "emerald",
  },
] as const;

const accentClasses: Record<
  (typeof steps)[number]["accent"],
  { text: string; border: string; glow: string }
> = {
  blue: {
    text: "text-blue-500",
    border: "border-blue-500",
    glow: "shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]",
  },
  purple: {
    text: "text-purple-500",
    border: "border-purple-500",
    glow: "shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)]",
  },
  cyan: {
    text: "text-cyan-500",
    border: "border-cyan-500",
    glow: "shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)]",
  },
  emerald: {
    text: "text-emerald-500",
    border: "border-emerald-500",
    glow: "shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)]",
  },
};

// Which step should be lit up at each point along the timeline (0 → 1)
const thresholds = steps.map((_, i) => i / (steps.length - 1));

export function HowItWorks() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Only re-renders when the active step actually changes, not on every
  // scroll pixel — cheap, unlike a raw window scroll + setState listener.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    let idx = -1;
    thresholds.forEach((t, i) => {
      if (v >= t - 0.05) idx = i;
    });
    setActiveIndex(idx);
  });

  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto mb-20 max-w-2xl text-center md:mb-28">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          How It{" "}
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Works
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          From browsing to shipping in minutes, not hours.
        </p>
      </div>

      <div ref={timelineRef} className="relative mx-auto max-w-4xl pb-4">
        {/* Base track */}
        <div className="absolute top-0 bottom-0 left-8 w-1 rounded-full bg-white/10 md:left-1/2 md:-translate-x-1/2" />

        {/* Glowing progress line, grows with scroll */}
        <motion.div
          style={{ height: lineHeight }}
          className="absolute top-0 left-8 z-0 w-1 rounded-full bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 md:left-1/2 md:-translate-x-1/2"
        >
          <span className="absolute bottom-0 left-1/2 size-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_20px_6px_rgba(168,85,247,0.7)]" />
        </motion.div>

        <div className="flex flex-col gap-16 md:gap-20">
          {steps.map((step, i) => {
            const isEven = i % 2 === 0;
            const isActive = activeIndex >= i;
            const accent = accentClasses[step.accent];

            return (
              <div
                key={step.title}
                className="relative grid min-h-[110px] grid-cols-1 items-center gap-4 md:grid-cols-2 md:gap-16"
              >
                {/* Text card — alternates sides on desktop, always right of the line on mobile */}
                <div
                  className={cn(
                    "pl-24 transition-all duration-500 md:pl-0",
                    isEven
                      ? "md:col-start-1 md:pr-16 md:text-right"
                      : "md:col-start-2 md:pl-16",
                    isActive
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-60"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl border p-5 transition-all duration-500",
                      isActive
                        ? cn("bg-white/[0.04] backdrop-blur-xl", accent.border, accent.glow)
                        : "border-transparent"
                    )}
                  >
                    <h3
                      className={cn(
                        "text-lg font-semibold transition-colors duration-500",
                        isActive ? "text-white" : "text-slate-500"
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Icon on the line */}
                <div className="absolute top-1/2 left-8 z-10 -translate-x-1/2 -translate-y-1/2 md:left-1/2">
                  <div
                    className={cn(
                      "flex size-14 items-center justify-center rounded-full border-2 bg-[#0a0a0a] transition-all duration-500 ease-out",
                      isActive
                        ? cn(accent.border, accent.glow, "scale-110")
                        : "scale-100 border-white/15"
                    )}
                  >
                    <step.icon
                      className={cn(
                        "size-5 transition-colors duration-500",
                        isActive ? accent.text : "text-slate-500"
                      )}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
