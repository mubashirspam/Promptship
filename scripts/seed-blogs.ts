import { neon } from '@neondatabase/serverless';

/**
 * Seed the three launch blog posts (modern-UI SEO content).
 *   pnpm exec tsx --env-file=.env.local scripts/seed-blogs.ts [production]
 * Idempotent: skips a post if its slug already exists.
 */

const target = process.argv[2];
const url =
  target === 'production'
    ? process.env.DATABASE_URL_PRODUCTION
    : process.env.DATABASE_URL;

const posts = [
  {
    title: '3D UI Design in 2026: Depth, Motion and Realism Without Killing Performance',
    slug: '3d-ui-design-trends-2026',
    category: 'Design Trends',
    tags: ['3d ui', 'ui design', 'web design trends', 'figma', 'promtify'],
    excerpt:
      'Layered depth, soft shadows, interactive 3D objects and scroll-driven motion define modern interfaces. Here is how to design 3D UI that feels premium — and ship it fast with ready-made templates from Promtify.',
    content: `Flat design had a great decade. But open any award-winning site in 2026 and you'll see the same thing: **depth is back**. Floating cards, soft layered shadows, interactive 3D objects, glass panels catching light — modern UI feels physical again.

The catch? 3D UI is easy to do badly. This guide covers what actually works, and how to skip the hard part entirely with production-ready templates from [Promtify](https://promtify.dev).

## What "3D UI" really means today

Nobody is shipping full WebGL scenes for a pricing page. Modern 3D UI is about **perceived depth**, built from cheap, fast ingredients:

- **Layering** — overlapping cards, sticky sections and z-depth that make a page feel like a stack of surfaces, not a flat document.
- **Soft, colored shadows** — not the gray \`box-shadow\` of 2015, but large, blurred, tinted glows that make elements float.
- **Subtle parallax and scroll-driven motion** — backgrounds moving slower than content, elements scaling into place as you scroll.
- **Selective real 3D** — one hero object (a phone mockup, an abstract shape) rendered in Spline or Three.js, not a whole 3D world.
- **Light behavior** — gradients and highlights that imply a light source, which is where glassmorphism (see our [glassmorphism guide](/blog/glassmorphism-ui-guide)) fits in.

## The rules that keep 3D UI premium

**1. One focal depth moment per screen.** If everything floats, nothing floats. Pick the hero card, the pricing table, the product shot — give it the depth treatment and keep everything else calm.

**2. Respect performance budgets.** Blur and shadow are GPU-expensive. Prefer \`transform\` and \`opacity\` animations, limit \`backdrop-filter\` layers, and lazy-load any real 3D. A 3D hero that costs you two seconds of load time costs you the visitor.

**3. Keep text on solid ground.** Depth belongs to containers and decoration. Body text should always sit on a high-contrast, stable surface — accessibility first, always.

**4. Motion must have physics.** Ease-out curves, small overshoots, scroll-linked progress — motion that implies weight sells the 3D illusion. Linear tweens break it instantly.

## The fast way: start from a 3D-ready template

Here's the honest truth — building layered 3D interfaces from scratch takes days of shadow-tuning and easing tweaks. This is exactly why we built [Promtify](https://promtify.dev): a library of **400+ templates and components** where that polish is already done.

- **Figma Kits** with layered, auto-layout 3D-style screens you can duplicate and re-brand in minutes.
- **AI Prompts** — battle-tested markdown prompts that make Claude, Cursor or v0 generate deep, layered UI (shadows, parallax, motion included) in one shot.
- **Code Starters** — downloadable React, Next.js and Flutter source with scroll-driven 3D effects already implemented and performance-tested.

Every template on Promtify is tagged by platform (web or mobile) and scope (full site or single component), so you can grab just a floating hero section — or an entire 3D-styled landing page.

## Ship depth this week, not this quarter

3D UI in 2026 is a craft of restraint: one hero depth moment, soft tinted shadows, physical motion, fast load. You can learn that craft over months of iteration — or start from templates where it's baked in.

Browse the full library free at [promtify.dev](https://promtify.dev). Every template can be previewed before you buy, and one lifetime-style payment unlocks the whole kind — no subscriptions. See [plans and pricing](https://promtify.dev/pricing).`,
  },
  {
    title: 'Glassmorphism UI: The Complete 2026 Guide (With Copy-Paste Techniques)',
    slug: 'glassmorphism-ui-guide',
    category: 'Tutorial',
    tags: ['glassmorphism', 'ui design', 'css', 'design trends', 'promtify'],
    excerpt:
      'Frosted glass panels, blurred backdrops and glowing borders — glassmorphism is the defining look of modern SaaS. Learn the exact recipe, the accessibility rules, and where to get glassmorphic templates ready to ship on Promtify.',
    content: `Frosted panels over glowing gradients. Borders that catch the light. Content that seems to hover above the page. **Glassmorphism** went from an Apple keynote aesthetic to the default language of modern SaaS — and in 2026 it's everywhere from dashboards to pricing pages.

This is the complete recipe, plus the shortcuts: every technique below already exists as ready-to-use templates on [Promtify](https://promtify.dev).

## The glass recipe

Real glassmorphism is four ingredients, always together:

\`\`\`css
.glass-card {
  background: rgba(255, 255, 255, 0.05);   /* near-transparent fill */
  backdrop-filter: blur(16px);              /* the frost */
  border: 1px solid rgba(255, 255, 255, 0.1); /* light-catching edge */
  border-radius: 24px;                      /* soft, modern geometry */
}
\`\`\`

Miss any one of them and the effect collapses: no blur = just a transparent box; no border = a smudge; no radius = a frosted brick.

## What makes glass look expensive

**1. Something behind the glass.** Frost is only visible when there's color to diffuse. The classic move: large, blurred gradient "blobs" (pink, purple, indigo) drifting behind your panels. This is exactly how the [Promtify pricing page](https://promtify.dev/pricing) is built.

**2. Layered opacity levels.** Use 3–5% white for resting cards, 8–10% for hover and active states. That tiny delta is what makes glass UI feel interactive.

**3. Glowing accents for hierarchy.** The highlighted card in a set (your best-selling plan, the active nav item) gets a colored border and a soft outer glow — for example \`box-shadow: 0 0 50px -12px rgba(168, 85, 247, 0.4)\`.

**4. Grain and grids for depth.** A faint 1px grid or noise texture behind everything stops large dark areas from feeling empty.

## The rules you can't break

- **Contrast is non-negotiable.** Text on glass must still hit WCAG ratios — keep body text white/near-white on dark glass, and test with the blur disabled (some browsers and low-power modes skip \`backdrop-filter\`).
- **Budget your blur.** Every blurred layer re-renders on scroll. A page of 30 glass cards will stutter on mid-range phones. Blur containers, not every child.
- **Dark first.** Glassmorphism is dramatically easier on dark backgrounds — light-mode glass needs stronger borders and shadows to read at all.

## Skip the tuning: glassmorphic templates on Promtify

Getting glass *right* — the blob positions, the exact opacities, the hover states, the fallbacks — is hours of tweaking. The [Promtify](https://promtify.dev) library has it pre-tuned across all three template kinds:

- **Figma Kits**: glassmorphic dashboards, pricing sections, auth screens and full site kits with every blur and border as editable styles.
- **AI Prompts**: prompts engineered to make AI tools output correct glassmorphism (they specify the full recipe, so you never get the "transparent gray box" failure).
- **Code Starters**: React and Next.js components with performant, accessibility-checked glass — download the zip and ship.

Free templates are usable by everyone with no account limits, and the [Basic plan](https://promtify.dev/pricing) unlocks every Figma Kit for a single one-time payment.

## Glass, done right, in an afternoon

Glassmorphism rewards precision: the right blur radius, a real light source, disciplined contrast. Study the recipe above — or start from a template where a designer already obsessed over it. Browse 400+ of them free at [promtify.dev](https://promtify.dev).`,
  },
  {
    title: 'Why Smart Teams Buy UI Templates (And How to Choose the Right One)',
    slug: 'why-buy-ui-templates',
    category: 'Guide',
    tags: ['ui templates', 'figma templates', 'code templates', 'productivity', 'promtify'],
    excerpt:
      'Building every screen from scratch is the most expensive habit in product development. Here is the real math on buying templates, what separates great ones from junk, and how Promtify’s pay-once model changes the economics.',
    content: `Every product team eventually does the math. A polished landing page takes a good developer 3–5 days from blank file. A dashboard, a week. An auth flow with all its states — days more. At any reasonable rate, **every "simple" screen you build from scratch costs hundreds of dollars** — before a single customer sees it.

Templates flip that math. Here's how to think about it clearly, and how to buy well.

## The real economics

A premium template costs about as much as *20 minutes* of a developer's time — and replaces days of it. But the savings that actually matter are subtler:

- **Decision cost.** A template has already made hundreds of small design decisions (spacing, type scale, empty states, responsive breakpoints). Those decisions are where projects stall.
- **Quality floor.** Battle-tested templates encode best practices — accessibility, dark mode, mobile behavior — that first-draft custom UI usually misses.
- **Momentum.** Shipping a real-looking product in week one changes how stakeholders, users and investors respond to it.

The teams that ship fastest aren't building less — they're **starting further ahead**.

## What separates a great template from junk

Having curated 400+ of them for [Promtify](https://promtify.dev), we reject far more templates than we accept. The filter:

1. **Real structure, not just pretty pixels.** Figma files must use auto-layout and components; code must be idiomatic for its framework — otherwise customizing costs more than building.
2. **Clear scope.** Is it a full site or a single component? A checkout section and a whole e-commerce kit are different purchases. (Every Promtify template is labeled: *Full site / Full app / Component*, web or mobile.)
3. **The right delivery format for your workflow.** Designers need the **Figma Kit**. AI-first builders need the **AI Prompt** to paste into Claude, Cursor or v0. Developers want the **Code Starter** zip. Promtify is organized around exactly these three kinds.
4. **A license you can build a business on.** Unlimited personal and commercial use, client work included.

## Subscription fatigue is real — buy, don't rent

The template industry quietly moved to subscriptions: $15–30 *per month*, forever, whether you ship or not. We think that's backwards. Templates are assets — you should **own** them.

That's the [Promtify pricing model](https://promtify.dev/pricing): **one payment per plan, no renewals**.

- **Basic ($9)** — every Figma Kit in the library
- **Pro ($16)** — adds every AI Prompt
- **Premium ($19)** — the entire library, including all Code Starters, in every framework we support (React, Next.js, Vue, HTML, Flutter, React Native, Kotlin, Swift)

New templates land every week and drop straight into your plan. Prefer to try one first? Any single template can be bought on its own, and the free tier is genuinely usable — browse everything, preview everything, use the free templates with no limits at [promtify.dev](https://promtify.dev).

## How to get the most out of a template

- **Re-brand before you re-build.** Swap fonts, colors and copy first — you'll often find the structure already fits.
- **Steal patterns, not just pages.** A great template is also a reference: how it handles empty states, loading, mobile nav.
- **Pair kinds.** Start from the Figma Kit, then use the matching AI Prompt to generate the implementation — many Promtify templates ship both together.

## Start ahead

Custom UI still has its place — for the screens that differentiate you. For everything else, the smart move is the one senior teams quietly made years ago: start from the best available template and spend your craft where it compounds.

Browse the library free at [promtify.dev](https://promtify.dev) — 400+ Figma Kits, AI Prompts and Code Starters, one price each, yours to ship.`,
  },
];

async function main() {
  if (!url) throw new Error('missing database url');
  const sql = neon(url);

  const [admin] = await sql`SELECT id FROM users WHERE role = 'admin' ORDER BY created_at LIMIT 1`;
  if (!admin) throw new Error('no admin user found to use as author');

  for (const post of posts) {
    const existing = await sql`SELECT id FROM blog_posts WHERE slug = ${post.slug}`;
    if (existing.length > 0) {
      console.log(`SKIP (exists): ${post.slug}`);
      continue;
    }
    await sql`
      INSERT INTO blog_posts (title, slug, excerpt, content, author_id, status, category, tags, published_at)
      VALUES (${post.title}, ${post.slug}, ${post.excerpt}, ${post.content},
              ${admin.id}, 'published', ${post.category}, ${post.tags}, now())
    `;
    console.log(`OK inserted: ${post.slug}`);
  }
  console.log(`✅ blogs seeded on ${target ?? 'staging'}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
