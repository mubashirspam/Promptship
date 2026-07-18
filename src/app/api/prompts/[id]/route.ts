import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { prompts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { canAccessTemplate } from '@/lib/access';
import { templateProductId } from '@/config/products';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [prompt] = await db()
      .select()
      .from(prompts)
      .where(eq(prompts.id, id))
      .limit(1);

    if (!prompt || !prompt.isPublished) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Prompt not found' } },
        { status: 404 }
      );
    }

    const session = await getSession();
    const hasAccess = await canAccessTemplate(session?.user.id ?? null, prompt);

    // Paid content never leaves the server without an entitlement; the asset
    // URL only ever leaves through the download endpoint.
    const { assetUrl: _assetUrl, ...safePrompt } = prompt;
    const data = {
      ...safePrompt,
      hasAccess,
      productId: hasAccess ? null : templateProductId(prompt.id),
      promptText: hasAccess ? prompt.promptText : null,
      detailedPrompt: hasAccess ? prompt.detailedPrompt : null,
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Prompt fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch prompt' } },
      { status: 500 }
    );
  }
}
