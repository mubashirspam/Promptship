import { z } from 'zod';

export const generateSchema = z.object({
  promptId: z.string().uuid().optional(),
  promptText: z.string().min(10, 'Prompt must be at least 10 characters'),
  framework: z.enum(['react', 'flutter', 'html', 'vue']),
  style: z.enum(['minimal', 'glassmorphism', 'gradient', 'bold', 'neumorphism']).default('minimal'),
  animationLevel: z.enum(['none', 'subtle', 'dynamic']).default('subtle'),
  darkMode: z.boolean().default(false),
  borderRadius: z.number().min(0).max(24).default(8),
  primaryColor: z.string().default('#7C3AED'),
  customInstructions: z.string().max(500).optional(),
});

export type GenerateInput = z.infer<typeof generateSchema>;
