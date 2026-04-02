"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { siteConfig } from "@/config/site";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-32">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-purple-500/8 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/8 blur-3xl" />
        <div className="absolute left-0 bottom-1/4 h-[300px] w-[300px] rounded-full bg-orange-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Badge
              variant="outline"
              className="mb-6 gap-1.5 border-primary/20 px-3 py-1 text-xs"
            >
              <Sparkles className="size-3 text-primary" />
              10 New Premium Templates Added
            </Badge>
          </motion.div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Your Design{" "}
            <span className="gradient-text">AI Secret</span>
            <br />
            <span className="gradient-text">Weapon</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Unlock a collection of beautiful, premium prompt templates for
            React, Flutter, HTML & Vue — ready to copy and use. Ship stunning
            UIs in minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="min-w-[180px] gap-2">
              <a href={`${siteConfig.appUrl}/signup`}>
                Get Started Free
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[180px]"
            >
              <Link href="#templates">View Templates</Link>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1">
              <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
              <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
              <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
              <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
              <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
              <span className="ml-1">Loved by developers</span>
            </span>
            <span className="hidden sm:inline">|</span>
            <span>100+ Curated Prompts</span>
            <span className="hidden sm:inline">|</span>
            <span>4 Frameworks</span>
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
                <span className="ml-2 text-muted-foreground">
                  prompt-preview.tsx
                </span>
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
                  <span className="text-orange-500">{'"promtify"'}</span>
                  <span className="text-foreground">{";"}</span>
                  {"\n\n"}
                  <span className="text-purple-500">{"const "}</span>
                  <span className="text-cyan-500">hero</span>
                  <span className="text-foreground">{" = "}</span>
                  <span className="text-purple-500">await </span>
                  <span className="text-cyan-500">generateUI</span>
                  <span className="text-foreground">{"("}</span>
                  {"\n"}
                  <span className="text-orange-500">
                    {'  "A modern SaaS hero section with'}
                  </span>
                  {"\n"}
                  <span className="text-orange-500">
                    {'   gradient text, floating mockup, and'}
                  </span>
                  {"\n"}
                  <span className="text-orange-500">
                    {'   glassmorphism card overlay"'}
                  </span>
                  {"\n"}
                  <span className="text-foreground">{");"}</span>
                  {"\n\n"}
                  <span className="text-muted-foreground">
                    {"// => Production-ready React + Tailwind"}
                  </span>
                  {"\n"}
                  <span className="text-muted-foreground">
                    {"//    component in seconds"}
                  </span>
                </code>
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
