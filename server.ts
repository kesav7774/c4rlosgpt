import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 5173);

app.use(express.json({ limit: '12mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'c4rlosgpt', activeModel: 'Configured server model' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], model, temperature = 0.7 } = req.body || {};
    const apiKey = process.env.OPENAI_API_KEY;
    const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const providerModel = process.env.OPENAI_MODEL || model || 'gpt-4o-mini';

    if (!apiKey) {
      return res.status(503).json({
        error: 'AI provider is not configured. Set OPENAI_API_KEY in .env.'
      });
    }

    const upstream = await fetch(`${baseURL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model: providerModel, messages, temperature })
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.error?.message || 'AI request failed.' });
    }

    res.json({
      content: data?.choices?.[0]?.message?.content || '',
      model: providerModel
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Chat request failed.' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
}

app.listen(port, () => {
  console.log(`c4rlosgpt running at http://localhost:${port}`);
});
