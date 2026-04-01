# Premium Template System - Complete Guide

## Overview

PromptShip's premium template system transforms the platform from a simple prompt library into a **premium template marketplace** like MotionSites and DesignRocket.

### Key Features

✅ **Detailed Template Specifications** - Markdown-based templates with exact technical specs  
✅ **Visual Previews** - Thumbnail images, preview images, and video backgrounds  
✅ **Technical Metadata** - Fonts, colors, animations, dependencies, assets  
✅ **AI-Powered Generation** - Enhanced AI generation using detailed specifications  
✅ **Multi-Framework Support** - React, Vue, Flutter, HTML  
✅ **Premium Tiers** - Free, Starter, Pro, Team templates  

---

## Architecture

### Database Schema

**Enhanced `prompts` table** with premium fields:

```typescript
{
  // Basic fields
  id, title, slug, description, promptText
  
  // Premium template fields
  detailedPrompt: text           // Full markdown specification
  templateType: 'simple' | 'detailed' | 'premium'
  previewImageUrl: text          // Main preview image
  previewVideoUrl: text          // Video background/demo
  thumbnailUrl: text             // Grid view thumbnail
  
  // Technical specifications (JSONB)
  technicalSpecs: {
    fonts: { name, weights, url }[]
    colors: { name, hsl, usage }[]
    animations: { name, keyframes, usage }[]
    dependencies: { name, version, required }[]
    assets: { type, url, description }[]
  }
  
  // Layout metadata (JSONB)
  layoutMetadata: {
    sections: string[]           // ['navigation', 'hero', 'footer']
    components: string[]         // ['Button', 'Card', 'Modal']
    complexity: 'simple' | 'medium' | 'complex'
    responsive: boolean
    darkMode: boolean
  }
  
  // Flags
  isPremium: boolean             // Premium badge
  isFeatured: boolean            // Featured on homepage
}
```

### File Structure

```
promptship/
├── templates/                  # Markdown template files
│   ├── README.md              # Template format guide
│   ├── hero-velorah-cinematic.md
│   ├── landing-saas-gradient.md
│   └── dashboard-analytics-dark.md
│
├── src/
│   ├── lib/
│   │   ├── db/schema.ts       # Enhanced schema with premium fields
│   │   └── ai/providers/
│   │       ├── claude.ts      # Base Claude integration
│   │       └── template-generator.ts  # Template-based generation
│   │
│   └── components/
│       ├── prompts/
│       │   ├── TemplateCard.tsx       # Grid view card
│       │   ├── TemplatePreview.tsx    # Full preview modal
│       │   └── TemplateFilters.tsx    # Filter by complexity, tier
│       │
│       └── generator/
│           └── TemplateCodeGen.tsx    # AI generation UI
│
└── scripts/
    └── seed-templates.ts      # Seed templates from markdown
```

---

## Creating Templates

### Step 1: Create Markdown File

Create a new file in `/templates/` directory:

```bash
touch templates/hero-your-template.md
```

### Step 2: Add Frontmatter + Content

```markdown
---
title: "Your Template Name"
slug: "your-template-slug"
category: "hero"
description: "Short description for grid view"
tier: "premium"
frameworks: ["react", "vue", "html"]
isPremium: true
isFeatured: false
thumbnailUrl: "/templates/your-thumb.jpg"
previewImageUrl: "/templates/your-preview.jpg"
previewVideoUrl: "https://cdn.example.com/video.mp4"

technicalSpecs:
  fonts:
    - name: "Inter"
      weights: [400, 500, 700]
      url: "https://fonts.google.com/specimen/Inter"
  
  colors:
    - name: "background"
      hsl: "222 47% 11%"
      usage: "Dark background"
    - name: "primary"
      hsl: "217 91% 60%"
      usage: "Primary actions"
  
  animations:
    - name: "fade-in"
      keyframes: "from { opacity: 0; } to { opacity: 1; }"
      usage: "Element entrance"
  
  dependencies:
    - name: "react"
      version: "^19.0.0"
      required: true
    - name: "framer-motion"
      version: "^12.0.0"
      required: false
  
  assets:
    - type: "video"
      url: "https://cdn.example.com/bg.mp4"
      description: "Background video"

layoutMetadata:
  sections: ["navigation", "hero", "features"]
  components: ["Navbar", "Hero", "Button", "Card"]
  complexity: "medium"
  responsive: true
  darkMode: true
---

# Your Template Name

Detailed specification goes here...

## Section 1

Exact specifications with:
- Class names: `text-3xl font-bold`
- Colors: `hsl(222 47% 11%)`
- Spacing: `px-8 py-6`
- Animations: `animate-fade-in`

## Section 2

More detailed specs...
```

### Step 3: Seed to Database

```bash
pnpm db:seed-templates
```

---

## AI Generation Flow

### 1. User Selects Template

User browses templates and clicks "Generate Code"

### 2. Enhanced Prompt Building

The system builds an enhanced prompt:

```typescript
import { generateFromTemplate } from '@/lib/ai/providers/template-generator';

const result = await generateFromTemplate(template, {
  framework: 'react',
  includeComments: true,
  useTailwind: true,
  useTypeScript: true,
});
```

### 3. Prompt Enhancement

The `template-generator` enhances the prompt with:

- ✅ Detailed markdown specification
- ✅ Technical specs (fonts, colors, animations)
- ✅ Layout metadata (sections, components)
- ✅ Framework-specific instructions
- ✅ Dependency requirements
- ✅ Asset URLs

### 4. AI Generation

Claude receives the enhanced prompt and generates:

```typescript
{
  code: "// Production-ready React component...",
  framework: "react",
  dependencies: ["react@^19.0.0", "framer-motion@^12.0.0"],
  instructions: "Install dependencies:\npnpm add react framer-motion",
  technicalSpecs: { /* original specs */ },
  tokensInput: 2500,
  tokensOutput: 1800,
  model: "claude-sonnet-4"
}
```

---

## Template Categories

| Category | Description | Examples |
|----------|-------------|----------|
| `hero` | Hero sections | Cinematic hero, gradient hero, video hero |
| `landing` | Full landing pages | SaaS landing, product landing, agency landing |
| `dashboard` | Dashboard layouts | Analytics dashboard, admin panel, metrics |
| `auth` | Authentication | Login, signup, forgot password |
| `pricing` | Pricing sections | Tiered pricing, comparison table, toggle |
| `features` | Feature showcases | Grid features, timeline, comparison |
| `testimonials` | Social proof | Carousel, grid, video testimonials |
| `footer` | Footer components | Multi-column, minimal, newsletter |
| `navigation` | Navigation bars | Transparent, solid, mega menu |

---

## Tier System

| Tier | Access | Features |
|------|--------|----------|
| **Free** | All users | Basic templates, simple prompts |
| **Starter** | Paid plan | Detailed templates, technical specs |
| **Pro** | Pro plan | Premium templates, multi-framework |
| **Team** | Team plan | Advanced templates, priority support |

---

## Best Practices

### 1. Be Extremely Specific

❌ **Bad**: "Make it look modern"  
✅ **Good**: "`text-5xl font-bold tracking-tight leading-[1.1]`"

### 2. Include All Assets

```markdown
assets:
  - type: "video"
    url: "https://d8j0ntlcm91z4.cloudfront.net/video.mp4"
    description: "Fullscreen looping background video"
  - type: "image"
    url: "https://cdn.example.com/hero-bg.jpg"
    description: "Fallback background image"
```

### 3. Specify Exact Colors

Use HSL format for Tailwind CSS variables:

```markdown
colors:
  - name: "background"
    hsl: "201 100% 13%"
    usage: "Deep navy blue base"
```

### 4. Define Animations

Include full keyframe definitions:

```markdown
animations:
  - name: "fade-rise"
    keyframes: "from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); }"
    usage: "Entrance animation for hero elements"
```

### 5. List Dependencies

```markdown
dependencies:
  - name: "framer-motion"
    version: "^12.0.0"
    required: false  # Optional enhancement
```

---

## Usage Examples

### Example 1: Generate from Template

```typescript
import { db } from '@/lib/db';
import { generateFromTemplate } from '@/lib/ai/providers/template-generator';

// Fetch template
const template = await db.query.prompts.findFirst({
  where: eq(prompts.slug, 'velorah-cinematic-hero'),
});

// Generate React code
const result = await generateFromTemplate(template, {
  framework: 'react',
  includeComments: true,
  useTailwind: true,
  useTypeScript: true,
});

console.log(result.code);
console.log(result.dependencies);
console.log(result.instructions);
```

### Example 2: Multi-Framework Generation

```typescript
import { generateMultiFramework } from '@/lib/ai/providers/template-generator';

// Generate for all frameworks
const results = await generateMultiFramework(template, [
  'react',
  'vue',
  'html',
]);

console.log(results.react.code);
console.log(results.vue.code);
console.log(results.html.code);
```

---

## Migration Path

### Phase 1: Database Migration

```bash
# Generate migration
pnpm db:generate

# Apply to development
pnpm db:migrate

# Apply to staging
pnpm db:migrate:staging

# Apply to production
pnpm db:migrate:production
```

### Phase 2: Seed Templates

```bash
# Seed development
pnpm db:seed-templates

# Seed staging
pnpm db:seed-templates:staging

# Seed production
pnpm db:seed-templates:production
```

### Phase 3: Update UI

1. Update template cards to show previews
2. Add template filters (complexity, tier, framework)
3. Implement template preview modal
4. Update code generation UI

---

## API Endpoints

### Get Premium Templates

```typescript
// GET /api/templates?tier=premium&category=hero
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tier = searchParams.get('tier');
  const category = searchParams.get('category');
  
  const templates = await db.query.prompts.findMany({
    where: and(
      eq(prompts.isPremium, true),
      tier ? eq(prompts.tier, tier) : undefined,
      category ? eq(prompts.categoryId, category) : undefined
    ),
  });
  
  return NextResponse.json({ templates });
}
```

### Generate from Template

```typescript
// POST /api/generate/template
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { templateId, framework } = await req.json();
  
  const template = await db.query.prompts.findFirst({
    where: eq(prompts.id, templateId),
  });
  
  const result = await generateFromTemplate(template, { framework });
  
  return NextResponse.json(result);
}
```

---

## Roadmap

### v1.0 (Current)
- ✅ Enhanced database schema
- ✅ Markdown template format
- ✅ Template seeding script
- ✅ AI generation with technical specs

### v1.1 (Next)
- [ ] Template preview components
- [ ] Template filters and search
- [ ] Multi-framework generation UI
- [ ] Template analytics

### v2.0 (Future)
- [ ] User-submitted templates
- [ ] Template marketplace
- [ ] Template versioning
- [ ] A/B testing for templates

---

## Support

For questions or issues:
1. Check `/templates/README.md` for template format
2. Review example templates in `/templates/`
3. See `AGENTS.md` for architecture constraints
4. Run `/architecture-review` to validate changes

---

**Last Updated**: 2026-04-01  
**Version**: 1.0.0
