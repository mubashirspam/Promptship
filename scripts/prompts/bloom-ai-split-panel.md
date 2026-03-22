Create a full-screen hero landing page for "Bloom" — an AI-powered plant/floral design platform. Liquid glass morphism aesthetic over a looping video background.

Background: Full-screen autoplaying, looping, muted video: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4
Video covers entire viewport with object-cover at z-0. All content at z-10.

Fonts: Display/Body: Poppins (Google Fonts). Serif accent: Source Serif 4 (italic emphasis in headings). Headings font-weight: 500.

Color Palette: Strict grayscale only — all CSS variables 0 0% X% HSL. Text hierarchy: text-white, text-white/80, text-white/60, text-white/50.

Liquid Glass CSS (two tiers under @layer components):
.liquid-glass (light): backdrop-filter blur(4px), background rgba(255,255,255,0.01), ::before gradient border mask.
.liquid-glass-strong (heavy): backdrop-filter blur(50px), stronger box-shadow and gradient opacity.

Layout — Two-Panel Split: Flex row, min-h-screen. Left w-[52%], right w-[48%] (hidden on mobile lg:flex).

Left Panel:
- liquid-glass-strong overlay (absolute inset-4 lg:inset-6 rounded-3xl)
- Nav: Logo image (32x32) + "bloom" text (semibold 2xl) | "Menu" button with Menu icon
- Hero center: Logo image (80x80), h1: "Innovating the / spirit of bloom AI" text-6xl lg:text-7xl tracking-[-0.05em]
- CTA: "Explore Now" with Download icon in rounded bg-white/15 circle, liquid-glass-strong rounded-full
- Three pills: "Artistic Gallery", "AI Generation", "3D Structures"
- Bottom quote: "VISIONARY DESIGN" label + "We imagined a realm with no ending." + "MARCUS AURELIO"

Right Panel (desktop only):
- Top: Social icons (Twitter, LinkedIn, Instagram) in liquid-glass pill + Account button with Sparkles
- Community card: "Enter our ecosystem" in liquid-glass w-56
- Bottom feature section: "Processing" (Wand2 icon) and "Growth Archive" (BookOpen icon) cards
- Bottom card: flower thumbnail, "Advanced Plant Sculpting" title, "+" button

Icons: lucide-react — Sparkles, Download, Wand2, BookOpen, ArrowRight, Twitter, Linkedin, Instagram, Menu.
All interactive: hover:scale-105 transition-transform. No border classes — glass effect handles borders via ::before.
