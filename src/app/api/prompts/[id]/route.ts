import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { prompts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prompt = await db
      .select()
      .from(prompts)
      .where(eq(prompts.id, id))
      .limit(1);

    if (!prompt[0]) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Prompt not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: prompt[0] });
  } catch (error) {
    console.error('Prompt fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch prompt' } },
      { status: 500 }
    );
  }
}
