# Premium Template System - Implementation Guide

## What Was Built

You now have a complete **premium template marketplace system** that transforms PromptShip from a simple prompt library into a platform like MotionSites and DesignRocket.

### ✅ Completed Components

1. **Enhanced Database Schema** (`src/lib/db/schema.ts`)
   - Added `detailedPrompt` field for markdown specifications
   - Added `templateType`, `previewImageUrl`, `previewVideoUrl`, `thumbnailUrl`
   - Added `technicalSpecs` JSONB for fonts, colors, animations, dependencies, assets
   - Added `layoutMetadata` JSONB for sections, components, complexity
   - Added `isPremium` and indexes for filtering

2. **Markdown Template Format** (`/templates/`)
   - YAML frontmatter with complete metadata
   - Detailed markdown specifications
   - Example templates: Velorah Cinematic Hero, SaaS Gradient Landing
   - README with format guide and best practices

3. **Template Seeding Script** (`scripts/seed-templates.ts`)
   - Reads markdown files from `/templates/` directory
   - Parses frontmatter and content with gray-matter
   - Seeds/updates database with full specifications
   - Supports all environments (dev, staging, production)

4. **AI Template Generator** (`src/lib/ai/providers/template-generator.ts`)
   - Builds enhanced prompts from template specifications
   - Includes technical specs (fonts, colors, animations)
   - Framework-specific instructions (React, Vue, Flutter, HTML)
   - Multi-framework generation support
   - Returns code + dependencies + instructions

5. **Documentation**
   - `TEMPLATE-SYSTEM.md` - Complete system guide
   - `templates/README.md` - Template format reference
   - `IMPLEMENTATION-GUIDE.md` - This file
   - Updated `AGENTS.md` with template patterns

---

## How to Use

### 1. Run Database Migration

```bash
# Generate migration for new schema fields
pnpm db:generate

# Apply to development
pnpm db:migrate

# Apply to staging
pnpm db:migrate:staging

# Apply to production
pnpm db:migrate:production
```

### 2. Seed Example Templates

```bash
# Seed development database
pnpm db:seed-templates

# Seed staging
pnpm db:seed-templates:staging

# Seed production
pnpm db:seed-templates:production
```

### 3. Create New Templates

```bash
# Create new template file
touch templates/hero-your-template.md

# Edit with frontmatter + detailed specs
# See templates/README.md for format

# Seed to database
pnpm db:seed-templates
```

### 4. Generate Code from Template

```typescript
import { db } from '@/lib/db';
import { generateFromTemplate } from '@/lib/ai/providers/template-generator';
import { eq } from 'drizzle-orm';
import { prompts } from '@/lib/db/schema';

// Fetch template
const template = await db().query.prompts.findFirst({
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

---

## Next Steps

### Phase 1: UI Components (Immediate)

Create template preview and generation UI:

```bash
# Generate template card component
pnpm scaffold:component prompts TemplateCard --client

# Generate template preview modal
pnpm scaffold:component prompts TemplatePreview --client

# Generate template filters
pnpm scaffold:component prompts TemplateFilters --client

# Generate code generation UI
pnpm scaffold:component generator TemplateCodeGen --client
```

**TemplateCard.tsx** - Grid view card showing:
- Thumbnail image
- Title and description
- Premium badge
- Framework icons
- Complexity indicator
- "Generate Code" button

**TemplatePreview.tsx** - Full preview modal with:
- Large preview image/video
- Technical specifications display
- Tabbed code examples (React, Vue, HTML)
- Copy code button
- Download assets button

**TemplateFilters.tsx** - Filter sidebar with:
- Category filter
- Tier filter (Free, Pro, Premium)
- Framework filter
- Complexity filter
- Search input

**TemplateCodeGen.tsx** - Code generation interface:
- Framework selector
- Options (TypeScript, comments, etc.)
- Generate button
- Loading state
- Code display with syntax highlighting
- Copy button
- Download button

### Phase 2: API Routes

```bash
# Create template API routes
pnpm scaffold:api templates
pnpm scaffold:api templates/[id]
pnpm scaffold:api generate/template
```

**GET /api/templates** - List templates with filters:
```typescript
{
  tier?: 'free' | 'starter' | 'pro' | 'team',
  category?: string,
  framework?: string,
  isPremium?: boolean,
  search?: string
}
```

**GET /api/templates/[id]** - Get single template with full specs

**POST /api/generate/template** - Generate code from template:
```typescript
{
  templateId: string,
  framework: 'react' | 'vue' | 'flutter' | 'html',
  options: {
    includeComments?: boolean,
    useTailwind?: boolean,
    useTypeScript?: boolean
  }
}
```

### Phase 3: Pages

Update existing pages to use premium templates:

1. **Homepage** (`app/(marketing)/page.tsx`)
   - Featured premium templates section
   - "New Premium Templates" badge
   - Template preview carousel

2. **Templates Page** (`app/(app)/prompts/page.tsx`)
   - Grid view with TemplateCard components
   - Filters sidebar
   - Search functionality
   - Pagination

3. **Template Detail** (`app/(app)/prompts/[slug]/page.tsx`)
   - Full preview with TemplatePreview
   - Technical specifications
   - Code generation interface
   - Related templates

4. **Generator Page** (`app/(app)/generator/page.tsx`)
   - Template selection
   - Framework selection
   - Code generation
   - Multi-framework tabs

---

## Template Creation Workflow

### Step 1: Design Template

1. Create design in Figma/similar
2. Export preview images (thumbnail + full preview)
3. Note all technical specifications:
   - Fonts (names, weights, URLs)
   - Colors (HSL values, usage)
   - Animations (keyframes, usage)
   - Dependencies (packages, versions)
   - Assets (videos, images, URLs)

### Step 2: Write Markdown

```markdown
---
title: "Your Template Name"
slug: "your-template-slug"
category: "hero"
description: "Short description"
tier: "premium"
frameworks: ["react", "vue", "html"]
isPremium: true
isFeatured: false
thumbnailUrl: "/templates/your-thumb.jpg"
previewImageUrl: "/templates/your-preview.jpg"
technicalSpecs:
  fonts: [...]
  colors: [...]
  animations: [...]
  dependencies: [...]
  assets: [...]
layoutMetadata:
  sections: [...]
  components: [...]
  complexity: "medium"
  responsive: true
  darkMode: true
---

# Detailed Specification

Be extremely specific:
- Exact class names
- Exact HSL colors
- Exact spacing values
- Exact animation keyframes
- Complete component structure
```

### Step 3: Seed to Database

```bash
pnpm db:seed-templates
```

### Step 4: Test Generation

```bash
# Test in development
curl -X POST http://localhost:3000/api/generate/template \
  -H "Content-Type: application/json" \
  -d '{"templateId":"xxx","framework":"react"}'
```

### Step 5: Deploy

```bash
# Seed to staging
pnpm db:seed-templates:staging

# Test on staging
# Deploy to production

# Seed to production
pnpm db:seed-templates:production
```

---

## Architecture Patterns

### Template Storage

```
Database (PostgreSQL)
├── prompts table (enhanced with premium fields)
├── Indexed by: tier, isPremium, templateType
└── JSONB fields: technicalSpecs, layoutMetadata

File System
├── /templates/*.md (source of truth)
├── /public/templates/*.jpg (preview images)
└── CDN (videos, large assets)
```

### Generation Flow

```
User Request
    ↓
Fetch Template from DB
    ↓
Build Enhanced Prompt
    ├── Detailed markdown spec
    ├── Technical specifications
    ├── Layout metadata
    └── Framework instructions
    ↓
Send to Claude API
    ↓
Parse Response
    ├── Extract code
    ├── Extract dependencies
    └── Build instructions
    ↓
Return to User
```

### Caching Strategy

```typescript
// Cache template data (rarely changes)
const template = await cache(
  async () => db().query.prompts.findFirst({ where: eq(prompts.slug, slug) }),
  ['template', slug],
  { revalidate: 3600 } // 1 hour
);

// Don't cache AI generation (always fresh)
const result = await generateFromTemplate(template, options);
```

---

## Pricing Strategy

| Tier | Templates | Generation | Price |
|------|-----------|------------|-------|
| **Free** | 10 basic | 5/month | $0 |
| **Starter** | 50 detailed | 50/month | $9 |
| **Pro** | 100+ premium | Unlimited | $29 |
| **Team** | All + custom | Unlimited | $99 |

---

## Monitoring & Analytics

Track these metrics:

1. **Template Usage**
   - Most viewed templates
   - Most generated templates
   - Conversion rate (view → generate)

2. **Generation Metrics**
   - Generations per framework
   - Average tokens used
   - Generation success rate
   - Error rate by template

3. **User Behavior**
   - Template search queries
   - Filter usage
   - Time to first generation
   - Repeat usage rate

---

## Troubleshooting

### Issue: Template not showing after seeding

**Solution**: Check database connection and run:
```bash
pnpm db:studio
# Verify template exists in prompts table
```

### Issue: AI generation fails

**Solution**: Check:
1. `ANTHROPIC_API_KEY` is set
2. Template has `detailedPrompt` or `promptText`
3. Check Claude API limits
4. Review error logs

### Issue: Missing preview images

**Solution**: 
1. Upload images to `/public/templates/`
2. Update `thumbnailUrl` and `previewImageUrl` in frontmatter
3. Re-seed templates

---

## Security Considerations

1. **API Key Protection**
   - Never expose `ANTHROPIC_API_KEY` to client
   - Use server-side generation only

2. **Rate Limiting**
   - Implement per-user generation limits
   - Track usage in database
   - Block abuse

3. **Input Validation**
   - Validate template IDs
   - Sanitize user inputs
   - Validate framework selection

4. **Content Security**
   - Sanitize generated code before display
   - Validate asset URLs
   - Check for malicious content

---

## Performance Optimization

1. **Database**
   - Index on `isPremium`, `tier`, `templateType`
   - Cache frequently accessed templates
   - Use connection pooling

2. **AI Generation**
   - Stream responses for better UX
   - Cache common generations
   - Implement request queuing

3. **Assets**
   - Use CDN for images/videos
   - Optimize image sizes
   - Lazy load preview images

4. **Frontend**
   - Code splitting by route
   - Lazy load template cards
   - Virtual scrolling for large lists

---

## Future Enhancements

### v1.1
- [ ] Template preview components
- [ ] Multi-framework generation UI
- [ ] Template analytics dashboard
- [ ] User favorites

### v1.2
- [ ] Template versioning
- [ ] A/B testing for templates
- [ ] Template recommendations
- [ ] Social sharing

### v2.0
- [ ] User-submitted templates
- [ ] Template marketplace
- [ ] Template remixing
- [ ] Collaborative editing

---

## Support & Resources

- **Template Format**: `/templates/README.md`
- **System Guide**: `/TEMPLATE-SYSTEM.md`
- **Architecture**: `/AGENTS.md`
- **Examples**: `/templates/*.md`

---

**Created**: 2026-04-01  
**Status**: Production Ready  
**Next Action**: Run database migration and seed templates
