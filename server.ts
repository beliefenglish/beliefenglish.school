import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Backend API route for Speaking AI Chat with Gemini Flash
  app.post('/api/speaking-chat', async (req, res) => {
    try {
      const { message, history, level, topic } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Nội dung tin nhắn không hợp lệ.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY chưa được cấu hình. Vui lòng thiết lập khóa bí mật trong panel Secrets.',
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are "Belief AI Speaking Coach", a warm, friendly, and motivating English speaking tutor for students at "Trung tâm Ngoại ngữ Niềm Tin - Belief English (Member of BELIS GROUP)".
Target Student Level: ${level || 'Cambridge Young Learners'}
Current Speaking Topic: ${topic || 'General Daily English Conversation'}

Core Educational Philosophy - BAC Methodology:
1. BELIEVE: Always start by praising the student's speaking effort ("Awesome job!", "You pronounced that clearly!", "Great enthusiasm!"). Create a safe psychological environment where mistakes are natural stepping stones.
2. ACTIVE: Keep the conversation active, engaging, and two-way. Ask ONE interesting, level-appropriate follow-up question so the student speaks more.
3. CONTROL: If the student has grammar/pronunciation errors or spoke broken English/Vietnamese, provide a gentle, natural correction:
   - Show: "💡 Natural way to say it: [example]"
   - Offer a useful vocabulary or pronunciation tip.

Formatting & Tone:
- Keep your response concise (2-4 sentences max) so it sounds like real speaking conversation and isn't overwhelming to read or listen to.
- Use simple, friendly English appropriate to the selected level. You can add short Vietnamese encouragement in parentheses if helpful for younger kids.`;

      // Build message array for Gemini API
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const msg of history.slice(-6)) {
          if (msg && msg.content) {
            contents.push({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.content }],
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 600,
        },
      });

      const reply = response.text || 'Great attempt! Can you tell me more about what you like?';
      res.json({ reply });
    } catch (err: any) {
      console.error('Error in /api/speaking-chat:', err);
      res.status(500).json({
        error: err.message || 'Lỗi xử lý phản hồi từ Gemini API.',
      });
    }
  });

  // In-memory / cached site content fallback
  let cachedContent: any = null;

  // GET /api/content
  app.get('/api/content', async (_req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store');
      if (cachedContent) {
        return res.json(cachedContent);
      }
      return res.json({ success: true, message: 'Dữ liệu khởi tạo' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/content
  app.post('/api/content', async (req, res) => {
    try {
      const payload = {
        ...req.body,
        updatedAt: new Date().toISOString(),
      };
      cachedContent = payload;

      let blobResult: any = null;
      try {
        const { put } = await import('@vercel/blob');
        const storeId = process.env.beliefenglish_STORE_ID || process.env.BLOB_STORE_ID;
        blobResult = await put('articles/site-content.json', JSON.stringify(payload), {
          access: 'public',
          addRandomSuffix: false,
          ...(storeId ? { storeId } : {}),
        });
      } catch (blobErr: any) {
        console.warn('Vercel Blob in local server:', blobErr.message);
      }

      res.json({
        success: true,
        data: payload,
        blobUrl: blobResult?.url || null,
        message: 'Đã lưu cấu hình thành công!',
      });
    } catch (err: any) {
      console.error('Error saving in /api/content:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/upload
  app.post('/api/upload', express.raw({ type: '*/*', limit: '15mb' }), async (req, res) => {
    try {
      const filename = (req.query.filename as string) || `upload-${Date.now()}`;
      let blobResult: any = null;

      try {
        const { put } = await import('@vercel/blob');
        const storeId = process.env.beliefenglish_STORE_ID || process.env.BLOB_STORE_ID;
        blobResult = await put(filename, req.body, {
          access: 'public',
          ...(storeId ? { storeId } : {}),
        });
      } catch (blobErr: any) {
        console.warn('Vercel Blob upload in local server:', blobErr.message);
      }

      if (blobResult?.url) {
        return res.json(blobResult);
      }

      // Fallback base64 url if no Vercel Blob token in local dev
      const mimeType = (req.headers['content-type'] as string) || 'image/png';
      const base64Data = Buffer.isBuffer(req.body)
        ? `data:${mimeType};base64,${req.body.toString('base64')}`
        : '';
      return res.json({
        url: base64Data || `https://via.placeholder.com/300?text=${encodeURIComponent(filename)}`,
        pathname: filename,
        contentType: mimeType,
      });
    } catch (err: any) {
      console.error('Error in /api/upload:', err);
      res.status(500).json({ error: err.message || 'Lỗi tải ảnh lên server' });
    }
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
