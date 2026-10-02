import { put } from '@vercel/blob';
import { kv } from '@vercel/kv';
import { defaultContent } from '../lib/default-content';

const KV_KEY = 'belief_english_site_content';

export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch content from Vercel KV or default
  if (req.method === 'GET') {
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const data = await kv.get(KV_KEY);
        if (data) {
          return res.status(200).json(data);
        }
      }
      return res.status(200).json(defaultContent);
    } catch (err: any) {
      console.warn('Error reading from KV, falling back to default:', err);
      return res.status(200).json(defaultContent);
    }
  }

  // POST: Save content to Vercel Blob and KV
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const payload = {
        ...body,
        updatedAt: new Date().toISOString(),
      };

      let blobResult: any = null;
      // 1. Save to Vercel Blob (using storeId: process.env.beliefenglish_STORE_ID)
      try {
        const storeId = process.env.beliefenglish_STORE_ID || process.env.BLOB_STORE_ID;
        blobResult = await put('articles/site-content.json', JSON.stringify(payload), {
          access: 'public',
          addRandomSuffix: false,
          ...(storeId ? { storeId } : {}),
        });
      } catch (blobErr) {
        console.warn('Vercel Blob put notification:', blobErr);
      }

      // 2. Save to Vercel KV if configured
      try {
        if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
          await kv.set(KV_KEY, payload);
        }
      } catch (kvErr) {
        console.warn('Vercel KV set notification:', kvErr);
      }

      return res.status(200).json({
        success: true,
        data: payload,
        blobUrl: blobResult?.url || null,
        message: 'Đã lưu dữ liệu hệ thống thành công!',
      });
    } catch (error: any) {
      console.error('Error saving content:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Lỗi khi lưu dữ liệu lên máy chủ',
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
