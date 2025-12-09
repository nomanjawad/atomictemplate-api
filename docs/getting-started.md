# Getting Started

## Prerequisites

- Node.js >= 20
- pnpm (recommended) or npm
- Supabase account and project

## Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Public anon key from Supabase |
| `PORT` | Server port (default: 3000) |

## Running the Server

```bash
# Development (with hot reload)
pnpm dev

# Production build
pnpm build
pnpm start
```

## Verify Setup

Check the health endpoint:

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "ok": true,
  "status": {
    "healthy": true,
    "services": {
      "supabaseAPI": { "ok": true },
      "supabaseAuth": { "ok": true },
      "supabaseStorage": { "ok": true }
    }
  }
}
```

## Next Steps

1. Read [API Reference](./api-reference.md) for available endpoints
2. Check [Architecture](./architecture.md) for project structure
3. See [Roadmap](./roadmap.md) for planned features
