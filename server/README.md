# ContractorHub API Server

Express + Node.js backend for ContractorHub.

## Quick Start

```bash
cd server
cp .env.example .env
# Fill in OPENAI_API_KEY in .env
npm install
npm start
```

API runs on `http://localhost:3001`.

## Environment Variables

| Variable | Required | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | **Yes** | OpenAI API key (get at platform.openai.com) |
| `SMTP_HOST` | Dev | SMTP host for email delivery |
| `SMTP_USER` | Dev | SMTP username |
| `SMTP_PASS` | Dev | SMTP password / app password |
| `CLOUDINARY_*` | Prod | Cloudinary for image hosting |
| `PORT` | No | Default: 3001 |

## Endpoints

```
GET  /api/health               — Health check
POST /api/estimate/create      — Create new estimate
GET  /api/estimate/:id         — Get estimate by ID
POST /api/estimate/:id/chat    — GPT-4o scope chat
POST /api/estimate/:id/generate-quote  — GPT-4o quote generation
POST /api/estimate/:id/generate-visuals — DALL-E 3 visual gen
POST /api/estimate/:id/send-quote       — Email delivery
POST /api/upload              — Image upload (mock in MVP)
```

## Development

```bash
npm run start # Run server only
npm run dev         # Run with Vite frontend (from root)
```

## Production Deploy

Deploy to Railway, Render, or Fly.io:
- Build command: `npm install`
- Start command: `npm start`
- Add all `.env` vars to the hosting dashboard

## Notes

- **No API key = mock mode** — the server starts and returns friendly errors, no crashes
- **No SMTP = mock email** — emails log to console instead of sending
- **Phase 2:** Swap in-memory `Map()` for Neon PostgreSQL + Prisma
