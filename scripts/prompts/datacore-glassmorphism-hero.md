Create a responsive, full-screen hero section for a web application using React and Tailwind CSS.

Design System & Assets:
Fonts: 'Manrope' (UI/Nav), 'Cabin' (buttons/tags), 'Instrument Serif' (headlines), 'Inter' (body).
Primary Color: Purple #7b39fc. Secondary: Dark Purple #2b2344.
Background: Full-screen absolute HTML5 video, autoplay loop mute playsInline. min-h-screen object-cover, no overlay (opaque).
Video URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4

1. Navbar (Top Overlay):
Full width, transparent, z-20, px-6 to px-[120px], py-[16px].
Logo (Left): White SVG path (Future logo shape).
Nav Links (Center-Left, Desktop Only): "Home", "Services" (ChevronDown), "Reviews", "Contact us" — Manrope Medium 14px, white, hover opacity-80.
Action Buttons (Right, Desktop): "Sign In" (white bg, #d4d4d4 border, #171717 text) + "Get Started" (#7b39fc bg, white text, subtle shadow).
Mobile: hamburger menu → full-screen black overlay.

2. Hero Content (Centered):
Container: flex-col items-center text-center, z-10, mt-32.
Tagline Pill: Glassmorphism (bg-[rgba(85,80,110,0.4)], backdrop-blur, border rgba(164,132,215,0.5)). Rounded 10px, h-38px. Inner badge (#7b39fc bg) "New" + "Say Hello to Datacore v3.2" — Cabin Medium 14px white.
Headline: "Book your perfect stay instantly and hassle-free" — Instrument Serif, white, 5xl to 96px. Word "and" italicized with spacing.
Subtext: "Discover handpicked hotels, resorts, and stays across your favorite destinations. Enjoy exclusive deals, fast booking, and 24/7 support." — Inter Normal 18px, white/70, max-w-662px.

CTA Buttons (Row):
"Book a Free Demo" — #7b39fc, rounded 10px, Cabin Medium 16px, white.
"Get Started Now" — #2b2344, rounded 10px, Cabin Medium 16px, #f6f7f9.
Hover: slightly lighten backgrounds.

Four corner accents: 7px x 7px solid white squares at four corners of hero content container.
