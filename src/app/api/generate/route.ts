import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateCode } from '@/lib/ai';
import { generateSchema } from '@/lib/validations/generator';
import { db } from '@/lib/db';
import { generations, users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { hasTierAccess, type Tier } from '@/lib/utils/constants';

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

    // Check tier access (pro+ only)
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { tier: true, credits: true },
    });

    const tier = (user?.tier ?? 'free') as Tier;
    if (!hasTierAccess(tier, 'pro')) {
      return NextResponse.json(
        { success: false, error: { code: 'TIER_REQUIRED', message: 'AI Generator requires Pro tier or higher.' } },
        { status: 403 }
      );
    }

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
      db
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
      db
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
