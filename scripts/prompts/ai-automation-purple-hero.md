Create a full-screen hero section with the following exact specifications:

Layout: h-screen, full width, relative, overflow-hidden. Background: #070612 (dark purple-black). Content left-aligned, vertically centered. Max-w-7xl container, px-6 lg:px-12.

Background Video: HLS stream from https://stream.mux.com/s8pMcOvMQXc4GD6AX4e1o01xFogFxipmuKltNfSYza0200.m3u8
Autoplaying, looping, muted, positioned absolutely behind content. Video shifted 200px right (margin-left: 200px), scaled 1.2x with origin-left, object-cover, full height. Bottom fade gradient h-40 from background to transparent (z-10).

Badge (top element):
Pill-shaped with rounded-full, border border-white/20, backdrop-blur-sm. Sparkles icon (w-3 h-3, text-white/80). Text: "New AI Automation Ally" text-sm font-medium text-white/80. Animated with blur-in (0.6s).

Main Heading (three lines):
- "Unlock the Power of AI" (block)
- "for Your" (inline)
- "Business." in serif italic font (inline)
text-4xl md:text-5xl lg:text-6xl font-medium leading-tight lg:leading-[1.2] text-foreground.
Each word animates with staggered split-text (0.08s delay, 0.6s duration, y:40→0, opacity:0→1).

Subtitle: "Our cutting-edge AI platform automates, analyzes, and accelerates your workflows so you can focus on what really matters." text-white/80 text-lg max-w-xl leading-relaxed. Blur-in animation (0.4s delay).

CTA Buttons (gap-4, flex-wrap):
Primary "Book A Free Call": bg-foreground text-background rounded-full px-5 py-3 with ArrowRight icon. Links to /book-call.
Secondary "Learn now": bg-white/20 backdrop-blur-sm rounded-full px-8 py-3 text-white.
Both: blur-in animation (0.6s delay).

Animations (framer-motion):
BlurIn: opacity 0→1, blur 10px→0, y 20→0.
SplitText: splits by words, staggers each word's animation.

Z-index: Video z-0, gradient z-10, content z-20.
Spacing: gap-12 between badge/heading group and CTAs. gap-6 between badge/heading/subtitle.
