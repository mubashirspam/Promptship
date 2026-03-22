"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  LayoutDashboard,
  Shield,
  ShoppingCart,
  Layers,
  ArrowRight,
  Copy,
  Lock,
  Eye,
  Loader2,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import Link from "next/link";

interface Template {
  id: string;
  title: string;
  slug: string;
  description: string;
  tier: string;
  frameworks: string[];
  copyCount: number;
  isFeatured: boolean;
  categoryName: string;
  categorySlug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface MarketingData {
  templates: Template[];
  categories: Category[];
}

const iconMap = {
  "landing-pages": Rocket,
  "dashboards": LayoutDashboard,
  "authentication": Shield,
  "e-commerce": ShoppingCart,
  "components": Layers,
  "saas-apps": LayoutDashboard,
  "portfolio": Eye,
  "blog-content": Layers,
  "forms-ui": Shield,
  "social-community": ShoppingCart,
  all: Layers,
} as const;

const tierColors = {
  free: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  starter: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pro: "bg-purple-500/10 text-purple-500 border-purple-500/20",
} as const;

export function TemplateShowcase() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [data, setData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/marketing/templates");
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading amazing templates...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load templates. Please try again.</p>
          </div>
        </div>
      </section>
    );
  }

  const categories = [
    { slug: "all", name: "All Templates", icon: Layers },
    ...data.categories.map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      icon: iconMap[cat.slug as keyof typeof iconMap] || Layers,
    })),
  ];

  const filtered =
    activeCategory === "all"
      ? data.templates
      : data.templates.filter((t) => t.categorySlug === activeCategory);

  return (
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4">
            10 Production-Ready Templates
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Premium <span className="gradient-text">Prompt Templates</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Hand-crafted prompts that generate production-ready UI code. Each template
            is tested across frameworks with detailed specifications.
          </p>
        </div>

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.slug}
              variant={activeCategory === cat.slug ? "default" : "outline"}
              size="sm"
              className="gap-1.5"
              onClick={() => setActiveCategory(cat.slug)}
            >
              <cat.icon className="size-3.5" />
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Template grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((template) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/prompts/${template.slug}`}>
                  <Card
                    className={cn(
                      "group flex h-full flex-col transition-all duration-300 cursor-pointer",
                      "hover:-translate-y-1 hover:shadow-lg hover:ring-1 hover:ring-foreground/10"
                    )}
                  >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">
                        {template.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={cn("shrink-0 text-[10px] uppercase", tierColors[template.tier as keyof typeof tierColors])}
                      >
                        {template.tier === "free" && "Free"}
                        {template.tier === "starter" && "Starter"}
                        {template.tier === "pro" && (
                          <span className="flex items-center gap-1">
                            <Lock className="size-2.5" />
                            Pro
                          </span>
                        )}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs leading-relaxed">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto flex items-center justify-between pt-0">
                    <div className="flex flex-wrap gap-1">
                      {template.frameworks.map((fw) => (
                        <span
                          key={fw}
                          className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {fw}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Copy className="size-3" />
                      {template.copyCount.toLocaleString()}
                    </div>
                  </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-10 text-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/prompts">
              Browse All Templates
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
