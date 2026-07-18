"use client";

import { motion } from "motion/react";

const stats = [
  { value: "400+", label: "Templates & Components" },
  { value: "3", label: "Kinds — Figma · Prompt · Code" },
  { value: "9", label: "Frameworks & Stacks" },
  { value: "0", label: "Renewals — Pay Once" },
] as const;

export function StatsSection() {
  return (
    <section className="border-y bg-muted/30 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
