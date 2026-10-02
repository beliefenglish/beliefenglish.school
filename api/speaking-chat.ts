import { GoogleGenAI } from '@google/genai';

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
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ hỗ trợ phương thức POST' });
  }

  try {
    const { message, history, level, topic } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Nội dung tin nhắn không hợp lệ.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY chưa được cấu hình. Vui lòng thiết lập biến môi trường trên Vercel.',
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
    return res.status(200).json({ reply });
  } catch (err: any) {
    console.warn('Error in Vercel /api/speaking-chat:', err?.message || err);
    return res.status(500).json({
      error: err.message || 'Lỗi xử lý phản hồi từ Gemini API.',
    });
  }
}
