import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type {
  users,
  sessions,
  subscriptions,
  payments,
  categories,
  prompts,
  promptCopies,
  favorites,
  generations,
  courseModules,
  lessons,
  lessonProgress,
} from '@/lib/db/schema';

// Select types (what you get from the database)
export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
export type Subscription = InferSelectModel<typeof subscriptions>;
export type Payment = InferSelectModel<typeof payments>;
export type Category = InferSelectModel<typeof categories>;
export type Prompt = InferSelectModel<typeof prompts>;
export type PromptCopy = InferSelectModel<typeof promptCopies>;
export type Favorite = InferSelectModel<typeof favorites>;
export type Generation = InferSelectModel<typeof generations>;
export type CourseModule = InferSelectModel<typeof courseModules>;
export type Lesson = InferSelectModel<typeof lessons>;
export type LessonProgress = InferSelectModel<typeof lessonProgress>;

// Insert types (what you send to the database)
export type NewUser = InferInsertModel<typeof users>;
export type NewSession = InferInsertModel<typeof sessions>;
export type NewSubscription = InferInsertModel<typeof subscriptions>;
export type NewPayment = InferInsertModel<typeof payments>;
export type NewCategory = InferInsertModel<typeof categories>;
export type NewPrompt = InferInsertModel<typeof prompts>;
export type NewPromptCopy = InferInsertModel<typeof promptCopies>;
export type NewFavorite = InferInsertModel<typeof favorites>;
export type NewGeneration = InferInsertModel<typeof generations>;
export type NewCourseModule = InferInsertModel<typeof courseModules>;
export type NewLesson = InferInsertModel<typeof lessons>;
export type NewLessonProgress = InferInsertModel<typeof lessonProgress>;

// Extended types
export type PromptWithCategory = Prompt & {
  category: Category | null;
};

export type LessonWithModule = Lesson & {
  module: CourseModule;
};
