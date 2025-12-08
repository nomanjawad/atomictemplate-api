# AtomicTemplate API

This repository contains the backend API for AtomicTemplate.

## Getting started

- Copy `.env.example` to `.env` and fill in Supabase credentials

```bash
cp .env.example .env
# edit .env
```

- Install dependencies

```bash
pnpm install
```

- Run dev server

```bash
pnpm dev
```

## Project structure

- `src/app.ts` - express app setup
- `src/server.ts` - server entry script
- `src/routes` - API routes
- `src/controllers` - controllers and logic
- `src/db` - supabase client
- `src/middleware` - auth, validation, error handling

## How to use

- Server admin keys (service role) are not included by default in examples. If you need admin features like creating users from server side, set a server-side secret (e.g. `SUPABASE_SERVER_KEY`) in your hosting secret manager; do not store it in code or repo.
- Prefer `SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for frontend) instead of `SUPABASE_ANON_KEY`.
- `SUPABASE_SERVICE_ROLE_KEY` (server-only): obtain from Supabase dashboard → Settings → API → Service Role Key (do not expose publicly)
- For migrations, set standard Postgres env vars: `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` (these are included in `.env.example`)
- For local dev, you may run without `SUPABASE_SERVICE_ROLE_KEY`, but admin endpoints like `POST /api/auth/register` will be disabled.
- `SUPABASE_SERVICE_ROLE_KEY` (server-only): obtain from Supabase dashboard → Settings → API → Service Role Key (do not expose publicly)
- For migrations, set standard Postgres env vars: `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` (these are included in `.env.example`)
- For local dev, you may run without `SUPABASE_SERVICE_ROLE_KEY`, but admin endpoints like `POST /api/auth/register` will be disabled.

## Notes

- Validation schemas are imported from `@atomictemplate/validations` to keep frontend/backend schemas in sync.
- Validation schemas are imported from `@atomictemplate/validations` to keep frontend/backend schemas in sync.

### Keys & Notes

- Prefer `SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for client-side interactions.
- The server should use `SUPABASE_SERVICE_ROLE_KEY` for admin operations. Keep it secret.
