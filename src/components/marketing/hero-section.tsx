"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { siteConfig } from "@/config/site";

/**
 * Hero — animated gradient-orb background + a 3D auto-rotating wheel of real
 * template previews (like Flutter's ListWheelScrollView): cards sit on a
 * cylinder, the front card faces the viewer and the sides curve away.
 */
const bgStyles = `
  @keyframes hero-blob-1 {
    0%   { transform: translate(0px, 0px) scale(1); }
    33%  { transform: translate(30vw, 25vh) scale(1.2); }
    66%  { transform: translate(-20vw, 20vh) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes hero-blob-2 {
    0%   { transform: translate(0px, 0px) scale(1); }
    33%  { transform: translate(-30vw, -25vh) scale(1.3); }
    66%  { transform: translate(25vw, -30vh) scale(0.8); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes hero-blob-3 {
    0%   { transform: translate(0px, 0px) scale(1); }
    33%  { transform: translate(25vw, -20vh) scale(0.9); }
    66%  { transform: translate(-30vw, 25vh) scale(1.3); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .hero-animate-blob-1 { animation: hero-blob-1 15s infinite ease-in-out alternate; }
  .hero-animate-blob-2 { animation: hero-blob-2 18s infinite ease-in-out alternate-reverse; }
  .hero-animate-blob-3 { animation: hero-blob-3 20s infinite ease-in-out alternate; }
  .hero-dot-pattern {
    background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1.5px, transparent 1.5px);
    background-size: 32px 32px;
  }
  /* Side fades so cards dissolve toward the edges (like the ShaderMask) */
  .hero-wheel-mask {
    mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  }
`;

function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return (
    url.includes(".mp4") ||
    url.includes(".webm") ||
    url.includes(".m3u8") ||
    url.includes(".ogv")
  );
}

interface WheelItem {
  url: string;
  isVideo: boolean;
}

// Card footprint (px) — the wheel radius is derived from this + item count.
const CARD_W = 288;
const CARD_H = 168;
// Extra spacing between adjacent cards on the wheel (widens the arc too).
const CARD_GAP = 30;

export function HeroSection() {
  const [items, setItems] = useState<WheelItem[]>([]);

  useEffect(() => {
    fetch("/api/marketing/templates")
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) return;
        const media: WheelItem[] = res.data.templates
          .map(
            (t: { previewVideoUrl: string | null; previewImageUrl: string | null }) =>
              t.previewVideoUrl || t.previewImageUrl
          )
          .filter((u: string | null): u is string => Boolean(u))
          .slice(0, 13)
          .map((url: string) => ({ url, isVideo: isVideoUrl(url) }));
        setItems(media);
      })
      .catch(() => {});
  }, []);

  const n = items.length;
  const angleStep = n > 0 ? 360 / n : 0;
  // Radius that spaces `n` cards around the cylinder with a gap between them —
  // a larger radius both separates the cards and widens the visible front arc.
  const radius =
    n > 1 ? Math.round((CARD_W + CARD_GAP) / 2 / Math.tan(Math.PI / n)) : 0;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-950">
      <style>{bgStyles}</style>

      {/* Animated gradient orbs — anchored low so color glows below the content */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hero-animate-blob-1 absolute bottom-[-20%] left-[-10%] h-[55vw] w-[55vw] rounded-full bg-[#FF5CCC] opacity-20 mix-blend-screen blur-[100px]" />
        <div className="hero-animate-blob-2 absolute bottom-[-10%] right-[-10%] h-[50vw] w-[50vw] rounded-full bg-[#a855f7] opacity-20 mix-blend-screen blur-[120px]" />
        <div className="hero-animate-blob-3 absolute bottom-[-30%] left-[15%] h-[65vw] w-[65vw] rounded-full bg-[#7a219e] opacity-25 mix-blend-screen blur-[130px]" />
      </div>

      {/* Dot pattern overlay */}
      <div className="hero-dot-pattern pointer-events-none absolute inset-0 z-0 opacity-60" />

      {/* Dark vignette to focus center */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-slate-950/40 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="relative z-20 flex w-full flex-col items-center px-6 pt-24 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-semibold leading-[1.05] tracking-tight text-transparent sm:text-6xl lg:text-7xl"
        >
          Grab ship-ready UI.
          <br />
          Skip the blank canvas.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href={`${siteConfig.appUrl}/signup`}
            className="cursor-pointer rounded-full bg-white px-9 py-3.5 text-[13px] font-semibold text-[#0a0400] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
          >
            Browse templates free
          </a>
          <a
            href="/pricing"
            className="cursor-pointer rounded-full border border-white/25 bg-white/10 px-9 py-3.5 text-[13px] font-medium text-white/80 backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/15 hover:text-white"
          >
            Unlimited pricing →
          </a>
        </motion.div>
      </div>

      {/* ── 3D auto-rotating wheel of template previews ───────────────── */}
      {n > 1 && (
        <div
          className="hero-wheel-mask relative z-20 mx-auto mt-14 w-full max-w-7xl px-4 [perspective:3000px] sm:px-6 lg:px-8"
          style={{ height: CARD_H + 180 }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
            style={{
              width: CARD_W,
              height: CARD_H,
              marginLeft: -CARD_W / 2,
              marginTop: -CARD_H / 2,
            }}
            animate={{ rotateY: [0, -360] }}
            transition={{ duration: n * 3.2, ease: "linear", repeat: Infinity }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_15px_35px_rgba(0,0,0,0.5)] [backface-visibility:hidden]"
                style={{
                  transform: `rotateY(${i * angleStep}deg) translateZ(${radius}px)`,
                }}
              >
                {item.isVideo ? (
                  <video
                    src={item.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              </div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Animated scroll-down indicator */}
      <motion.a
        href="#templates"
        aria-label="Scroll to templates"
        onClick={(e) => {
          e.preventDefault();
          document
            .getElementById("templates")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2 text-white/45 transition-colors hover:text-white"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/30 p-1">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-current"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </div>
  );
}
