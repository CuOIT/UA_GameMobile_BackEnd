# UA Marketing Backend

Small backend for the UA Marketing learning site. It intentionally only owns server-side provider calls for AI chat.

## Responsibilities

- Keep AI provider API keys off the frontend.
- Expose `POST /api/chat` for the frontend chatbot.
- Add CORS for a separately deployed frontend.

Supabase Auth and progress sync stay in the frontend because Supabase uses a browser-safe publishable key plus Row Level Security.

## Local Run

```powershell
$env:OPENAI_API_KEY="your_provider_key"
$env:ALLOWED_ORIGIN="http://127.0.0.1:4173"
node server.js
```

The local backend URL is:

```text
http://127.0.0.1:8787/api/chat
```

## Vercel Deploy

Deploy this backend folder as its own Vercel project.

Environment variables:

- `OPENAI_API_KEY` or `AI_PROVIDER_API_KEY`: required
- `AI_MODEL`: optional, defaults to `gpt-4o-mini`
- `AI_PROVIDER_URL`: optional, defaults to OpenAI chat completions
- `ALLOWED_ORIGIN`: frontend origin, for example `https://your-frontend.vercel.app`