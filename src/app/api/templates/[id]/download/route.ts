import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { prompts, templateDownloads } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { canAccessTemplate } from '@/lib/access';
import { templateProductId } from '@/config/products';
import { isR2Key, presignR2Download } from '@/lib/r2';

/**
 * Entitlement-gated template download. The ONLY way paid assets are handed
 * out — asset URLs are never exposed in list/detail APIs.
 */
export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Sign in to download templates' } },
        { status: 401 }
      );
    }

    const { id } = await props.params;
    const [template] = await db()
      .select({
        id: prompts.id,
        categoryId: prompts.categoryId,
        isFree: prompts.isFree,
        isPublished: prompts.isPublished,
        assetKind: prompts.assetKind,
        title: prompts.title,
        assetUrl: prompts.assetUrl,
        promptText: prompts.promptText,
        detailedPrompt: prompts.detailedPrompt,
      })
      .from(prompts)
      .where(eq(prompts.id, id))
      .limit(1);

    if (!template || !template.isPublished) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Template not found' } },
        { status: 404 }
      );
    }

    const allowed = await canAccessTemplate(session.user.id, template);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'PURCHASE_REQUIRED',
            message: 'You don’t have access to this template yet',
            productId: templateProductId(template.id),
          },
        },
        { status: 403 }
      );
    }

    // Entitlement is confirmed — mint a short-lived link to the private object.
    // `assetUrl` holds an R2 key; legacy rows hold a full public URL, which is
    // passed through unchanged so old templates keep downloading.
    let assetUrl = template.assetUrl;
    if (assetUrl && isR2Key(assetUrl)) {
      const filename = `${template.title ?? 'template'}.${assetUrl.split('.').pop() ?? 'zip'}`
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, '-');
      assetUrl = await presignR2Download(assetUrl, filename);
    }

    await Promise.all([
      db().insert(templateDownloads).values({ userId: session.user.id, promptId: template.id }),
      db()
        .update(prompts)
        .set({ usageCount: sql`${prompts.usageCount} + 1` })
        .where(eq(prompts.id, template.id)),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        title: template.title,
        // Presigned, expires in 5 minutes — do not cache or persist client-side.
        assetUrl,
        // …and the prompt content itself for ai_prompt templates
        promptText: template.promptText,
        detailedPrompt: template.detailedPrompt,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'DOWNLOAD_FAILED', message: 'Failed to download template' } },
      { status: 500 }
    );
  }
}
