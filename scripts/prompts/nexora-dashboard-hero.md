Create a SaaS landing page hero section with the following exact specifications:

Page Layout: h-screen flex flex-col bg-background overflow-hidden — Navbar + Hero fill exactly 100vh with no scroll. Two Google Fonts: Instrument Serif (display/headings, including italic) and Inter (body text).

Fonts & Design Tokens (index.css):
--background: 0 0% 100% (white)
--foreground: 210 14% 17% (dark charcoal)
--primary: 210 14% 17% / --primary-foreground: 0 0% 100%
--secondary: 0 0% 96% / --secondary-foreground: 0 0% 9%
--muted: 0 0% 96% / --muted-foreground: 184 5% 55%
--accent: 239 84% 67% (indigo/blue) / --accent-foreground: 0 0% 100%
--border: 0 0% 90%
--ring: 239 84% 67%
--shadow-dashboard: 0 25px 80px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.06)

Navbar: flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 font-body. Left: Logo "✦ Nexora" text-xl font-semibold. Right: Nav links "Home", "Pricing", "About", "Contact" text-sm text-muted-foreground. CTA button: rounded-full px-5 text-sm font-medium.

Hero Section:
Background Video: Fullscreen muted autoplay loop, absolute inset-0 w-full h-full object-cover z-0
Video URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4

Content (relative z-10 flex flex-col items-center):
1. Badge: Framer Motion fade up, inline-flex rounded-full border bg-background px-4 py-1.5 text-sm — "Now with GPT-5 support ✨"
2. Headline: text-5xl md:text-6xl lg:text-[5rem] leading-[0.95] tracking-tight — "The Future of Smarter Automation" with "Smarter" in Instrument Serif italic
3. Subheadline: mt-4 text-base md:text-lg text-muted-foreground max-w-[650px] leading-relaxed
4. CTA Buttons: Primary "Book a demo" rounded-full px-6 py-5 + Play button ghost h-11 w-11 rounded-full
5. Dashboard Preview (coded in React, NOT an image):
   - Frosted glass wrapper: rounded-2xl p-3 md:p-4, background rgba(255,255,255,0.4), border 1px solid rgba(255,255,255,0.5)
   - Top bar: Logo "N" + "Nexora" + search bar with ⌘K + "Move Money" + bell + avatar
   - Sidebar (w-40): Home (active), Tasks (badge "10"), Transactions, Payments, Cards, Capital, Accounts
   - Main content: "Welcome, Jane" greeting, action buttons (Send, Request, Transfer, etc.)
   - Balance card: $8,450,190.32, SVG area chart with smooth Bézier curve
   - Accounts card: Credit $98,125.50, Treasury $6,750,200.00, Operations $1,592,864.82
   - Transactions table: 4 rows with Date/Description/Amount/Status

Animations: Framer Motion staggered fade-up (badge 0s, headline 0.1s, subtitle 0.2s, buttons 0.3s, dashboard 0.5s).

Dependencies: framer-motion, lucide-react, shadcn/ui Button, tailwindcss-animate.
