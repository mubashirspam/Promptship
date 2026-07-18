"use client";

import { useScroll, useTransform, motion } from "motion/react";
import { HeroSection } from "./hero-section";

/**
 * Wraps HeroSection in a 200vh scroll container so the hero moves at
 * 50% scroll speed. The hero fully exits the viewport after 200vh of scroll.
 *
 * Math:
 *   hero viewport-top = -scrollY (container scroll) + scrollY * 0.5 (translate) = -scrollY * 0.5
 *   At scrollY = 200vh → heroTop = -100vh → fully above viewport ✓
 */
export function ParallaxHero() {
  const { scrollY } = useScroll();
  // translateY = scrollY * 0.5  →  hero moves up at half the scroll speed
  const y = useTransform(scrollY, (v) => v * 0.5);

  return (
    <div className="relative h-[200vh]">
      <motion.div
        style={{ y }}
        className="absolute inset-x-0 top-0 z-0"
      >
        <HeroSection />
      </motion.div>
    </div>
  );
}
