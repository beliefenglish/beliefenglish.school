import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const filename = (req.query?.filename as string) || `upload-${Date.now()}`;
    const storeId = process.env.beliefenglish_STORE_ID || process.env.BLOB_STORE_ID;

    const blob = await put(filename, req, {
      access: 'public',
      ...(storeId ? { storeId } : {}),
    });

    return res.status(200).json(blob);
  } catch (error: any) {
    console.error('Error uploading file to Vercel Blob:', error);
    return res.status(500).json({ error: error.message || 'Lỗi tải lên Vercel Blob' });
  }
}
