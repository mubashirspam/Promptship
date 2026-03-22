Build a high-fidelity, dark-themed Hero Section using React, Tailwind CSS, and Framer Motion. Background: solid black (#000000).

1. Structure & Layout:
Navbar: Fixed at top with blurred glass effect.
Logo: "Synapse" (font-medium, tracking-tight, white).
Links: Features (active, gradient border), Insights, About, Case Studies (strikethrough), Contact.
CTA: "Get Started for Free" (white/gray gradient button).

Hero Content: Centered text container (z-10, relative).
Badges: Row of 3 glass-effect badges "Integrated with" + Icon.
Headline: "Where Innovation Meets Execution" (Large ~80px, tight tracking, fade-in animation).
Subtext: 2-line description about testing and deployment.
Buttons: "Get Started for Free" (solid black bg, white border) + "Let's Get Connected" (transparent glass style).
Logo Marquee: Static row of grayscale 40% opacity logos at bottom.

2. Background Video:
Source: https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8
Memoized VideoPlayer component using hls.js for .m3u8 stream. Proper cleanup on unmount.
100% Opacity (no dark overlays), loop/muted/autoplay.
Video container: height 80vh, absolute bottom-[35vh], floating behind text.

3. Animations:
motion/react: staggered fade-in-up for badges, headline, subtitle, and buttons on load.
