import { relations, sql } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
  jsonb,
  decimal,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// Helper for text ID with UUID default
const textId = (name: string) =>
  text(name)
    .notNull()
    .default(sql`gen_random_uuid()`)
    .$defaultFn(() => crypto.randomUUID());

// ─── Enums ───────────────────────────────────────────────────────────────────

export const userTierEnum = pgEnum('user_tier', [
  'free',
  'starter',
  'pro',
  'team',
]);

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'canceled',
  'past_due',
  'paused',
  'trialing',
]);

export const paymentProviderEnum = pgEnum('payment_provider', [
  'stripe',
  'razorpay',
]);

export const frameworkEnum = pgEnum('framework', [
  'react',
  'flutter',
  'html',
  'vue',
]);

export const blogStatusEnum = pgEnum('blog_status', [
  'draft',
  'published',
  'archived',
]);

export const contentFormatEnum = pgEnum('content_format', [
  'text',
  'markdown',
]);

// ─── Tables ──────────────────────────────────────────────────────────────────

export const accounts = pgTable(
  'accounts',
  {
    id: textId('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accountId: varchar('account_id', { length: 255 }).notNull(),
    providerId: varchar('provider_id', { length: 255 }).notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', {
      withTimezone: true,
    }),
    scope: text('scope'),
    idToken: text('id_token'),
    password: text('password'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('accounts_user_id_idx').on(table.userId),
    uniqueIndex('accounts_provider_account_idx').on(
      table.providerId,
      table.accountId
    ),
  ]
);

export const verifications = pgTable('verifications', {
  id: textId('id').primaryKey(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const users = pgTable(
  'users',
  {
    id: textId('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }),
    image: text('image'),
    avatarUrl: text('avatar_url'),
    tier: userTierEnum('tier').default('free').notNull(),
    role: userRoleEnum('role').default('user').notNull(),
    credits: integer('credits').default(0).notNull(),
    defaultFramework: varchar('default_framework', { length: 20 }).default(
      'react'
    ),
    preferredCurrency: varchar('preferred_currency', { length: 10 }).default(
      'USD'
    ),
    onboardingCompleted: boolean('onboarding_completed').default(false),
    emailVerified: boolean('email_verified').default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('users_email_idx').on(table.email),
    index('users_tier_idx').on(table.tier),
  ]
);

export const sessions = pgTable(
  'sessions',
  {
    id: textId('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 255 }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('sessions_token_idx').on(table.token),
    index('sessions_user_id_idx').on(table.userId),
  ]
);

export const magicLinks = pgTable('magic_links', {
  id: textId('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: textId('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    plan: varchar('plan', { length: 50 }),
    status: subscriptionStatusEnum('status').notNull(),
    provider: paymentProviderEnum('provider').notNull(),
    providerSubscriptionId: varchar('provider_subscription_id', {
      length: 255,
    }),
    providerCustomerId: varchar('provider_customer_id', { length: 255 }),
    currentPeriodStart: timestamp('current_period_start', {
      withTimezone: true,
    }),
    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('subscriptions_user_id_idx').on(table.userId),
    index('subscriptions_provider_sub_id_idx').on(
      table.provider,
      table.providerSubscriptionId
    ),
  ]
);

export const payments = pgTable('payments', {
  id: textId('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  subscriptionId: text('subscription_id').references(() => subscriptions.id),
  provider: paymentProviderEnum('provider').notNull(),
  providerPaymentId: varchar('provider_payment_id', { length: 255 }),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  status: varchar('status', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const categories = pgTable('categories', {
  id: textId('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const prompts = pgTable(
  'prompts',
  {
    id: textId('id').primaryKey(),
    categoryId: text('category_id').references(() => categories.id),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description'),
    promptText: text('prompt_text').notNull(),
    
    // Premium template fields
    detailedPrompt: text('detailed_prompt'), // Full markdown specification
    templateType: varchar('template_type', { length: 50 }).default('simple'), // 'simple' | 'detailed' | 'premium'
    previewImageUrl: text('preview_image_url'),
    previewVideoUrl: text('preview_video_url'), // For video backgrounds/demos
    thumbnailUrl: text('thumbnail_url'), // Grid view thumbnail
    
    // Technical specifications (stored as JSONB)
    technicalSpecs: jsonb('technical_specs').$type<{
      fonts?: { name: string; weights: number[]; url?: string }[];
      colors?: { name: string; hsl: string; usage: string }[];
      animations?: { name: string; keyframes: string; usage: string }[];
      dependencies?: { name: string; version: string; required: boolean }[];
      assets?: { type: string; url: string; description: string }[];
    }>(),
    
    // Layout & structure metadata
    layoutMetadata: jsonb('layout_metadata').$type<{
      sections?: string[]; // ['navigation', 'hero', 'features', 'footer']
      components?: string[]; // ['Button', 'Card', 'Modal']
      complexity?: 'simple' | 'medium' | 'complex';
      responsive?: boolean;
      darkMode?: boolean;
    }>(),
    
    tier: userTierEnum('tier').default('free').notNull(),
    frameworks: varchar('frameworks', { length: 20 })
      .array()
      .default(['react']),
    usageCount: integer('usage_count').default(0).notNull(),
    copyCount: integer('copy_count').default(0).notNull(),
    favoriteCount: integer('favorite_count').default(0).notNull(),
    isFeatured: boolean('is_featured').default(false),
    isPremium: boolean('is_premium').default(false), // Premium template badge
    isPublished: boolean('is_published').default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('prompts_category_id_idx').on(table.categoryId),
    index('prompts_tier_idx').on(table.tier),
    index('prompts_is_published_idx').on(table.isPublished),
    index('prompts_template_type_idx').on(table.templateType),
    index('prompts_is_premium_idx').on(table.isPremium),
  ]
);

export const promptCopies = pgTable(
  'prompt_copies',
  {
    id: textId('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    promptId: text('prompt_id')
      .notNull()
      .references(() => prompts.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('prompt_copies_user_id_created_at_idx').on(
      table.userId,
      table.createdAt
    ),
  ]
);

export const favorites = pgTable(
  'favorites',
  {
    id: textId('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    promptId: text('prompt_id')
      .notNull()
      .references(() => prompts.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('favorites_user_id_prompt_id_idx').on(
      table.userId,
      table.promptId
    ),
    index('favorites_user_id_idx').on(table.userId),
  ]
);

export const generations = pgTable(
  'generations',
  {
    id: textId('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    promptId: text('prompt_id').references(() => prompts.id, {
      onDelete: 'set null',
    }),
    framework: varchar('framework', { length: 20 }),
    templateType: varchar('template_type', { length: 50 }),
    options: jsonb('options').default({}),
    inputPrompt: text('input_prompt'),
    outputCode: text('output_code'),
    aiProvider: varchar('ai_provider', { length: 20 }).default('claude'),
    aiModel: varchar('ai_model', { length: 50 }),
    tokensInput: integer('tokens_input'),
    tokensOutput: integer('tokens_output'),
    latencyMs: integer('latency_ms'),
    costUsd: decimal('cost_usd', { precision: 10, scale: 6 }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('generations_user_id_created_at_idx').on(
      table.userId,
      table.createdAt
    ),
  ]
);

export const blogPosts = pgTable(
  'blog_posts',
  {
    id: textId('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
    coverImageUrl: text('cover_image_url'),
    authorId: text('author_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    status: blogStatusEnum('status').default('draft').notNull(),
    category: varchar('category', { length: 100 }),
    tags: text('tags').array().default([]),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('blog_posts_status_idx').on(table.status),
    index('blog_posts_author_id_idx').on(table.authorId),
    index('blog_posts_published_at_idx').on(table.publishedAt),
  ]
);

export const courseModules = pgTable('course_modules', {
  id: textId('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  displayOrder: integer('display_order').default(0).notNull(),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const lessons = pgTable('lessons', {
  id: textId('id').primaryKey(),
  moduleId: text('module_id')
    .notNull()
    .references(() => courseModules.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  videoUrl: text('video_url'),
  videoDurationSec: integer('video_duration_sec'),
  displayOrder: integer('display_order').default(0).notNull(),
  isFreePreview: boolean('is_free_preview').default(false),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const lessonProgress = pgTable(
  'lesson_progress',
  {
    id: textId('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lessonId: text('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    watchTimeSec: integer('watch_time_sec').default(0).notNull(),
    isCompleted: boolean('is_completed').default(false),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    lastPositionSec: integer('last_position_sec').default(0).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('lesson_progress_user_id_lesson_id_idx').on(
      table.userId,
      table.lessonId
    ),
    index('lesson_progress_user_id_idx').on(table.userId),
  ]
);

// ─── Relations ───────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  subscriptions: many(subscriptions),
  promptCopies: many(promptCopies),
  favorites: many(favorites),
  generations: many(generations),
  lessonProgress: many(lessonProgress),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  prompts: many(prompts),
}));

export const promptsRelations = relations(prompts, ({ one, many }) => ({
  category: one(categories, {
    fields: [prompts.categoryId],
    references: [categories.id],
  }),
  copies: many(promptCopies),
  favorites: many(favorites),
}));

export const promptCopiesRelations = relations(promptCopies, ({ one }) => ({
  user: one(users, {
    fields: [promptCopies.userId],
    references: [users.id],
  }),
  prompt: one(prompts, {
    fields: [promptCopies.promptId],
    references: [prompts.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  prompt: one(prompts, {
    fields: [favorites.promptId],
    references: [prompts.id],
  }),
}));

export const generationsRelations = relations(generations, ({ one }) => ({
  user: one(users, {
    fields: [generations.userId],
    references: [users.id],
  }),
  prompt: one(prompts, {
    fields: [generations.promptId],
    references: [prompts.id],
  }),
}));

export const courseModulesRelations = relations(courseModules, ({ many }) => ({
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(courseModules, {
    fields: [lessons.moduleId],
    references: [courseModules.id],
  }),
  progress: many(lessonProgress),
}));

export const lessonProgressRelations = relations(
  lessonProgress,
  ({ one }) => ({
    user: one(users, {
      fields: [lessonProgress.userId],
      references: [users.id],
    }),
    lesson: one(lessons, {
      fields: [lessonProgress.lessonId],
      references: [lessons.id],
    }),
  })
);

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));
