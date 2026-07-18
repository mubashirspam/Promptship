import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateCode } from '@/lib/ai';
import { generateSchema } from '@/lib/validations/generator';
import { db } from '@/lib/db';
import { generations, users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { canUseFeature } from '@/lib/access';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // AI generation is an entitlement (all-access or the ai_generate add-on)
    if (!(await canUseFeature(userId, 'ai_generate'))) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PURCHASE_REQUIRED',
            message: 'The AI Generator is an add-on — get All Access or the AI add-on to use it.',
            productId: 'ai-generate-monthly',
          },
        },
        { status: 403 }
      );
    }

    // Abuse guard on top of credits (10 generations/min per user)
    const rate = await checkRateLimit('generate', userId, { limit: 10, windowSec: 60 });
    if (!rate.success) {
      return NextResponse.json(
        { success: false, error: { code: 'RATE_LIMITED', message: 'Too many generations — try again in a minute.' } },
        { status: 429 }
      );
    }

    const user = await db()
      .select({ credits: users.credits })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .then(rows => rows[0]);

    // Check credits
    if ((user?.credits ?? 0) < 1) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_CREDITS', message: 'Insufficient credits. Please upgrade or wait for monthly reset.' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const input = generateSchema.parse(body);

    const startTime = Date.now();
    const result = await generateCode({
      promptText: input.promptText,
      framework: input.framework,
      style: input.style,
      animationLevel: input.animationLevel,
      darkMode: input.darkMode,
      borderRadius: input.borderRadius,
      primaryColor: input.primaryColor,
      customInstructions: input.customInstructions,
    });
    const latencyMs = Date.now() - startTime;

    // Save generation and deduct credit atomically
    const [generationRows] = await Promise.all([
      db()
        .insert(generations)
        .values({
          userId,
          framework: input.framework,
          templateType: input.promptText?.slice(0, 50),
          options: {
            style: input.style,
            animationLevel: input.animationLevel,
            darkMode: input.darkMode,
            primaryColor: input.primaryColor,
          },
          inputPrompt: input.promptText,
          outputCode: result.code,
          aiProvider: result.provider,
          aiModel: result.model,
          tokensInput: result.tokensInput,
          tokensOutput: result.tokensOutput,
          latencyMs,
          costUsd: '0',
        })
        .returning(),
      db()
        .update(users)
        .set({ credits: sql`GREATEST(${users.credits} - 1, 0)` })
        .where(eq(users.id, userId)),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        id: generationRows[0].id,
        code: result.code,
        framework: input.framework,
        tokensUsed: result.tokensInput + result.tokensOutput,
        latencyMs,
      },
    });
  } catch (error) {
    console.error('Generation error:', error);

    const message =
      error instanceof Error ? error.message : 'Failed to generate code';

    return NextResponse.json(
      { success: false, error: { code: 'GENERATION_FAILED', message } },
      { status: 500 }
    );
  }
}
