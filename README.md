# OpenResume

Open-source resume builder. Type into a structured editor, drag sections around, and export a clean PDF. AI features are optional and BYOK (you bring your own Gemini API key — we don't run a paid AI service on your behalf).

## Stack

- **Frontend** — Next.js 16, React 19, TypeScript, Tailwind v4, Zustand, IndexedDB (via idb-keyval)
- **PDF** — `@react-pdf/renderer` (client-side, no server roundtrip)
- **API** — Hono on Cloudflare Workers, better-auth, D1 (Drizzle)
- **AI** — Google Gemini via the official SDK; BYOK
- **Templates** — 9 ATS-friendly layouts in `packages/renderer/src/templates`
- **Monorepo** — pnpm workspaces + Turborepo

## Layout

```
apps/
  web/         Next.js frontend (the builder)
  api/         Hono API on Cloudflare Workers
packages/
  schema/      Zod schemas + TS types
  renderer/    Resume templates + section ordering
  db/          Drizzle schema + migrations
services/
  pdf-worker/  Stub for server-side Playwright PDF rendering (not used yet)
```

## Local setup

Requires Node 22+ and pnpm 10.

```bash
pnpm install
pnpm build           # builds all packages
pnpm dev             # runs web + api in parallel
```

The web app runs on `http://localhost:3000` and expects the API on `http://localhost:8787` (override with `NEXT_PUBLIC_API_URL`).

For the API, copy `apps/api/.env.example` to `apps/api/.dev.vars` and fill in `BETTER_AUTH_SECRET` (anything 32+ chars works in dev). OAuth provider keys are optional for local hacking.

D1 migrations live in `packages/db/migrations`. Generate new ones with `pnpm db:generate`, apply with `pnpm db:migrate`.

## AI features (BYOK)

AI tools (rewrite, chat, tailor, ATS scoring) all run against the Gemini API using a key the user provides. The key is stored only in the user's browser (localStorage) and sent per-request in the `X-Byok-Key` header. We never persist it server-side, and the platform does not provide a default key.

To use AI features, the user pastes a key from [Google AI Studio](https://aistudio.google.com/apikey) into the AI panel in the builder. The key is validated with a 1-token ping before it's saved.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Run web + api in dev mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | TypeScript check across the workspace |
| `pnpm format` | Prettier write |
| `pnpm db:generate` | Generate Drizzle migration from schema |
| `pnpm db:migrate` | Apply D1 migrations |
| `pnpm db:studio` | Open Drizzle Studio |

## License

MIT.
