"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search, Copy, Code, Rocket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Prompts",
    description:
      "Explore our library of 100+ curated prompts organized by category and framework.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Copy,
    title: "Copy & Customize",
    description:
      "Copy any prompt with one click. Customize style, animation level, and dark mode.",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Code,
    title: "Generate Code",
    description:
      "Paste into any AI tool or use our built-in generator to get production-ready code.",
    color: "bg-cyan-500/10 text-cyan-500",
  },
  {
    icon: Rocket,
    title: "Ship It",
    description:
      "Drop the generated component into your project. Clean code, ready for production.",
    color: "bg-emerald-500/10 text-emerald-500",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            From browsing to shipping in minutes, not hours.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-12 left-8 hidden h-[calc(100%-48px)] w-px bg-border md:left-1/2 md:block" />

          <div className="flex flex-col gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={cn(
                  "relative flex items-start gap-6 md:gap-12",
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "flex-1",
                    i % 2 === 0 ? "md:text-right" : "md:text-left"
                  )}
                >
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Center icon */}
                <div className="relative z-10 flex size-16 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full",
                      step.color
                    )}
                  >
                    <step.icon className="size-5" />
                  </div>
                </div>

                <div className="hidden flex-1 md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
