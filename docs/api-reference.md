# API Reference

Base URL: `http://localhost:3000/api`

## Health Check

### GET /health
Check service health status.

**Response:**
```json
{
  "ok": true,
  "status": {
    "healthy": true,
    "timestamp": "2025-12-09T08:00:00.000Z",
    "services": {
      "supabaseAPI": { "ok": true },
      "supabaseAuth": { "ok": true, "sessionActive": false },
      "supabaseStorage": { "ok": true, "bucketsCount": 0 }
    }
  }
}
```

---

## Authentication

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "user": { "id": "...", "email": "user@example.com" },
  "session": { "access_token": "...", "refresh_token": "..." }
}
```

---

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": { "id": "...", "email": "user@example.com" },
  "session": {
    "access_token": "eyJ...",
    "refresh_token": "...",
    "expires_in": 259200
  }
}
```

---

### POST /auth/logout
Logout current user.

**Response:** `200 OK`
```json
{ "message": "Logout successful" }
```

---

### GET /auth/me
Get current user profile. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "full_name": "John Doe",
    "created_at": "..."
  }
}
```

---

## Admin

### GET /admin/status
Get system configuration status.

**Response:**
```json
{
  "message": "Admin status",
  "environment": {
    "nodeEnv": "development",
    "url": "configured",
    "publishableKey": "configured"
  }
}
```

---

## Blog

### GET /blog
List all blog posts.

**Response:**
```json
{ "data": [...] }
```

### GET /blog/:slug
Get a blog post by slug.

**Response:**
```json
{ "data": { "slug": "...", "title": "...", "content": "..." } }
```
