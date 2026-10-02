import { kv } from '@vercel/kv';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { SiteContent } from '@/types/content';
import { defaultContent } from '@/lib/default-content';

const KV_KEY = 'belief_english_site_content';

export async function GET() {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const data = await kv.get<SiteContent>(KV_KEY);
      if (data) {
        return NextResponse.json(data, {
          headers: {
            'Cache-Control': 'no-store, max-age=0, must-revalidate',
          },
        });
      }
    }
    return NextResponse.json(defaultContent, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching content from Vercel KV:', error);
    return NextResponse.json(defaultContent, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SiteContent;

    const payload: SiteContent = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    let blobUrl: string | undefined;
    // 1. Put to Vercel Blob with storeId
    try {
      const storeId = process.env.beliefenglish_STORE_ID || process.env.BLOB_STORE_ID;
      const blob = await put('articles/site-content.json', JSON.stringify(payload), {
        access: 'public',
        addRandomSuffix: false,
        ...(storeId ? { storeId } : {}),
      });
      blobUrl = blob.url;
    } catch (bErr) {
      console.warn('Vercel Blob save notification:', bErr);
    }

    // 2. Put to Vercel KV if configured
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        await kv.set(KV_KEY, payload);
      }
    } catch (kErr) {
      console.warn('Vercel KV save notification:', kErr);
    }

    // Instant Next.js cache purging
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/admin');
    } catch {
      // ignore outside next.js runtime
    }

    return NextResponse.json({ success: true, data: payload, blobUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error updating content';
    console.error('Error saving content:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
