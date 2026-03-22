Create a dark landing page for "Neuralyn" — an analytics dashboard SaaS. React + Vite + Tailwind CSS + TypeScript + Framer Motion + shadcn/ui.

Fonts: Inter (400-700) via @fontsource/inter. Instrument Serif (400, italic) via @fontsource/instrument-serif.

Color Theme (HSL, dark mode):
Background: 0 0% 0% (pure black). Foreground: 0 0% 100%. Muted foreground: 0 0% 65%. Card: 0 0% 5%. Border: 0 0% 20%. Hero subtitle: 210 17% 95%.

SECTION 1 — HERO (full viewport, overflow-hidden):
Navbar: px-8 md:px-28 py-4. Left: Logo + "Neuralyn" text-xl font-bold + nav links (Home, Services w/ChevronDown, Reviews, Contact us). Right: "Sign In" button (bg-foreground text-background).

Hero Content (centered, mt-16 md:mt-20):
Tag pill: liquid-glass with inner "New" badge (white bg, black text) + "Say Hello to Corewave v3.2".
Title: text-5xl md:text-7xl tracking-[-2px] font-medium — "Your Insights. / One Clear Overview." with "Overview" in Instrument Serif italic.
Subtitle: text-lg opacity-90 — "Neuralyn helps teams track metrics, goals, and progress with precision."
CTA: "Get Started for Free" — bg-foreground text-background rounded-full px-8 py-3.5, whileHover scale 1.03.

Dashboard + Video Area: w-screen trick, aspect-ratio 16/9.
Background video: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4
Dashboard image: centered max-w-5xl w-[90%] rounded-2xl, mixBlendMode "luminosity", parallax y:0→-250.
Bottom gradient fade: h-40, z-30.

Parallax: useScroll + useTransform. Text content: y:[0,-200], opacity:[1,0]. Dashboard: y:[0,-250].
Entrance Animations: Staggered (pill 0s, title 0.1s, subtitle 0.2s, CTA 0.3s, dashboard 0.4s).

Liquid Glass CSS: .liquid-glass with backdrop-filter blur(4px), background rgba(255,255,255,0.01), gradient border ::before mask.

SECTION 2 — TESTIMONIAL (min-h-screen, centered, py-24 md:py-32):
Quote symbol image. Testimonial text-4xl md:text-5xl font-medium. Scroll-driven word reveal: each word maps to opacity [0.2,1] and color ["hsl(0 0% 35%)", "hsl(0 0% 100%)"] using useScroll/useTransform.
Author: Avatar (w-14 h-14 rounded-full) + "Brooklyn Simmons" + "Product Manager".

Assets needed: logo.png, hero-dashboard.png, quote-symbol.png, testimonial-avatar.png.
