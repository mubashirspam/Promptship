Create a dark mode hero section for an AI website builder with the following exact specifications:

Required Packages: motion (v12+), hls.js (v1.6+), lucide-react (v0.487+)

Fonts: Import Google Fonts — Instrument Sans (ital, wght 400-700) and Instrument Serif (ital).

Navbar: Fixed, transparent, z-50, px-6 py-4, flex items-center justify-between.
Left: Sunburst icon SVG (24x24, white). Center (md:flex): "Products" (ChevronDown), "Customer Stories", "Resources", "Pricing" — text-sm font-medium text-white/80. Right: "Book A Demo" link + "Get Started" button (white bg, black text, rounded-full px-5 py-2.5).

Hero Section:
Container: relative, full width, min-h-screen, bg-#000000, text-white, overflow-hidden.

Background Video: HLS stream URL: https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8
Implementation using hls.js with Safari fallback (canPlayType). Video: muted, loop, playsInline, object-cover, opacity 60%.
Poster fallback: dark abstract technology image.

Video Overlay: bg-black/60 with backdrop-blur-[2px].
Decorative Gradients: Top-left (600x600, bg-blue-900/20, blur-[120px]) and bottom-right (500x500, bg-indigo-900/20, blur-[120px]).

Content (max-w-5xl, mx-auto, text-center, z-10, mt-20, space-y-12):
Pre-headline: "Design at the speed of thought" — Instrument Serif, text-3xl sm:text-5xl lg:text-[48px], leading-[1.1]. Motion fade up.
Main Headline: "Build Faster" — Instrument Sans font-semibold, text-6xl sm:text-8xl lg:text-[136px], leading-[0.9], tracking-tighter, bg-gradient-to-b from-white via-white to-[#b4c0ff], bg-clip-text text-transparent. Motion scale in.
Subheadline: "Create fully functional, SEO-optimized websites in seconds with our advanced AI engine." — text-lg sm:text-[20px], leading-[1.65], white opacity-70, max-w-xl. Motion fade.

CTA Buttons:
Primary: White pill, pl-6 pr-2 py-2. Text "Start Building Free" (#0a0400). Arrow in 40x40 circle bg-[#3054ff]. Hover shadow + scale-105.
Secondary: "See Examples" text link with arrow, text-white/70, hover:text-white, backdrop-blur-sm.

Motion Animations:
Pre-headline: y:20→0, opacity:0→1, 0.6s
Headline: scale:0.9→1, opacity:0→1, delay 0.2s
Subheadline: opacity:0→0.7, delay 0.4s
Buttons: y:20→0, opacity:0→1, delay 0.6s
