Build a single-page landing page for an AI-powered web design agency using React + Vite + TypeScript + Tailwind CSS + shadcn/ui. Dark, premium, Apple-inspired with custom "liquid glass" morphism. Pure black background throughout.

FONTS: Instrument Serif (italic) for headings, Barlow (300-600) for body.
CSS Variables: --background: 213 45% 67%; --foreground: 0 0% 100%;

LIQUID GLASS CSS (two variants):
.liquid-glass: backdrop-filter blur(4px), background rgba(255,255,255,0.01), gradient border mask ::before.
.liquid-glass-strong: backdrop-filter blur(50px), stronger shadows and gradients.

SECTION 1 — NAVBAR (fixed): top-4, z-50. Logo image (48x48). Center: liquid-glass pill with nav links ("Home", "Services", "Work", "Process", "Pricing") + "Get Started" white button with ArrowUpRight.

SECTION 2 — HERO (1000px height):
Background video: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4
Absolute, top 20%, w-full, autoplay loop muted. Overlays: bg-black/5 + bottom 300px gradient to black.
Content (z-10, centered, pt-150px): Badge pill + BlurText animated heading "The Website Your Brand Deserves" (text-[5.5rem]) + subtext + CTA buttons (liquid-glass-strong "Get Started" + "Watch the Film").

BlurText component: motion/react, splits by words, IntersectionObserver, blur 10px→0, opacity 0→1, y 50→0, step 0.35s.

SECTION 3 — PARTNERS: liquid-glass badge "Trusted by the teams behind" + partner names ("Stripe", "Vercel", "Linear", "Notion", "Figma") as text-3xl font-heading italic.

SECTION 4 — START SECTION ("How It Works"):
Background HLS video: https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8
Using hls.js with Safari fallback. Top+bottom fade gradients (200px black).
Content: Badge "How It Works" + heading "You dream it. We ship it." + CTA.

SECTION 5 — FEATURES CHESS (alternating rows):
Row 1 (text left, image right): "Designed to convert. Built to perform." + GIF in liquid-glass container.
Row 2 (reversed): "It gets smarter. Automatically." + description.

SECTION 6 — FEATURES GRID (4 columns):
4 liquid-glass cards: Zap "Days, Not Months", Palette "Obsessively Crafted", BarChart3 "Built to Convert", Shield "Secure by Default".

SECTION 7 — STATS:
Background HLS video (desaturated): https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8
liquid-glass rounded-3xl grid: "200+ Sites", "98% Satisfaction", "3.2x Conversions", "5 days Delivery".

SECTION 8 — TESTIMONIALS: 3-column grid, liquid-glass cards. Sarah Chen, Marcus Webb, Elena Voss quotes.

SECTION 9 — CTA FOOTER:
Background HLS video: https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8
Heading "Your next website starts here." + "Book a Call" + "View Pricing" buttons. Footer with copyright + links.

Dependencies: hls.js, motion (framer-motion), lucide-react, tailwindcss-animate.
