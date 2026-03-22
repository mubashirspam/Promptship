import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/lib/db/schema';

async function seed() {
  const env = (process.env.NODE_ENV as string) || 'development';

  let databaseUrl: string | undefined;
  if (env === 'production') {
    databaseUrl = process.env.DATABASE_URL_PRODUCTION;
  } else if (env === 'staging') {
    databaseUrl = process.env.DATABASE_URL_STAGING;
  } else {
    databaseUrl = process.env.DATABASE_URL;
  }

  if (!databaseUrl) {
    throw new Error(`DATABASE_URL not found for environment: ${env}`);
  }

  console.log(`Seeding ${env.toUpperCase()} database...`);

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  // ─── Categories ──────────────────────────────────────────────
  console.log('Creating categories...');

  const categoriesData = [
    {
      name: 'Landing Pages',
      slug: 'landing-pages',
      description:
        'Hero sections, SaaS pages, and marketing landing pages that convert.',
      icon: 'Rocket',
      displayOrder: 1,
    },
    {
      name: 'Dashboards',
      slug: 'dashboards',
      description:
        'Analytics dashboards, admin panels, and data-rich interfaces.',
      icon: 'LayoutDashboard',
      displayOrder: 2,
    },
    {
      name: 'Authentication',
      slug: 'authentication',
      description:
        'Login, signup, and authentication flow pages with social providers.',
      icon: 'Shield',
      displayOrder: 3,
    },
    {
      name: 'E-Commerce',
      slug: 'e-commerce',
      description:
        'Product catalogs, checkout flows, and storefront components.',
      icon: 'ShoppingCart',
      displayOrder: 4,
    },
    {
      name: 'Components',
      slug: 'components',
      description:
        'Reusable UI components like pricing tables, notifications, and cards.',
      icon: 'Layers',
      displayOrder: 5,
    },
  ];

  const insertedCategories = await db
    .insert(schema.categories)
    .values(categoriesData)
    .onConflictDoNothing()
    .returning();

  const categoryMap = new Map(
    insertedCategories.map((c) => [c.slug, c.id])
  );

  // If categories already existed, fetch them
  if (insertedCategories.length === 0) {
    const existing = await db.select().from(schema.categories);
    existing.forEach((c) => categoryMap.set(c.slug, c.id));
  }

  console.log(`Categories ready: ${categoryMap.size}`);

  // ─── 10 Templates (Prompts) ──────────────────────────────────
  console.log('Creating 10 templates...');

  const templates = [
    // ── Landing Pages ──
    {
      categoryId: categoryMap.get('landing-pages')!,
      title: 'SaaS Hero Section',
      slug: 'saas-hero-section',
      description:
        'A modern SaaS landing page hero with bold gradient headline, animated subtitle, dual CTA buttons, and a floating product mockup with glassmorphism card overlay.',
      promptText: `Create a modern SaaS landing page hero section with these requirements:

LAYOUT:
- Full viewport height hero with subtle gradient mesh background
- Centered content block with max-width 1200px
- Floating product mockup on the right (desktop), stacked on mobile

HEADLINE:
- Large bold headline (48-72px) with gradient text on key words
- Animated subtitle that fades in after the headline
- Two CTA buttons: primary "Start Free Trial" and secondary outline "Watch Demo"

VISUAL ELEMENTS:
- Glassmorphism card overlaying the product mockup showing key metrics
- Subtle floating particles or dots animation in background
- Trust badges row below CTAs (e.g., "Trusted by 10,000+ teams")
- Responsive: single column on mobile, two columns on desktop

STYLING:
- Dark theme with purple/blue gradient accents
- Smooth entrance animations (fade + slide up)
- Hover effects on buttons with subtle scale transform
- Use CSS grid for layout, flexbox for alignment`,
      tier: 'free' as const,
      frameworks: ['react', 'html', 'vue'],
      isFeatured: true,
      isPublished: true,
    },
    {
      categoryId: categoryMap.get('landing-pages')!,
      title: 'Agency Portfolio',
      slug: 'agency-portfolio',
      description:
        'Creative digital agency portfolio page with animated project grid, client testimonials carousel, team section, and contact form with validation.',
      promptText: `Create a creative digital agency portfolio landing page:

SECTIONS:
1. Hero with agency name, tagline, and a scroll-down indicator
2. Featured projects grid (3 columns desktop, 1 mobile) with hover overlay showing project name and category
3. About section with company stats (projects completed, clients, awards)
4. Client testimonials carousel with auto-play and dot navigation
5. Team members grid with photo, name, role, and social links
6. Contact form with name, email, project type dropdown, budget range, and message

DESIGN:
- Minimal black and white theme with one accent color
- Large typography with serif headings and sans-serif body
- Smooth scroll between sections
- Image hover effects: scale + overlay with project details
- Form validation with inline error messages
- Responsive grid that collapses gracefully on mobile

INTERACTIONS:
- Intersection Observer for scroll-triggered animations
- Project grid filter by category (All, Web, Mobile, Branding)
- Form submission with loading state and success message`,
      tier: 'free' as const,
      frameworks: ['react', 'html', 'vue'],
      isFeatured: true,
      isPublished: true,
    },

    // ── Dashboards ──
    {
      categoryId: categoryMap.get('dashboards')!,
      title: 'Analytics Dashboard',
      slug: 'analytics-dashboard',
      description:
        'Data-rich analytics dashboard with KPI summary cards, line/bar charts, activity feed, and date range picker with responsive sidebar navigation.',
      promptText: `Create a comprehensive analytics dashboard with these components:

LAYOUT:
- Collapsible sidebar (240px expanded, 64px collapsed) with navigation icons
- Top header bar with search, notifications bell with badge, and user avatar dropdown
- Main content area with responsive grid

KPI CARDS (top row, 4 cards):
- Total Revenue (with sparkline and % change)
- Active Users (with trend arrow)
- Conversion Rate (with progress ring)
- New Signups (with comparison to last period)

CHARTS SECTION:
- Large line chart showing revenue over time (7d/30d/90d toggle)
- Bar chart showing user activity by day of week
- Donut chart showing traffic sources breakdown

DATA TABLE:
- Recent transactions table with columns: Date, User, Amount, Status, Action
- Status badges (completed=green, pending=yellow, failed=red)
- Pagination with page size selector
- Sort by clicking column headers

ACTIVITY FEED:
- Right sidebar with real-time activity items
- Each item: avatar, action text, timestamp
- "Load more" button at bottom

STYLING:
- Clean white/gray theme with colored accents for different metrics
- Cards with subtle shadows and hover elevation
- Responsive: sidebar becomes bottom nav on mobile`,
      tier: 'starter' as const,
      frameworks: ['react', 'vue'],
      isFeatured: true,
      isPublished: true,
    },
    {
      categoryId: categoryMap.get('dashboards')!,
      title: 'Admin Control Panel',
      slug: 'admin-control-panel',
      description:
        'Full-featured admin panel with user management table, role-based access controls, system settings, and audit log viewer.',
      promptText: `Create a full-featured admin control panel:

USER MANAGEMENT:
- Searchable data table with columns: Avatar, Name, Email, Role, Status, Last Active, Actions
- Role badges: Admin (purple), Editor (blue), Viewer (gray)
- Status indicators: Active (green dot), Inactive (red dot), Pending (yellow dot)
- Bulk actions: Select all, Delete selected, Change role
- Action dropdown per row: Edit, Suspend, Delete with confirmation dialog

ROLE MANAGEMENT:
- Role cards showing: role name, description, user count, permissions list
- Create/edit role modal with permission checkboxes grouped by category
- Permission categories: Users, Content, Settings, Billing, API

SYSTEM SETTINGS:
- Tabbed interface: General, Security, Email, API Keys, Integrations
- Form fields with proper validation and save/cancel buttons
- Toggle switches for feature flags
- API key display with copy button and regenerate option

AUDIT LOG:
- Filterable log table: Timestamp, User, Action, Resource, IP Address
- Color-coded action types: Create (green), Update (blue), Delete (red), Login (gray)
- Date range filter and export to CSV button
- Click to expand showing full details

LAYOUT:
- Fixed sidebar with icon navigation
- Breadcrumb navigation in header
- Responsive design with mobile hamburger menu`,
      tier: 'pro' as const,
      frameworks: ['react', 'vue'],
      isFeatured: false,
      isPublished: true,
    },

    // ── Authentication ──
    {
      categoryId: categoryMap.get('authentication')!,
      title: 'Social Login Page',
      slug: 'social-login-page',
      description:
        'Clean, modern login page with social OAuth buttons (Google, GitHub, Apple), email/password form, remember me, and forgot password flow.',
      promptText: `Create a modern authentication login page:

LAYOUT:
- Split screen: left side with branding/illustration, right side with form
- Left panel: gradient background with app logo, tagline, and abstract illustration
- Right panel: centered form card with max-width 400px
- Mobile: full-width form only

SOCIAL LOGIN:
- Three social buttons stacked: "Continue with Google", "Continue with GitHub", "Continue with Apple"
- Each button with provider icon, proper brand colors on hover
- Divider with "or" text between social and email form

EMAIL FORM:
- Email input with mail icon prefix
- Password input with eye toggle for show/hide
- "Remember me" checkbox and "Forgot password?" link on same row
- Primary "Sign In" button full width
- "Don't have an account? Sign up" link at bottom

FORGOT PASSWORD FLOW:
- Clicking "Forgot password?" shows email-only form
- "Send Reset Link" button with loading state
- Success state: checkmark icon with "Check your email" message
- "Back to login" link

STYLING:
- Smooth transitions between login and forgot password states
- Input focus rings with brand color
- Button hover and loading states
- Error messages appear below inputs with red text
- Subtle entrance animation on page load`,
      tier: 'free' as const,
      frameworks: ['react', 'html', 'vue', 'flutter'],
      isFeatured: true,
      isPublished: true,
    },
    {
      categoryId: categoryMap.get('authentication')!,
      title: 'Multi-Step Registration',
      slug: 'multi-step-registration',
      description:
        'Multi-step signup wizard with progress indicator, form validation at each step, file upload for avatar, and plan selection.',
      promptText: `Create a multi-step registration wizard:

STEP INDICATOR:
- Horizontal progress bar at top showing steps: Account > Profile > Plan > Complete
- Steps show: number, label, and status (completed=checkmark, active=filled, pending=outline)
- Clickable to go back to completed steps only

STEP 1 - ACCOUNT:
- Email input with real-time format validation
- Password input with strength meter (weak/fair/strong/very strong)
- Confirm password with match validation
- "Continue" button (disabled until valid)

STEP 2 - PROFILE:
- Avatar upload with drag-and-drop zone and preview circle
- Full name input
- Username input with availability check (debounced, shows check/x icon)
- Bio textarea with character count (max 160)
- "Back" and "Continue" buttons

STEP 3 - PLAN SELECTION:
- Three plan cards in a row: Free, Pro ($9/mo), Team ($29/mo)
- Each card: plan name, price, feature list with check/x icons
- Selected plan has highlighted border
- "Back" and "Create Account" buttons

STEP 4 - COMPLETE:
- Success animation (confetti or checkmark)
- Welcome message with user's name
- "Go to Dashboard" primary button
- "Invite teammates" secondary button

VALIDATION:
- Each step validates before allowing progression
- Smooth slide animation between steps
- Form state persists when navigating back
- Error shake animation on invalid submit attempt`,
      tier: 'starter' as const,
      frameworks: ['react', 'flutter', 'vue'],
      isFeatured: false,
      isPublished: true,
    },

    // ── E-Commerce ──
    {
      categoryId: categoryMap.get('e-commerce')!,
      title: 'Product Catalog',
      slug: 'product-catalog',
      description:
        'Responsive product listing with search, category filters, sort options, price range slider, grid/list toggle, and quick-view modal.',
      promptText: `Create a full-featured e-commerce product catalog:

HEADER:
- Search bar with autocomplete suggestions dropdown
- Category breadcrumb navigation
- Cart icon with item count badge

FILTER SIDEBAR (left, collapsible on mobile):
- Category checkboxes with product counts
- Price range slider with min/max inputs
- Brand filter with search within brands
- Rating filter (star ratings 4+, 3+, etc.)
- Color swatches filter
- "Clear All Filters" button
- Active filters shown as removable chips above grid

PRODUCT GRID:
- Toggle between grid (3-4 columns) and list view
- Sort dropdown: Featured, Price Low-High, Price High-Low, Newest, Rating
- Results count: "Showing 24 of 156 products"

PRODUCT CARD:
- Image with hover zoom effect and "Quick View" overlay button
- Product name (2-line truncate)
- Star rating with review count
- Price with strikethrough original price if on sale
- "Add to Cart" button that changes to quantity selector
- Wishlist heart icon toggle

QUICK VIEW MODAL:
- Product image gallery with thumbnails
- Product details: name, price, description, size/color selectors
- Quantity selector with +/- buttons
- "Add to Cart" and "View Full Details" buttons

PAGINATION:
- Page numbers with prev/next arrows
- "Items per page" selector (12, 24, 48)

RESPONSIVE:
- Filters move to slide-out drawer on mobile
- Grid becomes 2 columns on tablet, 1 on mobile
- Sticky filter/sort bar on mobile`,
      tier: 'free' as const,
      frameworks: ['react', 'html', 'vue'],
      isFeatured: true,
      isPublished: true,
    },
    {
      categoryId: categoryMap.get('e-commerce')!,
      title: 'Checkout Flow',
      slug: 'checkout-flow',
      description:
        'Complete e-commerce checkout with cart summary, shipping address form, payment method selection, order review, and confirmation page.',
      promptText: `Create a complete e-commerce checkout flow:

STEP 1 - CART REVIEW:
- Product list with: thumbnail, name, variant (size/color), quantity adjuster, unit price, line total
- Remove item button with confirmation
- Promo code input with "Apply" button
- Order summary sidebar: Subtotal, Shipping, Tax, Discount, Total
- "Continue to Shipping" button

STEP 2 - SHIPPING:
- Saved addresses list with radio selection (if returning customer)
- "Add New Address" expandable form
- Address form: Full Name, Street, Apt/Suite, City, State/Province, ZIP, Country dropdown
- Shipping method selection: Standard (free, 5-7 days), Express ($9.99, 2-3 days), Overnight ($19.99, next day)
- Each method shows estimated delivery date

STEP 3 - PAYMENT:
- Payment method tabs: Credit Card, PayPal, Apple Pay
- Credit card form with: Card number (auto-format), Expiry (MM/YY), CVV, Name on card
- Card type auto-detection icon (Visa, Mastercard, Amex)
- "Save card for future purchases" checkbox
- Billing address: "Same as shipping" checkbox or separate form

STEP 4 - REVIEW:
- Complete order summary with all details
- Edit links for each section
- Terms and conditions checkbox
- "Place Order" button with loading state

STEP 5 - CONFIRMATION:
- Order confirmation with order number
- Order details summary
- Estimated delivery info
- "Continue Shopping" and "Track Order" buttons
- Order confirmation email note

DESIGN:
- Clean, minimal design that builds trust
- Progress indicator at top
- Persistent order summary sidebar on desktop
- Security badges near payment form
- Mobile-optimized single column layout`,
      tier: 'pro' as const,
      frameworks: ['react', 'vue'],
      isFeatured: false,
      isPublished: true,
    },

    // ── Components ──
    {
      categoryId: categoryMap.get('components')!,
      title: 'Pricing Comparison Table',
      slug: 'pricing-comparison-table',
      description:
        'Responsive pricing table with monthly/annual toggle, feature comparison grid, popular plan highlight, and FAQ section.',
      promptText: `Create a production-ready pricing comparison component:

PRICING TOGGLE:
- Monthly / Annual switch with "Save 20%" badge on annual
- Smooth price transition animation when toggling

PRICING CARDS (3 plans):
Plan 1 - Starter:
  - $9/mo or $86/yr
  - Feature list with check icons
  - "Get Started" outline button

Plan 2 - Professional (Most Popular):
  - $29/mo or $278/yr
  - Highlighted with colored border and "Most Popular" badge
  - Extended feature list
  - "Start Free Trial" primary button
  - Slightly larger/elevated card

Plan 3 - Enterprise:
  - "Custom" pricing
  - All features included
  - "Contact Sales" button
  - Custom badge icons for premium features

FEATURE COMPARISON TABLE (below cards):
- Sticky header row with plan names
- Feature rows grouped by category (Core, Advanced, Support, Security)
- Check/X icons or specific values (e.g., "100GB", "Unlimited")
- Alternating row backgrounds for readability
- Responsive: horizontal scroll on mobile with sticky first column

FAQ SECTION:
- 5-6 pricing-related FAQs in accordion format
- Questions like: "Can I change plans?", "What happens after trial?", "Do you offer refunds?"

STYLING:
- Clean design with subtle gradients on popular plan
- Hover effects on cards and buttons
- Mobile: cards stack vertically, comparison table scrolls horizontally
- Smooth toggle animation with number counting effect`,
      tier: 'free' as const,
      frameworks: ['react', 'html', 'vue', 'flutter'],
      isFeatured: true,
      isPublished: true,
    },
    {
      categoryId: categoryMap.get('components')!,
      title: 'Notification Center',
      slug: 'notification-center',
      description:
        'Full notification system with bell dropdown, categorized notifications, read/unread states, mark all read, and notification preferences.',
      promptText: `Create a comprehensive notification center component:

NOTIFICATION BELL:
- Bell icon in header/navbar with unread count badge (red circle)
- Badge shows count up to 99, then "99+"
- Subtle pulse animation when new notification arrives
- Click opens dropdown panel

NOTIFICATION DROPDOWN:
- Panel (400px width) with header: "Notifications" title + "Mark all read" link
- Tab filter: All, Mentions, Updates, System
- Notification list with virtual scrolling for performance

NOTIFICATION ITEM:
- Left: colored icon by type (info=blue, success=green, warning=yellow, error=red, mention=purple)
- Center: title (bold if unread), description (2-line truncate), relative timestamp
- Right: unread dot indicator, three-dot menu (Mark read, Remove, Mute)
- Click navigates to related page
- Hover shows subtle background highlight
- Unread items have left border accent

NOTIFICATION TYPES:
1. Mention: "@user mentioned you in Project Alpha"
2. Update: "Version 2.1 has been deployed"
3. Alert: "API usage approaching limit (85%)"
4. System: "Scheduled maintenance on March 25"
5. Social: "John liked your comment"

EMPTY STATE:
- Illustration with "All caught up!" message when no notifications

NOTIFICATION PREFERENCES (settings page):
- Toggle switches for each notification type
- Channel selection: In-app, Email, Push
- Quiet hours setting with time range picker

STYLING:
- Smooth dropdown open/close animation
- Skeleton loading state while fetching
- Swipe to dismiss on mobile
- Keyboard navigation support (arrow keys, Enter, Escape)`,
      tier: 'starter' as const,
      frameworks: ['react', 'vue', 'flutter'],
      isFeatured: false,
      isPublished: true,
    },
  ];

  const inserted = await db
    .insert(schema.prompts)
    .values(templates)
    .onConflictDoNothing()
    .returning();

  console.log(`Inserted ${inserted.length} templates`);
  console.log('Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
