# Continuum Clinic Website

London-based veterinary longevity centre providing AI-guided assessments, personalised protocols, and advanced therapeutics for companion animals worldwide.

## Tech Stack

- **Framework**: Next.js 15.3+ (App Router)
- **React**: 19
- **TypeScript**: 5
- **Styling**: Tailwind CSS v4 (CSS-first config)
- **i18n**: next-intl (6 languages: EN, ES, FR, ZH, RU, AR)
- **Database**: Redis KV (Upstash)
- **Email**: Resend API
- **Authentication**: JWT with Redis sessions
- **Deployment**: Vercel

## Features

### MVP (Current)
- ✅ Multi-language support (6 languages)
- ✅ Dark/light theme with system preference
- ✅ Responsive design with 8pt spacing grid
- ✅ Redis KV integration
- ✅ Resend email integration
- ✅ Type-safe with TypeScript
- ✅ SEO-optimized structure

### Planned Features
- Client portal with authentication
- Pet profile management
- Health record tracking
- Appointment booking system
- Admin dashboard
- Content management system (blog)
- Analytics dashboard with LLM tracking

## Getting Started

### Prerequisites
- Node.js 20+ (LTS)
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/199-biotechnologies/continuum-clinic.git
cd continuum-clinic
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and update the following (if needed):
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `CLIENT_JWT_SECRET` - Generate with: `openssl rand -base64 32`

The Redis and Resend credentials are already configured in `.env.example`.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
continuum-clinic/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── layout.tsx     # Locale-specific layout
│   │   └── page.tsx       # Homepage
│   ├── api/               # API routes (planned)
│   ├── admin/             # Admin dashboard (planned)
│   ├── globals.css        # Tailwind v4 config
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Section, Container, Header, Footer
│   ├── providers/        # ThemeProvider
│   ├── ui/               # shadcn components (planned)
│   ├── admin/            # Admin components (planned)
│   └── portal/           # Client portal components (planned)
├── i18n/                 # Internationalization
│   ├── locales/          # Translation files
│   └── config.ts         # i18n configuration
├── lib/                  # Utilities
│   ├── redis.ts          # Redis KV client
│   ├── auth.ts           # JWT authentication
│   ├── email.ts          # Resend integration
│   ├── analytics.ts      # LLM traffic tracking
│   ├── utils.ts          # Helper functions
│   └── constants.ts      # Site configuration
├── types/                # TypeScript types
│   ├── client.ts         # Client account types
│   ├── pet.ts            # Pet profile types
│   ├── health-record.ts  # Medical record types
│   ├── appointment.ts    # Appointment types
│   └── content.ts        # Blog post types
└── public/               # Static assets
```

## Environment Variables

See `.env.example` for the complete list. Key variables:

```bash
# Redis KV (Upstash) - Pre-configured
REDIS_URL=
REDIS_REST_URL=
REDIS_REST_TOKEN=

# Resend API - Pre-configured
RESEND_API_KEY=
EMAIL_FROM=boris@199.clinic
EMAIL_TO=info@thecontinuumclinic.com

# Authentication - Generate these
JWT_SECRET=
CLIENT_JWT_SECRET=

# App Config
NEXT_PUBLIC_APP_URL=https://thecontinuumclinic.com
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler check

### Adding New Features

1. Create types in `/types`
2. Add utilities in `/lib`
3. Create components in `/components`
4. Add API routes in `/app/api`
5. Update translations in `/i18n/locales`

## Deployment

### Vercel (Recommended)

1. Push to GitHub (199-biotechnologies organization)
2. Import project in Vercel
3. Environment variables are already configured on Vercel
4. Deploy:

```bash
vercel --prod
```

## Design System

### Spacing (8pt Grid)
- XS: 12px (0.75rem)
- SM: 16px (1rem)
- MD: 24px (1.5rem)
- LG: 32px (2rem)
- XL: 48px (3rem)
- 2XL: 64px (4rem)
- 3XL: 96px (6rem)

### Colors
- Minimalist 2-color system (black/white)
- Automatic dark mode support
- System preference detection

### Typography
- System fonts for performance
- Responsive sizing
- Clear hierarchy

## Contributing

This is a private project for Continuum Clinic. For questions or issues, contact boris@199.clinic.

## License

© 2025 Continuum Clinic. All rights reserved.
