"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "100+", label: "Curated Prompts" },
  { value: "4", label: "Frameworks" },
  { value: "10K+", label: "Copies Generated" },
  { value: "50+", label: "Video Lessons" },
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
