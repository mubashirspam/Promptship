"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { siteConfig } from "@/config/site";
import Hls from "hls.js";

const VIDEO_SRC =
  "https://stream.mux.com/s8pMcOvMQXc4GD6AX4e1o01xFogFxipmuKltNfSYza0200.m3u8";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(VIDEO_SRC);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((e) => console.log("Auto-play prevented:", e));
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = VIDEO_SRC;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((e) => console.log("Auto-play prevented:", e));
      });
    }
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden bg-[#0a0a0a]">

      {/* Video — offset 200px right, scaled 1.2x from left origin */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop
        className="absolute inset-y-0 left-0 h-full w-full origin-left scale-[1.2] object-cover"
        style={{ marginLeft: "200px" }}
      />

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

      {/* Content */}
      <section className="relative z-20 flex min-h-[calc(100vh-2rem)] flex-col items-center justify-center px-6 pb-32 pt-32 text-center">

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-[11px] font-medium uppercase tracking-widest text-white/70 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          400+ Templates · Figma Kits · AI Prompts · Code Starters
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-4xl bg-gradient-to-b from-[#f97316] via-white to-[#a855f7] bg-clip-text text-6xl font-semibold leading-[0.9] tracking-tighter text-transparent sm:text-8xl lg:text-[136px]"
        >
          Pick it.
          <br />
          Ship it.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mx-auto mt-8 max-w-xl text-lg leading-[1.65] text-white sm:text-[20px]"
        >
          Premium Figma Kits, AI Prompts and Code Starters for web
          and mobile. Pay once, own it forever — download, copy and
          ship in minutes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href={`${siteConfig.appUrl}/signup`}
            className="cursor-pointer rounded-full bg-white px-9 py-3.5 text-[13px] font-semibold text-[#0a0400] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            Browse templates free
          </a>
          <a
            href="/pricing"
            className="cursor-pointer rounded-full border border-white/25 bg-white/10 px-9 py-3.5 text-[13px] font-medium text-white/80 backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/15 hover:text-white"
          >
            See lifetime pricing →
          </a>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <p className="text-[11px] uppercase tracking-widest text-white/35">
            Built for
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {[
              { label: "Flutter",  color: "#a855f7" },
              { label: "React",    color: "#6366f1" },
              { label: "Next.js",  color: "#06b6d4" },
              { label: "Tailwind", color: "#f59e0b" },
              { label: "SwiftUI",  color: "#f97316" },
            ].map(({ label, color }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
                style={{
                  color,
                  backgroundColor: `${color}28`,
                  border: `1px solid ${color}80`,
                }}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {label}
              </span>
            ))}
          </div>
        </motion.div>

      </section>
    </div>
  );
}
