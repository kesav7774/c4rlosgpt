# c4rlosgpt

A clean React/Vite AI chat starter rebuilt from the beginning.

## Features

- c4rlosgpt branding
- No subscriptions, credits, premium gates, billing, or payment code
- Server-side AI provider proxy
- Text and image attachment selection
- 10 MB file-size validation
- Responsive mobile layout
- Local development with Vite and Express

## Setup

1. Rename generated files to their project paths:
   - `src_main.txt` â†’ `src/main.tsx`
   - `src_App.txt` â†’ `src/App.tsx`
   - `src_styles.txt` â†’ `src/styles.css`
   - `server.txt` â†’ `server.ts`
   - `vite.config.txt` â†’ `vite.config.ts`
   - `index.html` is already the correct filename.
2. Copy `.env.example` to `.env`.
3. Set `OPENAI_API_KEY` in `.env`.
4. Install dependencies:

```bash
npm install
```

5. Start development mode:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Production

```bash
npm run build
npm start
```

Never commit `.env`, API keys, user databases, or provider credentials.
