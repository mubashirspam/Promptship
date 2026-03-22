Build a production-ready, responsive landing page using React, Tailwind CSS v4, and Vite. High-end, dark-mode "glassmorphism" aesthetic with purple/pink gradients.

Tech Stack: hls.js (video streaming), motion/react (Framer Motion), react-use-measure, clsx + tailwind-merge, lucide-react.

Global Styling: Background #010101. Primary Gradient: from-[#FA93FA] via-[#C967E8] to-[#983AD6].

Hero Section Components:
Announcement Pill: bg-[rgba(28,27,36,0.15)] with border. "Zap" icon in gradient box with glow. Text: "Used by founders. Loved by devs."

Main Headline (H1): 48px mobile to 80px desktop. "Your Vision" / "Our Digital Reality." — gradient fill white to purple/pink.

Subheadline: "We turn bold ideas into modern designs that don't just look amazing, they grow your business fast." text-white/80.

CTA Button: "Book a 15-min call" — white bg, black text, rounded-full. Circle icon with arrow styled with purple gradient. Outer border wrapper with glass effect.

Hero Video:
Source HLS: https://customer-cbeadsgr09pnsezs.cloudflarestream.com/697945ca6b876878dba3b23fbd2f1561/manifest/video.m3u8
Fallback MP4. Native <video> with hls.js (NOT react-player).
Blend Mode: mix-blend-screen. Positioned bottom of hero with -mt-[150px] overlap.
Text z-20, video z-10. 100% width, auto height, edge-to-edge (no object-contain).
Gradient overlay: from-[#010101] via-transparent to-[#010101].

Logo Cloud Section (Animated):
Below video. bg-black/20 backdrop-blur-sm, border-white/5 top border.
Desktop: "Powering the best teams" text left + vertical divider + animated logo slider right.
InfiniteSlider component using motion/react for horizontal infinite scroll.
Logos (SVGs): OpenAI, Nvidia, GitHub, etc. — brightness-0 invert to make white.

Structure: Hero.tsx, App.tsx, components/ui/infinite-slider.tsx.
