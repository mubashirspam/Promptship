Recreate Project Estimation Calculator Section

Full-width dark calculator section with id calculator-section. bg-background, py-16 md:py-28 px-4 md:px-16, max-w-7xl centered.

Header: Centered. Small mono uppercase tracking-widest label "Try project estimation calculator" in text-muted-foreground. h2: "Get premium website within your budget" text-3xl md:text-4xl lg:text-5xl font-normal.

Layout: 2-column grid (grid-cols-1 lg:grid-cols-2), rounded-2xl overflow-hidden.

LEFT COLUMN (Calculator Form): bg-#0D0D0D, p-8 lg:p-12, sections divided by divide-y divide-[#1E1E1E].

4 sections:
1. Service Type (radio buttons): "What kind of service do you need?" — "Only Design", "Only Development", "Design + Development" (default). Custom radios: w-5 h-5 rounded-full border-2, active = border-[#FF5656] with inner w-2 h-2 bg-[#FF5656].

2. Number of Pages (slider): h3 with current value in #FF5656. Shadcn Slider min=1 max=30 step=1 default=5. Labels "1" and "30".

3. Add-ons (checkboxes): "I will need help with content" (+$50/pages), "I want to optimize my website for SEO" (+$50/pages). Custom checkboxes: w-5 h-5 border-2 rounded, checked = border-[#FF5656] bg-[#FF5656] with white checkmark.

4. Timeline (radio buttons): "How fast do you need this?" — "Within 7 Days" (+$100/pages), "Within 14 Days" (+$25/pages), "Regular Speed" (no extra, default).

RIGHT COLUMN (Cost Estimation): p-8 lg:p-12, border border-white/10 rounded-r-2xl, min-h-717.98px.

h3 "Estimated Cost" + description.

3 stacked cards (rounded-2xl p-6):
- Agency card: bg-muted/50. "Typical Agency charges minimum" + large price + "+ Too much extra time & additional cost"
- Freelancer card: bg-muted/50. "Regular Freelancer charges minimum" + price + "+ Too much headache & back-and-forth"
- Your price card: bg-gradient-to-r from-pink-500 to-orange-500 text-white. "With Webfluin Studio" + price text-5xl + "Save your money, time & headache"

PRICING LOGIC:
calculatePrice(): Base by service (design: 399+100/page, development: 199+100/page, both: 499+200/page). total = max(base, base + (pages-1) * perPage). Add-ons: content +$50/page, SEO +$50/page. Timeline: rush +$100/page, fast +$25/page.
calculateAgencyCost(): 8000 + (pages-1) * (both ? 1000 : 400).
calculateFreelancerCost(): 3000 + (pages-1) * (both ? 500 : 200).

All prices with .toLocaleString() and $ prefix.

State: serviceType (default "both"), pages (default 5), needContent (bool), needSEO (bool), timeline (default "regular").
Dependencies: Shadcn Slider, useToast.
