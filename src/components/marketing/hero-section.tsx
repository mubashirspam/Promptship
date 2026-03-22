"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-32">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Ship{" "}
            <span className="gradient-text">Beautiful UIs</span>{" "}
            with{" "}
            <span className="gradient-text">AI</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            100+ curated prompts, one-click code generation, and comprehensive
            learning for React, Flutter, HTML &amp; Vue.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="min-w-[160px]">
              <a href={`${siteConfig.appUrl}/signup`}>Get Started Free</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[160px]">
              <Link href="/prompts">View Prompts</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Decorative code preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <Card className="border-foreground/5 bg-card/80 shadow-2xl backdrop-blur-sm">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-sm font-mono">
                <span className="flex gap-1.5">
                  <span className="inline-block size-3 rounded-full bg-red-500/80" />
                  <span className="inline-block size-3 rounded-full bg-yellow-500/80" />
                  <span className="inline-block size-3 rounded-full bg-green-500/80" />
                </span>
                <span className="ml-2 text-muted-foreground">prompt-preview.tsx</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <pre className="overflow-x-auto text-sm leading-relaxed">
                <code>
                  <span className="text-purple-500">{"import "}</span>
                  <span className="text-foreground">{"{ "}</span>
                  <span className="text-cyan-500">generateUI</span>
                  <span className="text-foreground">{" } "}</span>
                  <span className="text-purple-500">from </span>
                  <span className="text-orange-500">{'"promptship"'}</span>
                  <span className="text-foreground">{";"}</span>
                  {"\n\n"}
                  <span className="text-purple-500">{"const "}</span>
                  <span className="text-cyan-500">component</span>
                  <span className="text-foreground">{" = "}</span>
                  <span className="text-purple-500">await </span>
                  <span className="text-cyan-500">generateUI</span>
                  <span className="text-foreground">{"("}</span>
                  {"\n"}
                  <span className="text-orange-500">{"  \"A modern pricing card with"}</span>
                  {"\n"}
                  <span className="text-orange-500">{"   gradient borders and hover effects\""}</span>
                  {"\n"}
                  <span className="text-foreground">{");"}</span>
                  {"\n\n"}
                  <span className="text-muted-foreground">{"// => Production-ready React + Tailwind"}</span>
                  {"\n"}
                  <span className="text-muted-foreground">{"//    component in seconds"}</span>
                </code>
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
