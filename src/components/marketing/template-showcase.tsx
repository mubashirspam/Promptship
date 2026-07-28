"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";
import { Copy, Lock, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Template {
  id: string;
  title: string;
  slug: string;
  description: string;
  isFree: boolean;
  frameworks: string[] | null;
  copyCount: number;
  isFeatured: boolean;
  previewImageUrl: string | null;
  previewVideoUrl: string | null;
  categoryName: string;
  categorySlug: string;
}

interface MarketingData {
  templates: Template[];
}

function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return (
    url.includes(".mp4") ||
    url.includes(".webm") ||
    url.includes(".m3u8") ||
    url.includes(".ogv") ||
    url.includes("stream.mux.com") ||
    url.includes("cloudfront.net")
  );
}

const gradients = [
  "from-violet-600 to-indigo-800",
  "from-blue-600 to-cyan-800",
  "from-emerald-600 to-teal-800",
  "from-orange-600 to-red-800",
  "from-pink-600 to-rose-800",
  "from-amber-600 to-orange-800",
];
function getGradient(id: string) {
  const sum = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return gradients[sum % gradients.length];
}

/**
 * Masonry card that renders the preview at its NATURAL aspect ratio — the
 * media defines the card height (no cropping), so a 16:9 clip and a 3:4 poster
 * sit at their true proportions and the columns pack organically.
 */
function TemplateCard({ template }: { template: Template }) {
  const mediaSrc = template.previewVideoUrl || template.previewImageUrl;
  const asVideo = isVideoUrl(mediaSrc);

  const href = template.categorySlug
    ? `/templates/${template.categorySlug}/${template.slug}`
    : `/templates/${template.slug}`;

  return (
    <Link href={href}>
      <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111] transition-colors duration-300 hover:border-white/20">
        <div className="relative w-full">
          {/* Media — sized by intrinsic ratio (w-full + h-auto), never cropped */}
          {asVideo && mediaSrc ? (
            <video
              src={mediaSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="block h-auto w-full"
            />
          ) : mediaSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaSrc}
              alt={template.title}
              loading="lazy"
              className="block h-auto w-full"
            />
          ) : (
            // No preview: keep a sensible height so the card isn't zero-height
            <div
              className={cn(
                "aspect-[4/3] w-full bg-gradient-to-br",
                getGradient(template.id)
              )}
            />
          )}

          {/* Dark gradient — hidden until hover, so the card is preview-only by default */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Info bar — name + category fade/slide in on hover only */}
          <div className="absolute inset-x-0 bottom-0 translate-y-1 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-bold leading-tight text-white">
                  {template.title}
                </p>
                <p className="mt-0.5 text-xs text-white/50">
                  {template.categoryName}
                </p>
              </div>

              {/* Access chip */}
              <div
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold backdrop-blur-sm",
                  template.isFree
                    ? "bg-white/15 text-white"
                    : "bg-white/10 text-white/60"
                )}
              >
                {template.isFree ? (
                  <>
                    <Copy className="size-3" />
                    Copy
                  </>
                ) : (
                  <>
                    <Lock className="size-3" />
                    Premium
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/** Gradient dotted path drawn in by scroll */
function DottedPath({
  side,
  pathLength,
}: {
  side: "left" | "right";
  pathLength: MotionValue<number>;
}) {
  const gradId = `dotted-grad-${side}`;
  const d =
    side === "left"
      ? "M 55 20 C 55 130, 8 210, 28 370 C 48 510, 4 580, 22 720"
      : "M 15 20 C 15 130, 62 210, 42 370 C 22 510, 66 580, 48 720";

  return (
    <svg
      className="pointer-events-none absolute top-0 overflow-visible"
      style={{ [side]: 0, height: "82%", width: "70px" }}
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
      <path d={d} stroke="white" strokeOpacity={0.06} strokeWidth={1.5} strokeDasharray="5 9" />
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
  const [data, setData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const borderRadius = useTransform(scrollYProgress, [0, 0.65], ["28px", "0px"]);
  const marginX     = useTransform(scrollYProgress, [0, 0.65], ["50px", "0px"]);
  const pathLength  = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    fetch("/api/marketing/templates")
      .then((r) => r.json())
      .then((res) => { if (res.success) setData(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Every featured template, however many admin has curated — the API decides
  // the set, this just renders it. The CTA below leads to the full catalog.
  const visible = data ? data.templates : [];

  return (
    <motion.div
      ref={sectionRef}
      style={{ borderRadius, marginLeft: marginX, marginRight: marginX }}
      className="relative overflow-hidden bg-[#0d0d0d] pb-28 pt-20"
    >
      <DottedPath side="left"  pathLength={pathLength} />
      <DottedPath side="right" pathLength={pathLength} />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Prompt Templates
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Production-ready <span className="text-white/40">from day one.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/40">
            Hand-crafted prompts that generate real UI — tested across Flutter, React, and beyond.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-24">
            <Loader2 className="h-7 w-7 animate-spin text-white/20" />
            <p className="text-sm text-white/25">Loading templates…</p>
          </div>
        )}

        {/* Error */}
        {!loading && !data && (
          <p className="py-20 text-center text-sm text-white/30">
            Failed to load templates. Please try again.
          </p>
        )}

        {/* Masonry grid */}
        {!loading && data && (
          <>
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className="columns-1 gap-4 sm:columns-2 lg:columns-3"
              >
                {visible.map((template, i) => (
                  <motion.div
                    key={template.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2, delay: Math.min(i, 12) * 0.02 }}
                    className="mb-4 break-inside-avoid"
                  >
                    <TemplateCard template={template} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {visible.length === 0 && (
              <p className="py-16 text-center text-sm text-white/30">
                No templates in this category yet.
              </p>
            )}

            <div className="mt-12 text-center">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-medium text-white/70 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                Explore all templates
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
