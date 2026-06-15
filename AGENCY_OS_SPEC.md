# Agency OS — Master Specification

> Reference this file in every phase prompt: `@AGENCY_OS_SPEC.md`
> UI authority: **Section 13** — all visual decisions derive from there.

Agency OS is a private web application for running a solo web design + local SEO agency end-to-end. Two user tiers: admin (single owner) and clients (limited portal login). Client data is cross-connected via a central event system.

## Tech Stack

- **Framework:** Next.js 15+ (App Router, Server Components, TypeScript strict)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Auth.js — admin (Google OAuth) + client portal (credentials) [v2]
- **Storage:** Vercel Blob | **Email:** Resend | **Payments:** Stripe
- **Charts:** Recharts | **PDF:** @react-pdf/renderer

## Build Order (Phases)

| Phase | Scope |
|-------|-------|
| **0** | Foundation — design tokens, layout shell, UI primitives, view toggle, Prisma schema, auth skeleton |
| **1** | Leads & Discovery — CRUD, kanban, discovery call, convert to client |
| **2** | Intake webhook, proposals, e-signature |
| **3** | Client workspace — brand profile, access vault, keyword sync |
| **3.5** | Client portal login [v2] |
| **4** | Sitemap, wireframes, design approval |
| **5** | Asset/media pipeline |
| **6** | SEO matrix & launch (+ Google Indexing API [v2]) |
| **7** | Financial operations |
| **8** | Retainer cycle & reporting |
| **8.5** | Monthly maintenance checklist [v2] |
| **9** | Communication, tasks, renewals, offboarding |
| **9.5** | System event log & full event wiring [v2] |
| **10** | Dashboard polish & settings |

---

## 13. UI / Design System [v3]

**This section is the authority for all UI decisions.** Do not use Tailwind defaults, shadcn defaults, or generic dashboard templates as visual starting points.

### 13.1 Global Theme & Design Tokens

#### Colors (60-30-10 Rule)
- **60% Base:** `#FFFFFF` (light) / `#0A0A0A` (dark) — flat, calm backgrounds
- **30% Surfaces:** `bg-zinc-50` / `bg-zinc-900` with `border-zinc-200` / `border-zinc-800`
- **10% Accent:** Single brand color (indigo) — **only** for primary CTAs and active states
- **Semantic (exception):** `emerald-500` (success), `rose-500` (danger), `amber-500` (warning) — status/trends only, never mixed with brand accent

#### Typography
- Primary font: Inter (or SF Pro / Roboto)
- All numeric columns/metrics: `tabular-nums` globally

#### Dark Mode
- Class-based toggle on `<html class="dark">`
- CSS variables in `app/globals.css`

### 13.2 Layout Shell

- **Sidebar:** Fixed 260px — branding, nav (Dashboard, Clients, Metrics, Invoices, Settings), user profile footer
- **Main canvas:** Scrollable, F-pattern — header zone (title + actions) then content
- Responsive: collapse sidebar at 768px with hamburger menu

### 13.3 Component Patterns

#### KPI Cards (5-Second Rule)
1. Subdued small title
2. Massive bold metric (`tabular-nums`)
3. Small semantic trend badge (+ arrow)

#### Data Tables (Linear-inspired)
- Dense, fixed row heights, `truncate`, explicit column widths
- Zebra striping or `hover:bg-zinc-100/50`
- Single-pixel borders, no bulky card wrappers

#### Empty States
- Subtle icon + clear description + primary CTA

#### Skeleton Loaders
- `animate-pulse` for KPI blocks and table layouts

### 13.4 Role-Based Views

Toggle via `?view=agency|client` URL param:

**Agency View** (managers): 4-col KPI grid → line charts → filterable data table with search, tags, multi-select

**Client View** (business owners): 2-col outcome KPIs → bar chart → activity timeline → raw data behind progressive disclosure layer

### 13.5 Interaction States
- Nav active: accent color only (never semantic green/red)
- Hover/focus on all interactive elements
- Mobile responsive minimum 768px

---

## Route Structure

```
app/
  (auth)/login/
  (dashboard)/
    dashboard/    clients/    invoices/    metrics/    settings/
  (client-portal)/   [v2]
  portal/            [token-secured]
  api/auth/          api/webhooks/    api/cron/
```

## Environment Variables

See `.env.example` for the full list including DATABASE_URL, NEXTAUTH_*, ADMIN_EMAIL, STRIPE_*, RESEND_*, BLOB_*, ENCRYPTION_KEY, CRON_SECRET, and Google Indexing API [v2].

## Data Model

Full Prisma schema in `prisma/schema.prisma` — includes all models from the original spec plus v2 additions: ClientPortalUser, SystemEvent, MaintenanceChecklist, UptimePing, index tracking on PageNode.

## Coding Conventions

- TypeScript strict; Zod validation on all inputs
- Server Actions for mutations; API routes for webhooks/cron/portal
- `formatCurrency(amount, 'CAD')` for all money fields
- Every client portal action verifies `session.clientId === targetClientId`
- Every significant mutation emits a `SystemEvent` [v2]
- Keyword updates go through `lib/keywords.ts` event bus [v2]

## Security Checklist [v2]

- Admin routes: Google OAuth + ADMIN_EMAIL allowlist
- Client portal: separate auth, read-only, vault never accessible
- Cron routes: `Authorization: Bearer ${CRON_SECRET}`
- Portal tokens: signed JWTs with expiry
- Credential vault: AES-256-GCM, decrypt on explicit reveal only

---

*For the complete module specifications (leads, proposals, SEO, financial, etc.), refer to the full spec document sections 7–12 in the original build prompt.*
