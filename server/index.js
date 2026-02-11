import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import { createParser } from 'eventsource-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});


// In-memory rate limiting
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

// System Prompt for Chat
const systemPrompt = `
You are Arunabha's AI Assistant. Your goal is to help visitors understand Arunabha's background, skills, and projects effectively. You should be professional, friendly, and knowledgeable about Arunabha's portfolio.

Current Context:
Name: Arunabha Banerjee
Role: Full Stack Web Developer & Founding Frontend Engineer
Skills: React, Next.js, TypeScript, Tailwind CSS, Node.js, Express, NestJS, Postgres, AWS.
Projects: CodeMate, HRSphere, Sleek Portfolio.
Experience:
- Founding Frontend Engineer at good day :3 (Aug 2025 - Present)
- Backend Developer Intern at Upsurge Labs (Jun 2025 - Jul 2025)

Style Guide:
- Be concise but helpful.
- Use markdown for formatting.
- If asked about contact info, guide them to the contact form or social links.
- Do not make up facts not present in the context.
`;

function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || 'unknown';
}

function checkRateLimit(clientIP) {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  clientData.count++;
  rateLimitStore.set(clientIP, clientData);
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - clientData.count,
  };
}

// Contact Route
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  message: z.string().min(10).max(1000),
});

async function sendToTelegram(data) {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (!telegramToken || !telegramChatId) {
    console.error('Telegram configuration missing');
    return false;
  }

  const message = `
🔔 *New Contact Form Submission*

👤 *Name:* ${data.name.trim()}
📧 *Email:* ${data.email.trim()}
📱 *Phone:* ${data.phone.trim()}

💬 *Message:*
${data.message.trim()}

⏰ *Submitted:* ${new Date().toISOString()}
  `.trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return false;
  }
}

app.post('/api/contact', async (req, res) => {
  console.log('📩 Received contact form submission:', req.body);
  try {
    const clientIP = getClientIP(req);
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
        retryAfter: RATE_LIMIT_WINDOW / 1000,
      });
    }

    const validatedData = contactSchema.parse(req.body);
    const telegramSent = await sendToTelegram(validatedData);

    if (!telegramSent) {
      return res.status(500).json({ error: 'Failed to send message.' });
    }

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid form data', details: error.errors });
    }
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Chat Route
const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() })),
  })).optional().default([]),
});

function sanitizeInput(input) {
  return input.replace(/system prompt/gi, '[REDACTED]').substring(0, 2000);
}

app.post('/api/chat', async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.allowed) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const validatedData = chatSchema.parse(req.body);
    
    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'I understand.' }] },
      ...validatedData.history.map(msg => ({
        role: msg.role,
        parts: msg.parts.map(part => ({
          text: msg.role === 'user' ? sanitizeInput(part.text) : part.text
        }))
      })),
      { role: 'user', parts: [{ text: sanitizeInput(validatedData.message) }] }
    ];

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?alt=sse&key=${apiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const parser = createParser((event) => {
        try {
            if (event.type === 'event') {
                const data = JSON.parse(event.data);
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    res.write(`data: ${JSON.stringify({ text })}\n\n`);
                }
            }
        } catch (e) {
            console.error('Parse error', e);
        }
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            parser.feed(decoder.decode(value));
        }
        res.write('data: {"done": true}\n\n');
        res.end();
    } catch (e) {
        console.error('Stream error', e);
        res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
        res.end();
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data' });
    }
    console.error('Chat API Error:', error);
    if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
    }
  }
});

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});



// Export app for Vercel
export default app;

// Only listen if run directly
if (process.env.NODE_ENV !== 'production' && process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

