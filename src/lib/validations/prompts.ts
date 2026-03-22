import { z } from 'zod';

export const createPromptSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().optional(),
  promptText: z.string().min(10, 'Prompt must be at least 10 characters'),
  categoryId: z.string().uuid().optional(),
  tier: z.enum(['free', 'starter', 'pro', 'team']).default('free'),
  frameworks: z.array(z.enum(['react', 'flutter', 'html', 'vue'])).default(['react']),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export const updatePromptSchema = createPromptSchema.partial();

export const promptSearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  framework: z.enum(['react', 'flutter', 'html', 'vue']).optional(),
  tier: z.enum(['free', 'starter', 'pro', 'team']).optional(),
  sort: z.enum(['popular', 'newest', 'alphabetical']).default('popular'),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(20),
});

export type CreatePromptInput = z.infer<typeof createPromptSchema>;
export type UpdatePromptInput = z.infer<typeof updatePromptSchema>;
export type PromptSearchInput = z.infer<typeof promptSearchSchema>;
