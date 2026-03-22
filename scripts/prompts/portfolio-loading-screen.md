Build a fullscreen loading screen component in React (Next.js 14, TypeScript). Uses Framer Motion for animations.

Theme:
--bg: #0a0a0a; --text: #f5f5f5; --muted: #888888; --stroke: #1f1f1f;
Font: font-display → Instrument Serif (Google Fonts, italic, weight 400).

Component: LoadingScreen
Prop: onComplete: () => void.

Container: motion.div — fixed inset-0 z-[9999] bg-bg. Exit: exit={{ opacity: 0 }}, duration 0.6s, ease [0.4, 0, 0.2, 1]. Wrap in AnimatePresence mode="wait".

Element 1: "Portfolio" Label (Top-Left)
absolute top-8 left-8 md:top-12 md:left-12. Text: "Portfolio". text-xs md:text-sm text-muted uppercase tracking-[0.3em]. Animate: y:-20→0, opacity:0→1, delay 0.1s.

Element 2: Rotating Words (Center)
Three words cycle: "Design" → "Create" → "Inspire". New word every 900ms via setInterval. Stops at last word.
Each word: AnimatePresence mode="wait", keyed by index. text-4xl md:text-6xl lg:text-7xl font-display italic text-text/80. initial y:20, animate y:0, exit y:-20, duration 0.4s.

Element 3: Counter (Bottom-Right)
absolute bottom-8 right-8 md:bottom-12 md:right-12. Counts 000→100 over 2.7s using requestAnimationFrame. Zero-padded to 3 digits: Math.round(progress).toString().padStart(3, '0'). text-6xl md:text-8xl lg:text-9xl font-display text-text tabular-nums.

When progress reaches 100: Wait 400ms, then call onComplete(). Use ref for onComplete to avoid stale closures.

Element 4: Progress Bar (Bottom Edge)
absolute bottom-0 left-0 right-0. Track: h-[3px] bg-stroke/50. Fill: motion.div, origin-left, linear-gradient(90deg, #89AACC, #4E85BF), boxShadow glow. scaleX: 0→progress/100.

Parent Wrapper: isLoading state starts true. Renders LoadingScreen inside AnimatePresence. Main content: opacity 0→1 on complete with 0.5s transition.

Timing: 0.0s loader appears + counter starts, 0.9s "Create", 1.8s "Inspire", 2.7s counter hits 100, 3.1s onComplete fires, 3.7s page fades in.
