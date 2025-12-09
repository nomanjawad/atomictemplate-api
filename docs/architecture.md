# Architecture

## Project Structure

```
src/
├── app.ts              # Express app configuration
├── server.ts           # Server entry point
├── controllers/        # Request handlers
│   ├── index.ts        # Barrel exports
│   ├── admin.controller.ts
│   ├── auth.controller.ts
│   ├── blog.controller.ts
│   └── session.controller.ts
├── db/                 # Database layer
│   ├── index.ts        # Health checks & exports
│   └── supabaseClient.ts
├── middleware/         # Express middleware
│   ├── index.ts        # Barrel exports
│   ├── auth.ts         # JWT verification
│   ├── error.ts        # Error handler
│   └── validate.ts     # Zod validation
└── routes/             # Route definitions
    ├── index.ts        # Main router
    ├── admin/
    ├── auth/
    └── blog/
```

## Path Aliases

Import using aliases instead of relative paths:

```typescript
import { register, login } from '@controllers'
import { supabase } from '@db'
import { requireAuth } from '@middleware'
import authRouter from '@routes/auth/index.js'
```

| Alias | Maps to |
|-------|---------|
| `@controllers` | `src/controllers/index.ts` |
| `@db` | `src/db/index.ts` |
| `@middleware` | `src/middleware/index.ts` |
| `@routes/*` | `src/routes/*` |

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js 20+ |
| Framework | Express 5 |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Validation | Zod |
| Dev Runner | tsx |

## Security

- **Helmet** - HTTP security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - 100 requests per 15 minutes
- **JWT Authentication** - Supabase Auth tokens
- **RLS** - Row Level Security on database

## Data Flow

```
Request → Express → Middleware → Controller → Supabase → Response
                      ↓
              [auth, validate, error]
```
