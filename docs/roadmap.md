# Roadmap

## Current Status ✅

- Express server with TypeScript
- Supabase Auth integration
- JWT-based authentication
- Session management
- Health check system
- Path aliases for clean imports

---

## Planned Features

### Phase 1: Content Management

- [ ] **Blog Posts**
  - Create `blog_posts` table
  - CRUD endpoints
  - Rich text content support
  - SEO metadata

- [ ] **Gallery System**
  - Create `gallery` table
  - Image upload to Supabase Storage
  - Categories and tags

- [ ] **Success Stories**
  - Create `success_stories` table
  - Media attachments
  - Featured stories

### Phase 2: Training & Programs

- [ ] **Training Programs**
  - Create `training_programs` table
  - Program categories
  - Scheduling

- [ ] **Enrollment System**
  - User enrollment
  - Progress tracking
  - Completion certificates

### Phase 3: Communication

- [ ] **Contact Form**
  - Create `contact_submissions` table
  - Email notifications
  - Spam protection (reCAPTCHA)

- [ ] **Notifications**
  - Email templates
  - In-app notifications

### Phase 4: Quality & Deployment

- [ ] **Testing**
  - Unit tests with Jest
  - Integration tests
  - E2E API tests

- [ ] **Documentation**
  - OpenAPI/Swagger spec
  - Deployment guide
  - Contributing guide

- [ ] **DevOps**
  - CI/CD pipeline
  - Docker containerization
  - Production deployment

---

## Database Migrations

Create new migrations with Supabase CLI:

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Create migration
supabase migration new create_blog_posts

# Apply migrations
supabase db push
```
