Create a high-fidelity, dark-mode Hero section for a SaaS product called "ClearInvoice" using React and Tailwind CSS.

Tech Stack: React (Vite), Tailwind CSS, motion/react (Framer Motion), lucide-react, hls.js for video streaming. Do NOT use react-player.

1. Background Video:
Source: https://stream.mux.com/hUT6X11m1Vkw1QMxPOLgI761x2cfpi9bHFbi5cNg4014.m3u8
Autoplay, Loop, Muted, PlaysInline. 100% opacity, no dark overlay.
Memoized BackgroundVideo component using hls.js natively. Clean up on unmount. Z-index: -z-10.

2. Layout & Styling:
Font Family: Headings: "Switzer" (Medium, tight tracking). Body: "Geist" (clean, legible).
Top Bar: 5px high gradient bar — from-[#ccf] via-[#e7d04c] to-[#31fb78].
Navbar: Logo left, links (Features, Pricing, Reviews) center, auth buttons (Sign In, Sign Up) right. Mobile: hamburger with full-width dropdown.

3. Hero Content:
Headline: "Manage your online store while save 3x operating cost" (text-6xl, tight leading).
Subhead: "ClearInvoice takes the hassle out of billing with easy-to-use tools." (white/90).
Animations: motion/react stagger entrance (Fade Up + Slide) for Text, Buttons, Social Proof.

4. Button Styles:
Primary: Gradient from-[#FF3300] to-[#EE7926]. Glow: absolute bg-orange-600 blur-lg opacity-20. Inner stroke: 1.5px border-white/20. Hover: scale 1.05, glow opacity-60, Arrow slides in.
Secondary: bg-white/90 backdrop blur. Inner stroke: 1.5px border-black/5. Hover: scale 1.05, solid white.

5. Social Proof:
Row of 3 overlapping user avatars. Text: "Trusted by 210k+ stores worldwide".
