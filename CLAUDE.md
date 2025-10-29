# Continuum Clinic - Development Guide

This document provides comprehensive guidance for AI assistants and developers working on the Continuum Clinic website.

## Project Overview

**Continuum Clinic** is a London-based veterinary longevity and regenerative medicine centre specializing in companion animals (primarily dogs). The website serves as both a public-facing marketing site and a comprehensive platform for client and patient management.

### Core Services
- Longitudinal health management with AI-assisted analysis
- Evidence-guided longevity pharmacology (rapamycin, procyanidin C1, SGLT2 inhibitors, acarbose)
- AAV gene therapies (follistatin, Klotho, TERT)
- Cell therapies (NK cells, stem-cell protocols)
- Complex oncology and degenerative disease management
- Advanced diagnostics (molecular profiling, genomic testing, continuous biomarker monitoring)

## Technical Architecture

### Stack
- **Framework**: Next.js 15.3+ with App Router
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **i18n**: next-intl (6 languages)
- **Database**: Redis KV (Upstash) - replaces Supabase
- **Email**: Resend API
- **Authentication**: JWT with Redis-backed sessions
- **Deployment**: Vercel

### Design Philosophy
- **Minimalism**: 2-color system (black/white with dark mode)
- **8pt Spacing Grid**: All spacing must be multiples of 8px
- **Component Limit**: Maximum 11 shadcn/ui components (enforced constraint)
- **Performance First**: Target LCP ≤ 2.5s, INP < 200ms, CLS < 0.1
- **System Fonts Only**: No custom font loading for optimal performance

## Data Architecture

### Redis KV Schema

#### Sessions
```
session:{sessionId} → JSON (admin sessions)
session:client:{clientId} → clientId (client sessions)
```

#### Clients
```
client:{clientId} → JSON {
  id, email, passwordHash, firstName, lastName,
  phone, address, createdAt, updatedAt, lastLogin
}
clients:index → Set of client IDs
clients:email:{email} → clientId
```

#### Pets
```
pet:{petId} → JSON {
  id, clientId, name, species, breed, dateOfBirth,
  weight, sex, microchipId, insuranceDetails, photoUrl, notes
}
pets:index → Set of pet IDs
pets:client:{clientId} → Set of pet IDs
```

#### Health Records
```
health-record:{recordId} → JSON {
  id, petId, type, date, veterinarian, diagnosis, notes,
  medications[], labResults[], biomarkers[], followUpDate
}
health-records:pet:{petId} → Sorted Set by date
```

#### Appointments
```
appointment:{appointmentId} → JSON {
  id, clientId, petId, clientName, clientEmail, petName,
  type, date, time, status, notes, internalNotes
}
appointments:list → Sorted Set by date
```

#### Content (Blog Posts)
```
post:{postId} → JSON {
  id, locale, title, slug, excerpt, content,
  author, coverImage, tags, category, status, seo
}
posts:list → List of post IDs
```

#### Analytics
```
analytics:views:{date}:{path} → count
analytics:llm:{bot}:{date} → count (ChatGPT, Claude, Perplexity)
analytics:contacts:{date} → count
```

## Authentication System

### Admin Authentication
- JWT tokens signed with `JWT_SECRET`
- 7-day session expiry
- Sessions stored in Redis: `session:{userId}`
- HTTP-only cookies: `admin-token`
- Protected routes: `/admin/*`

### Client Authentication
- Separate JWT tokens signed with `CLIENT_JWT_SECRET`
- 30-day session expiry
- Sessions stored in Redis: `session:client:{clientId}`
- HTTP-only cookies: `client-token`
- Protected routes: `/portal/*`

### Password Security
- bcrypt hashing with 12 rounds
- Never store plain passwords
- Email verification for new registrations (via Resend)

## Email Integration (Resend)

### From Address
Always use: `boris@199.clinic`

### To Address
Clinic email: `info@thecontinuumclinic.com`

### Email Templates
1. **Contact Form** - Inquiry submissions
2. **Appointment Confirmation** - Sent to client
3. **Appointment Notification** - Sent to clinic staff
4. **Client Welcome** - New account registration
5. **Health Record Update** - New record added to pet profile
6. **Follow-up Reminder** - Scheduled follow-ups (planned)

## Internationalization

### Supported Languages
- English (en) - Default
- Spanish (es)
- French (fr)
- Chinese (zh)
- Russian (ru)
- Arabic (ar) - RTL support

### Translation Keys
All user-facing text must use translation keys:
```tsx
const t = useTranslations()
<h1>{t('hero_title')}</h1>
```

### RTL Support
Arabic automatically switches to RTL layout via `getDirection()` utility.

## Component Guidelines

### Layout Components
- **Section**: Use `gutter="xs|sm|md"` for consistent vertical spacing
- **Container**: Use `size="narrow|default|wide"` for max-width control
- **Header**: Sticky header with navigation and theme switcher
- **Footer**: Contact info, links, copyright

### Spacing Rules
Only use these values:
- `py-12` (48px) - xs gutter
- `py-16` (64px) - sm gutter (default)
- `py-24` (96px) - md gutter
- `px-6`, `px-8`, `px-12` - horizontal padding (responsive)
- `gap-4`, `gap-6`, `gap-8` - flexbox/grid gaps

Never use arbitrary values like `py-15` or `gap-5`.

### shadcn/ui Components (11 Maximum)
1. Button
2. Input
3. Textarea
4. Card
5. Dialog
6. Select
7. Calendar
8. Badge
9. Alert
10. Table
11. Dropdown Menu

If more components are needed, justify why and which component to remove.

## SEO & AI Optimization

### Structured Data (JSON-LD)
- `LocalBusiness` + `MedicalBusiness` schema
- `FAQPage` for common questions (optimized for ChatGPT/Perplexity citations)
- `Article` schema for blog posts with E-E-A-T signals
- `MedicalOrganization` with services
- `BreadcrumbList` for navigation

### Meta Tags
- Dynamic OG images for social sharing
- Multi-language hreflang tags
- Twitter cards
- Canonical URLs

### AI Search Optimization
- FAQ schema for voice search
- Entity recognition (clinic name, location, services)
- Topic clusters for longevity keywords
- Semantic keyword optimization

### LLM Traffic Detection
Track visits from:
- ChatGPT
- Claude
- Perplexity
- Google Gemini/Bard
- Traditional search bots (Google, Bing)

## API Routes Structure

### Public Routes
- `POST /api/contact` - Contact form submission
- `POST /api/appointments` - Appointment booking
- `POST /api/analytics` - Page view tracking

### Client Portal Routes
- `POST /api/auth/client/register` - New client signup
- `POST /api/auth/client/login` - Client login
- `POST /api/auth/client/logout` - Client logout
- `GET /api/auth/client/session` - Check session
- `GET /api/clients/[id]` - Client profile
- `PUT /api/clients/[id]` - Update profile
- `GET /api/pets` - List client's pets
- `POST /api/pets` - Add new pet
- `GET /api/pets/[id]` - Pet details
- `GET /api/health-records` - Pet health records

### Admin Routes
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/admin/clients` - All clients
- `GET /api/admin/pets` - All pets
- `POST /api/admin/health-records` - Create record
- `GET /api/admin/analytics` - Dashboard metrics
- `GET /api/admin/appointments` - All appointments
- `POST /api/content` - Create blog post
- `PUT /api/content/[id]` - Update blog post

## Rate Limiting

```typescript
RATE_LIMITS = {
  contact: { window: 60 * 60, max: 3 },      // 3 per hour
  login: { window: 15 * 60, max: 5 },        // 5 per 15 min
  appointment: { window: 24 * 60 * 60, max: 5 } // 5 per day
}
```

Use `checkRateLimit()` from `/lib/redis.ts` on all public endpoints.

## Development Workflow

### Adding a New Feature
1. Define types in `/types`
2. Add Redis operations to `/lib/redis.ts`
3. Create API routes in `/app/api`
4. Build components in `/components`
5. Add translations to all 6 locale files
6. Update this documentation

### Creating Blog Posts
Posts are stored in Redis as JSON:
```typescript
{
  id: string
  locale: string
  title: string
  slug: string
  excerpt: string
  content: string (markdown)
  author: string
  coverImage?: string
  tags: string[]
  category?: string
  status: 'draft' | 'published' | 'archived'
  publishedAt?: string
  seo: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
}
```

### Deployment Checklist
- [ ] Run `npm run typecheck`
- [ ] Run `npm run lint`
- [ ] Test all critical paths
- [ ] Verify environment variables on Vercel
- [ ] Commit with detailed message
- [ ] Push to 199-biotechnologies GitHub
- [ ] Deploy: `vercel --prod`
- [ ] Test production deployment
- [ ] Monitor analytics for errors

## Common Tasks

### Generate JWT Secret
```bash
openssl rand -base64 32
```

### Add New Language
1. Add locale to `i18n/config.ts`
2. Create `/i18n/locales/{locale}.json`
3. Copy all keys from `en.json` and translate
4. Update `localeNames` in config
5. Test RTL if needed

### Create New Admin Page
1. Add route to `/app/admin/{page}`
2. Wrap with `requireAdminAuth()` server-side
3. Add to `ADMIN_NAVIGATION` in `/lib/constants.ts`
4. Add translation keys for navigation

### Add New Service
1. Update `SERVICES` in `/lib/constants.ts`
2. Add translation keys to all locales
3. Create dedicated service page (optional)
4. Update structured data schema

## Performance Targets

- **LCP (Largest Contentful Paint)**: ≤ 2.5s
- **FID (First Input Delay)**: ≤ 100ms (or INP < 200ms)
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTI (Time to Interactive)**: ≤ 3.8s
- **Page Size**: < 500KB initial load

## Security Best Practices

### Never Commit
- API keys, secrets, passwords
- `.env` or `.env.local` files
- Database connection strings
- JWT secrets

### Always Do
- Use environment variables
- Hash passwords with bcrypt
- Validate all user input with Zod
- Sanitize content before rendering
- Use HTTPS in production
- Set HTTP-only cookies for sessions
- Implement CSRF protection
- Rate limit all public endpoints

## Git Workflow

### Commit Messages
Use clear, descriptive commits:
```
✨ Add client portal authentication
🐛 Fix health record date formatting
📝 Update deployment documentation
♻️ Refactor Redis client queries
🎨 Improve services section layout
```

### Branch Strategy
- `main` - production branch
- Feature branches: `feature/client-portal`
- Bugfix branches: `bugfix/login-redirect`

Always commit to 199-biotechnologies organization, not personal GitHub.

## Support & Contact

- **Developer Email**: boris@199.clinic
- **Clinic Email**: info@thecontinuumclinic.com
- **Repository**: https://github.com/199-biotechnologies/continuum-clinic

## Future Roadmap

### Phase 1 (MVP) ✅
- [x] Multi-language website
- [x] Redis KV integration
- [x] Resend email integration
- [x] Core architecture

### Phase 2 (In Progress)
- [ ] Client portal with authentication
- [ ] Pet profile management
- [ ] Health record tracking
- [ ] Appointment booking system

### Phase 3
- [ ] Admin dashboard
- [ ] Content management (blog)
- [ ] Analytics dashboard
- [ ] Email automation

### Phase 4
- [ ] Advanced features (biomarker trends, medication reminders)
- [ ] Mobile app considerations
- [ ] Integration with clinic management software
