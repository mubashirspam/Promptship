Build a dark-themed landing page hero section with a navbar, headline, CTA button, background video with fade-in/out loop, and a logo marquee. Use React + Vite + Tailwind CSS + TypeScript with shadcn/ui. Install @fontsource/geist-sans.

1. Theme & Design Tokens (index.css)
Set up a single dark theme (no light mode toggle). All colors in HSL:
:root {
  --background: 260 87% 3%;
  --foreground: 40 6% 95%;
  --card: 240 6% 9%;
  --card-foreground: 40 6% 95%;
  --popover: 240 6% 9%;
  --popover-foreground: 40 6% 95%;
  --primary: 262 83% 58%;
  --primary-foreground: 0 0% 100%;
  --secondary: 240 4% 16%;
  --secondary-foreground: 40 6% 95%;
  --muted: 240 4% 16%;
  --muted-foreground: 240 5% 65%;
  --accent: 262 83% 58%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 100%;
  --border: 240 4% 20%;
  --input: 240 4% 20%;
  --ring: 262 83% 58%;
  --radius: 0.75rem;
  --hero-heading: 40 10% 96%;
  --hero-sub: 40 6% 82%;
}

Body font: 'Geist Sans', 'Inter', system-ui, sans-serif

2. Liquid Glass Utility (index.css)
Add a .liquid-glass utility class in @layer utilities with backdrop-filter: blur(4px), background: rgba(255,255,255,0.01), background-blend-mode: luminosity, box-shadow: inset 0 1px 1px rgba(255,255,255,0.1), and a ::before pseudo-element gradient border mask.

3. Tailwind Config
Add semantic color tokens mapped to hsl(var(--token)), a hero color group (hero.heading and hero.sub), and a marquee keyframe animation (translateX(0%) to translateX(-50%), 20s linear infinite).

4. Button Variants
In shadcn button.tsx, add two custom variants:
hero: "bg-primary text-primary-foreground rounded-full px-6 py-3 text-base font-medium hover:bg-primary/90"
heroSecondary: "liquid-glass text-foreground rounded-full px-6 py-3 text-base font-normal hover:bg-white/5"

5. Navbar Component
Full-width, py-5 px-8, flex row, justify-between. Left: logo image (32px height). Center: Nav items as plain buttons ("Features" with ChevronDown icon, "Solutions", "Plans", "Learning" with ChevronDown). Right: "Sign Up" button using heroSecondary variant. Below navbar, add a full-width 1px gradient divider.

6. Hero Section
Section with bg-background relative overflow-hidden. Centered content with pt-20 px-4. Headline "Grow": text-[230px] font-normal leading-[1.02] tracking-[-0.024em], font-family 'General Sans', bg-clip-text text-transparent with background-image: linear-gradient(223deg, #E8E8E9 0%, #3A7BBF 104.15%). Subtext: text-hero-sub text-center text-lg leading-8 max-w-md mt-4. CTA Button: heroSecondary variant, text "Schedule a Consult".

7. Social Proof / Video Section
Background Video: autoPlay muted playsInline, absolute inset-0 w-full h-full object-cover, initial opacity 0.
Source URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260308_114720_3dabeb9e-2c39-4907-b747-bc3544e2d5b7.mp4
Fade logic: Use requestAnimationFrame to read currentTime and duration. Fade in over 0.5s at start, fade out over 0.5s at end. On ended, set opacity to 0, wait 100ms, reset currentTime = 0, and play() again.
Gradient overlays: absolute inset-0 bg-gradient-to-b from-background via-transparent to-background

Logo Marquee at max-w-5xl:
Left: text "Relied on by brands / across the globe" in text-foreground/50 text-sm
Right: horizontally scrolling marquee using animate-marquee (20s infinite)
Logos: Vortex, Nimbus, Prysma, Cirrus, Kynder, Halcyn — duplicated for seamless loop. Each logo: liquid-glass w-6 h-6 rounded-lg square with first letter + brand name.

8. Page Composition
Index page renders HeroSection then SocialProofSection sequentially.
