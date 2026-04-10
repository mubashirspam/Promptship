"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
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
  dashboards: LayoutDashboard,
  authentication: Shield,
  "e-commerce": ShoppingCart,
  components: Layers,
  "saas-apps": LayoutDashboard,
  portfolio: Eye,
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

/** Gradient dotted path drawn in by scroll — stops before the bottom */
function DottedPath({
  side,
  pathLength,
}: {
  side: "left" | "right";
  pathLength: MotionValue<number>;
}) {
  const gradId = `dotted-grad-${side}`;
  // Path ends ~75% down — never touches the bottom
  const d =
    side === "left"
      ? "M 55 20 C 55 130, 8 210, 28 370 C 48 510, 4 580, 22 720"
      : "M 15 20 C 15 130, 62 210, 42 370 C 22 510, 66 580, 48 720";

  return (
    <svg
      className="pointer-events-none absolute top-0 overflow-visible"
      style={{
        [side]: 0,
        height: "82%",
        width: "70px",
      }}
      viewBox="0 0 70 750"
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#818cf8" stopOpacity={0.85} />
          <stop offset="45%"  stopColor="#a855f7" stopOpacity={0.6}  />
          <stop offset="80%"  stopColor="#ec4899" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#ec4899" stopOpacity={0}    />
        </linearGradient>
      </defs>

      {/* Faint static guide */}
      <path
        d={d}
        stroke="white"
        strokeOpacity={0.06}
        strokeWidth={1.5}
        strokeDasharray="5 9"
      />

      {/* Animated gradient draw-in */}
      <motion.path
        d={d}
        stroke={`url(#${gradId})`}
        strokeWidth={1.5}
        strokeDasharray="5 9"
        strokeLinecap="round"
        fill="none"
        style={{ pathLength }}
      />
    </svg>
  );
}

export function TemplateShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [data, setData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  // Width expands from rounded island → full-bleed as it covers the hero
  const borderRadius = useTransform(scrollYProgress, [0, 0.65], ["28px", "0px"]);
  const marginX    = useTransform(scrollYProgress, [0, 0.65], ["50px", "0px"]);
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/marketing/templates");
        const result = await response.json();
        if (result.success) setData(result.data);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = data
    ? [
        { slug: "all", name: "All Templates", icon: Layers },
        ...data.categories.map((cat) => ({
          slug: cat.slug,
          name: cat.name,
          icon: iconMap[cat.slug as keyof typeof iconMap] || Layers,
        })),
      ]
    : [];

  const filtered =
    !data
      ? []
      : activeCategory === "all"
        ? data.templates
        : data.templates.filter((t) => t.categorySlug === activeCategory);

  return (
    <motion.div
      ref={sectionRef}
      style={{ borderRadius, marginLeft: marginX, marginRight: marginX }}
      className="relative min-h-screen overflow-hidden bg-[#0d0d0d] pb-24 pt-20"
    >
      {/* Animated gradient dotted paths — both sides */}
      <DottedPath side="left"  pathLength={pathLength} />
      <DottedPath side="right" pathLength={pathLength} />

      {/* Subtle glow behind heading */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Prompt Templates
          </div>
          <h2 className="font-instrument-serif text-4xl font-normal tracking-tight text-white sm:text-5xl">
            Production-ready{" "}
            <em className="not-italic text-white/40">from day one.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/40">
            Hand-crafted prompts that generate real UI code — tested across
            Flutter, React, and beyond.
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-4 py-20">
            <Loader2 className="h-7 w-7 animate-spin text-white/30" />
            <p className="text-sm text-white/30">Loading templates…</p>
          </div>
        )}

        {!loading && !data && (
          <p className="py-20 text-center text-sm text-white/30">
            Failed to load templates. Please try again.
          </p>
        )}

        {!loading && data && (
          <>
            {/* Category filter */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200",
                    activeCategory === cat.slug
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/[0.08] bg-transparent text-white/40 hover:border-white/15 hover:text-white/70"
                  )}
                >
                  <cat.icon className="size-3" />
                  {cat.name}
                </button>
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
                      <div
                        className={cn(
                          "group flex h-full flex-col rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all duration-300",
                          "hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.06]"
                        )}
                      >
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-snug text-white/90">
                            {template.title}
                          </p>
                          <span
                            className={cn(
                              "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase",
                              tierColors[template.tier as keyof typeof tierColors]
                            )}
                          >
                            {template.tier === "pro" ? (
                              <span className="flex items-center gap-1">
                                <Lock className="size-2.5" /> Pro
                              </span>
                            ) : (
                              template.tier
                            )}
                          </span>
                        </div>

                        <p className="mb-4 text-xs leading-relaxed text-white/40">
                          {template.description}
                        </p>

                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {template.frameworks.map((fw) => (
                              <span
                                key={fw}
                                className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/40"
                              >
                                {fw}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-white/30">
                            <Copy className="size-3" />
                            {template.copyCount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/prompts"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-medium text-white/70 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                Browse All Templates
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
