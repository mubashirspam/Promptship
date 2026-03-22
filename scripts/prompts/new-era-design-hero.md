Create a responsive, full-screen Hero section using React and Tailwind CSS.

1. Layout & Positioning:
min-h-screen, dark blue fallback (#21346e). Content aligned to top (not centered), pt-32 mobile / pt-48 desktop. Standard container with horizontal padding.

2. Background Video:
Full-screen, absolute-positioned. autoPlay, loop, muted, playsInline. object-cover.
Video URL: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260206_044704_dd33cb15-c23f-4cfc-aa09-a0465d4dcb54.mp4

3. Typography (Main Headline):
Font Family: Rubik (sans-serif). Bold, Uppercase, White.
Three lines: "NEW ERA" / "OF DESIGN" / "STARTS NOW"
Sizing: text-6xl mobile, text-8xl tablet, text-[100px] desktop.
Line height: 0.98, letter-spacing: -2px to -4px.

4. Custom CTA Button:
Fixed size: 184px wide x 65px high.
Hover: scale-105. Active: scale-95.
Background: SVG element filling button (absolute inset-0). Custom path filled with white.
Text: "GET STARTED" centered. Rubik Bold Uppercase 20px, dark color #161a20.
