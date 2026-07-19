# Agency OS Phases 4–9 Roadmap

This document plans remaining Agency OS spec work outside Blueprint v3 delivery tabs. Blueprint gaps from the gap analysis are implemented in code; this roadmap covers the broader platform features from [AGENCY_OS_SPEC.md](AGENCY_OS_SPEC.md).

## Phase 4 — Wireframes & Design Approval

**Goal:** Client-facing design review before build.

| Deliverable | Schema | Status |
|---|---|---|
| Wireframe upload per PageNode | `DesignAsset` | Planned |
| Figma/Excalidraw external links | `DesignAsset.externalLink` | Planned |
| Token-secured review portal | `DesignAsset.reviewToken` | Planned |
| Pin-position feedback | `DesignFeedback` | Planned |
| Approve / request revision flow | `DesignAssetStatus` enum | Planned |

**Suggested build order:**
1. Admin UI on Site Map tab — attach wireframe link per page
2. Generate review token + email client
3. `/portal/design/[token]` read-only viewer with comment pins
4. Status transitions → unblock BUILD phase on PageNode

---

## Phase 5 — Media / Asset Pipeline

**Goal:** Track hero images, galleries, headshots through optimization and publish.

| Deliverable | Schema | Status |
|---|---|---|
| Media upload metadata | `MediaAsset` | Planned |
| Role tagging (HERO, GALLERY, etc.) | `MediaRole` enum | Planned |
| WebP / alt-text checklist | Link to SEO checklist | Planned |
| Publish state | `MediaStatus` | Planned |

**Dependencies:** Vercel Blob or S3 for file storage (currently URL-paste only in agency settings).

---

## Phase 6 — Google Indexing API (extended)

**Goal:** Automate index requests after publish.

| Deliverable | Status |
|---|---|
| `PageNode.indexStatus` tracking | **Implemented** — Site Map tab |
| Submit via Indexing API | **Implemented** — optional via env vars |
| Manual "Mark indexed" confirmation | **Implemented** |
| GSC coverage cross-check | Planned |

**Env:** `GOOGLE_INDEXING_CLIENT_EMAIL`, `GOOGLE_INDEXING_PRIVATE_KEY`

---

## Phase 7 — Financial Asset Tracking

**Goal:** Track domains, hosting, licenses for renewals and billing.

| Model | Planned UI |
|---|---|
| `DomainRecord` | Settings → Financial or client Vault tab extension |
| `HostingRecord` | Renewal date alerts |
| `LicenseRecord` | Theme/plugin/subscription tracking |

**Integration:** Tie renewal dates to invoice cron and dunning.

---

## Phase 8 — Retainer Automation

**Goal:** Recurring billing and payment follow-up.

| Deliverable | Status |
|---|---|
| Stripe Checkout for invoices | **Implemented** |
| Webhook payment recording | **Implemented** |
| Retainer auto-billing | Planned — use Stripe Subscriptions |
| Dunning automation | Planned — wire `Invoice.dunningStage` |

---

## Phase 9 — Offboarding & Revisions

**Goal:** Clean client exit and scoped revision rounds.

| Model | Planned workflow |
|---|---|
| `OffboardingRecord` | Checklist: revoke access, export data, final report |
| `RevisionTicket` | Round tracking against proposal `maxRounds` |

---

## Phase 9.5 — Full Event Bus

**Goal:** Every mutation emits `SystemEvent`; handlers automate downstream work.

| Area | Status |
|---|---|
| Event types defined | **Partial** — 13 types in `lib/events/types.ts` |
| Emitter on key flows | **Partial** |
| Admin audit page | **Implemented** — `/events` |
| Automated handlers | Planned |

---

## Phase 10 — Dashboard Polish

**Goal:** Section 13 UI spec compliance.

- KPI 5-second rule audit on all dashboard pages
- Client view progressive disclosure
- Kanban drag-and-drop for leads (Phase 1 gap)
- PDF monthly reports via `@react-pdf/renderer`

---

## Infrastructure Decisions

| Spec item | Current | Recommendation |
|---|---|---|
| Email | Gmail SMTP | Keep for free tier; add Resend optional |
| File storage | URL paste | Add Vercel Blob when media pipeline ships |
| PDF reports | Text/email only | Add React PDF in Phase 10 |
| Deploy | Vercel + Neon | Document Render alternative in README if needed |

---

## Priority Recommendation

1. **Phase 4 design approval** — unblocks client sign-off on builds
2. **Phase 8 retainer auto-billing** — revenue automation
3. **Phase 5 media pipeline** — after Blob storage decision
4. **Phase 7 financial assets** — low urgency for solo agency
5. **Phase 9 offboarding** — when client churn becomes regular
6. **Phase 10 polish + PDF** — continuous improvement
