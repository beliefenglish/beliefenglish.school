import { kv } from '@vercel/kv';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { SiteContent } from '@/types/content';
import { defaultContent } from '@/lib/default-content';

const KV_KEY = 'belief_english_site_content';

export async function GET() {
  try {
    const data = await kv.get<SiteContent>(KV_KEY);
    return NextResponse.json(data || defaultContent, {
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

    await kv.set(KV_KEY, payload);

    // Instant Next.js cache purging
    revalidatePath('/', 'layout');
    revalidatePath('/admin');

    return NextResponse.json({ success: true, data: payload });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error updating content';
    console.error('Error saving content to Vercel KV:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
