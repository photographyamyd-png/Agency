# Agency OS

Private client management system for solo web design + local SEO agencies.

## What's included

- **Marketing homepage** (`/`) — lead capture form → Neon PostgreSQL
- **Admin dashboard** (`/admin/login` → Google OAuth) — leads, clients, pipeline
- **Client portal** (`/client/login`) — email/password + magic link
- **Onboarding engine** — welcome email, questionnaire, auto checklists & proposals
- **Free data stack** — Neon PostgreSQL + Vercel + Gmail

## Quick start

### 1. Install

```bash
npm install
```

### 2. Database (Neon — free)

1. Create a project at [neon.tech](https://neon.tech)
2. Copy **pooled** connection string → `DATABASE_URL`
3. Copy **direct** connection string → `DIRECT_URL`
4. Add to `.env.local`:

```bash
cp .env.example .env.local
```

### 3. Migrate & seed

```bash
npx prisma generate
npm run db:migrate
npm run db:seed
```

### 4. Auth & email

| Variable | How to get it |
|----------|----------------|
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Your Google account email |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | [Google Cloud Console](https://console.cloud.google.com) → OAuth client |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Gmail → App passwords (2FA required) |
| `ENCRYPTION_KEY` | `openssl rand -base64 32` |

### 5. Run

```bash
npm run dev
```

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Marketing homepage |
| http://localhost:3000/admin/login | Admin (you) |
| http://localhost:3000/client/login | Client portal |
| http://localhost:3000/dashboard | Admin dashboard |

## Deploy (Vercel — free)

1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add all env vars from `.env.local`
4. Deploy — run migrations against Neon production URL

## Data storage

All client data, forms, leads, onboarding answers, checklists, and reports live in **your Neon PostgreSQL database** via Prisma. No third-party CRM or form tools required.

Browse data locally: `npx prisma studio`

## Project structure

```
app/
  page.tsx                 # Marketing homepage
  thank-you/               # Post-lead confirmation
  (auth)/admin/login/      # Admin Google OAuth
  (auth)/client/login/     # Client login + magic link
  client/                  # Client portal (dashboard, reports, integrations)
  portal/onboarding/       # Token-secured questionnaire
  (dashboard)/             # Admin routes (leads, clients, settings, …)
lib/
  onboarding/              # Rules engine + email send
  email/gmail.ts           # Outbound email
  events/                  # SystemEvent bus
prisma/schema.prisma       # Full data model
```

## Cron jobs (Vercel)

Set `CRON_SECRET` in env. Vercel cron (see `vercel.json`):

| Schedule | Endpoint | Purpose |
|----------|----------|---------|
| Daily 6am UTC | `/api/cron/sync-google` | Pull GA4 + GSC data |
| Mondays 8am UTC | `/api/cron/reports?type=auto` | Weekly report emails |

Manual trigger:
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-app.vercel.app/api/cron/sync-google
```

## Google OAuth setup

In Google Cloud Console, add redirect URI:
```
https://your-domain.com/api/integrations/google/callback
```

Enable **Google Analytics Data API**, **Google Analytics Admin API**, **Search Console API**, and **My Business Business Information API** (for GBP).

## Stripe invoicing

1. Create a Stripe account and add keys to `.env`:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
2. Add webhook endpoint in Stripe Dashboard:
   ```
   https://your-domain.com/api/webhooks/stripe
   ```
   Listen for `checkout.session.completed` and `payment_intent.succeeded`.
3. In admin: **Invoices → New Invoice** → create draft → **Send via Stripe** emails a Checkout link to the client's billing email.

## Google Business Profile (GBP)

Clients connect GBP from **Integrations** (client portal or admin client page). OAuth requests Business Profile scope; after auth, select a location. GBP sync runs with the daily Google cron job.

## Phase 3 features (complete)

- **Stripe invoicing** — create/send invoices, webhook marks paid
- **GBP integration** — OAuth + location select + sync
- **Visual questionnaire editor** — Settings → Onboarding
- **Live dashboard/metrics** — real data from Prisma (clients, invoices, ranks, traffic)

## Next steps

See `AGENCY_OS_SPEC.md` for the full roadmap.
