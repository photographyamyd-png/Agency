export interface SectionGuideLink {
  label: string;
  url: string;
}

export interface SectionGuideBlock {
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface SectionGuideContent {
  title: string;
  purpose: string;
  unlockNote?: string;
  process: SectionGuideBlock[];
  suggestedOrder?: string[];
  links?: SectionGuideLink[];
}

export const SECTION_GUIDES = {
  // —— Overview ——
  "overview.workflow": {
    title: "Blueprint delivery path",
    purpose:
      "The 12-phase Local SEO Blueprint unlocks tabs in order. Complete each phase’s exit criteria before the next opens (or use browse=1 to preview).",
    unlockNote: "Current-step banner shows the exact next action for this client.",
    process: [
      {
        heading: "Follow the path",
        body: "Work the highlighted phase first. Locked tabs stay locked until prior phases pass their gates.",
      },
      {
        heading: "Do this now",
        body: "Use the suggested next actions under the current phase — they are generated from live client data (competitors count, checklist %, etc.).",
      },
    ],
    suggestedOrder: [
      "Finish Intake & Baseline (discovery)",
      "Complete Research (3 competitors + geo-grid)",
      "Keywords → Site Map → On-Page → GBP → Citations → Reviews → Links → Reports",
    ],
  },
  "overview.phases": {
    title: "Blueprint phase progress",
    purpose:
      "Percent-complete bars for all 12 phases based on seeded checklists, competitors, pages, citations, and related records.",
    process: [
      {
        heading: "Read the bars",
        body: "Each bar estimates progress for that phase — not a substitute for the phase unlock gate.",
      },
      {
        heading: "Jump via tabs",
        body: "Open the matching workspace tab to raise a phase’s completion (e.g. add competitors to raise Competitive Research).",
      },
    ],
  },
  "overview.quickRef": {
    title: "Master quick-reference",
    purpose:
      "Pillar cheat sheet (§15) for website foundation, technical SEO, on-page, E-E-A-T, schema, GBP, citations, reviews, links, GEO, tracking, and conversion.",
    process: [
      {
        heading: "Use while delivering",
        body: "Expand a pillar when you need a fast reminder of must-haves without leaving Overview.",
      },
    ],
  },
  "overview.onboarding": {
    title: "Client onboarding status",
    purpose:
      "Shows PROFILE → PACKAGES → AGREEMENT → ACCESS progress, contacts, agreement, and vault/access receipt counts.",
    process: [
      {
        heading: "If stuck",
        body: "Open Portal / Vault / Integrations to finish outstanding access items; onboarding completion can trigger baseline auto-generate when ready.",
      },
    ],
  },

  // —— Intake ——
  "intake.onboarding": {
    title: "Client onboarding (intake)",
    purpose:
      "Confirm the client finished onboarding stages and that contacts, package agreement, and access requests are in place before delivery.",
    process: [
      {
        heading: "Check stages",
        body: "All four stages should show complete for an active retainer. View proposal / Open vault from this panel when needed.",
      },
    ],
  },
  "intake.businessIntel": {
    title: "Business intelligence intake",
    purpose:
      "Capture service lines, geography, ticket value, capacity, lead sources, reputation, competitors, and brand voice — fuel for keywords, content, and proposals.",
    process: [
      {
        heading: "Fill every field you can",
        body: "Phase 1 unlock typically needs several intel fields completed alongside the baseline checklist.",
      },
      {
        heading: "Save",
        body: "Click Save business intelligence — data stores on BrandProfile.businessIntelJson and feeds the baseline report business section.",
      },
    ],
  },
  "intake.baseline": {
    title: "Baseline audit checklist",
    purpose:
      "Confirm tracking, Search Console, GBP state, rankings export, citations spot-check, PageSpeed, and related kickoff items before deeper delivery work.",
    process: [
      {
        heading: "Work each item",
        body: "Open the free tool link, verify the item for this client, set status to Done/N/A, and add notes.",
      },
      {
        heading: "PageSpeed",
        body: "Use Run PageSpeed when a site URL is set — results store in technical health logs and can feed the baseline report.",
      },
    ],
    links: [
      { label: "GA4", url: "https://analytics.google.com" },
      { label: "Search Console", url: "https://search.google.com/search-console" },
      { label: "PageSpeed Insights", url: "https://pagespeed.web.dev" },
    ],
  },
  "intake.baselineReport": {
    title: "Baseline starting report",
    purpose:
      "Freeze kickoff metrics (traffic, ranks, CWV, citations, reviews, etc.) so monthly reports can show progress vs day one.",
    process: [
      {
        heading: "Generate",
        body: "Click Generate baseline report anytime — missing sources show as Not connected rather than inventing numbers.",
      },
      {
        heading: "Auto-generate",
        body: "Also runs when site URL + (Google connected or PageSpeed) + (checklist ≥50% or Access complete). Emails the client if a billing/portal email exists.",
      },
      {
        heading: "Send & compare",
        body: "Send to client from this card. Later monthly reports include vs kickoff baseline deltas.",
      },
    ],
  },

  // —— Research ——
  "research.overview": {
    title: "Competitive Research (Phase 2)",
    purpose:
      "Reverse-engineer the top 3 businesses that show in the Google Map Pack for your client’s main local keywords. Know who you’re beating, what they do on GBP/reviews/content, and turn gaps into a short action list before Keywords and On-Page work.",
    unlockNote:
      "Completing this phase unlocks Keywords: you need 3 competitors and at least 1 geo-grid snapshot.",
    process: [
      {
        heading: "1. Add map-pack competitors",
        body: "Search the primary city + service in Google Maps / local results and capture the top 3 listing rivals.",
      },
      {
        heading: "2. Capture a geo-grid snapshot",
        body: "Record visibility for one seed phrase across nearby locations (free geo-grid tool or manual notes).",
      },
      {
        heading: "3. Enrich + generate action plan",
        body: "Fill review/GBP/phrase fields, then click Generate action plan to queue TODOs from gaps in the data.",
      },
    ],
    suggestedOrder: [
      "Add 3 map-pack competitors (minimum fields first)",
      "Add 1 geo-grid snapshot",
      "Enrich competitor cards (reviews, phrases, GBP notes)",
      "Click Generate action plan",
      "Work the Research Action Plan (and Keywords for intent tags)",
    ],
    links: [
      { label: "Google Maps", url: "https://www.google.com/maps" },
      { label: "Local Falcon", url: "https://www.localfalcon.com" },
      { label: "Localo", url: "https://localo.com" },
      { label: "PlePer", url: "https://pleper.com" },
    ],
  },
  "research.mapPack": {
    title: "Map-Pack Competitors (top 3)",
    purpose:
      "Document the three strongest Map Pack rivals for the client’s core local queries so you can compare categories, reviews, GBP activity, and language they win with.",
    unlockNote: "Phase 2 requires 3 competitors saved on this client.",
    process: [
      {
        heading: "Find the rivals",
        body: "For the client’s primary city + service (e.g. “HVAC Barrie”), open Google Maps / local results and pick the top 3 listing rivals (not paid ads).",
      },
      {
        heading: "Fill each competitor card",
        bullets: [
          "Name, website, GBP primary category",
          "Review count, rating, photos, review velocity",
          "Notes on GBP posts, services, Q&A",
          "“People often mention” / review phrases — one per line (feeds later content/GBP ideas)",
        ],
      },
      {
        heading: "Save and repeat",
        body: "Use Add competitor until you have 3, then Save on each card as you enrich them.",
      },
    ],
    suggestedOrder: [
      "Add all 3 with name + URL first",
      "Backfill GBP category and review stats",
      "Add semantic phrases from reviews",
      "Generate action plan",
    ],
    links: [
      { label: "Google Maps", url: "https://www.google.com/maps" },
      { label: "PlePer (GBP categories)", url: "https://pleper.com" },
      { label: "GMBSpy", url: "https://gmbspy.io" },
    ],
  },
  "research.actionPlan": {
    title: "Generate action plan",
    purpose:
      "Turn research gaps into prioritized TODOs. The button does not scrape Google — it inspects competitors and keywords already saved for this client.",
    process: [
      {
        heading: "What gets created",
        bullets: [
          "Fewer than 3 competitors → URGENT: Complete map-pack competitor audit (top 3)",
          "Keywords without intent tags → QUICK WIN: Tag intent tier on N keywords",
          "Competitors have semantic phrases → MEDIUM: Integrate phrases into content and GBP",
        ],
      },
      {
        heading: "Working the list",
        body: "Mark Done when finished, or Remove if not needed. Running Generate again can add more items if gaps remain — it does not wipe existing items.",
      },
    ],
    suggestedOrder: [
      "Add 3 competitors first",
      "Add semantic phrases where possible",
      "Click Generate action plan",
      "Clear URGENT items, then QUICK WINs",
    ],
  },
  "research.geoGrid": {
    title: "Geo-Grid Snapshots",
    purpose:
      "Capture how visible the client is across a small grid of locations for one seed phrase — a baseline for local pack strength beyond a single ZIP.",
    unlockNote: "Phase 2 requires at least 1 geo-grid snapshot.",
    process: [
      {
        heading: "Run a check",
        body: "Use a free geo-grid tool (Local Falcon / Localo) or note ranks by neighborhood manually for one primary seed phrase.",
      },
      {
        heading: "Save the snapshot here",
        bullets: [
          "Enter the seed phrase (e.g. plumber near me / roofing Barrie)",
          "Add visibility notes by location",
          "Optional: paste a screenshot URL",
          "Click Add geo-grid snapshot",
        ],
      },
    ],
    suggestedOrder: [
      "Pick one primary seed phrase",
      "Capture grid results",
      "Save snapshot in Agency OS",
      "Re-run quarterly for reporting",
    ],
    links: [
      { label: "Local Falcon", url: "https://www.localfalcon.com" },
      { label: "Localo", url: "https://localo.com" },
    ],
  },

  // —— Keywords ——
  "keywords.tab": {
    title: "Keywords & intent",
    purpose:
      "Build the local keyword set and tag intent so content and pages map cleanly (required for later phase gates).",
    unlockNote: "Phase 3 typically needs 3+ keywords with at least one intent tagged.",
    process: [
      {
        heading: "Add terms",
        body: "Seed from GSC, Keyword Planner, and competitor phrases mined in Research. Use suggested phrases when a primary seed + service area exist.",
      },
      {
        heading: "Tag intent",
        body: "Set Transactional / Commercial / Informational on each keyword — Research action plan may queue “Tag intent tier” until this is done.",
      },
    ],
    links: [
      { label: "Google Keyword Planner", url: "https://ads.google.com/home/tools/keyword-planner/" },
      { label: "Search Console", url: "https://search.google.com/search-console" },
    ],
  },

  // —— Sitemap / technical ——
  "sitemap.architecture": {
    title: "Site architecture",
    purpose:
      "Design the page tree (home, services, locations, about, blog) and URL hierarchy before writing on-page content.",
    unlockNote: "Phase 4 advances when at least one page node exists.",
    process: [
      {
        heading: "Seed or add pages",
        body: "Use Seed from template for a standard local-service tree, or Add page for custom nodes. Nest location/service children under parents.",
      },
      {
        heading: "Status & indexing",
        body: "Move pages Draft → Ready → Live. Submit for indexing when live URLs exist (Indexing API / GSC).",
      },
    ],
    suggestedOrder: [
      "Seed sitemap template",
      "Assign primary keywords to key pages",
      "Publish critical service + city pages",
      "Submit for indexing",
    ],
  },
  "sitemap.technical": {
    title: "Technical audit",
    purpose:
      "Track technical foundation items (robots, sitemap, canonicals, CWV, HTTPS) and capture PageSpeed baselines.",
    unlockNote: "Phase 5 advances with a PageSpeed/tech health log or high technical progress.",
    process: [
      {
        heading: "Checklist",
        body: "Work through the technical audit bullets as a reference — implement on the live site/CMS.",
      },
      {
        heading: "PageSpeed",
        body: "Run PageSpeed on the site URL to store LCP/INP/CLS scores for reporting and baseline.",
      },
    ],
    links: [
      { label: "PageSpeed Insights", url: "https://pagespeed.web.dev" },
      { label: "Screaming Frog (free 500)", url: "https://www.screamingfrog.co.uk/seo-spider/" },
      { label: "Mobile-Friendly Test", url: "https://search.google.com/test/mobile-friendly" },
    ],
  },

  // —— On-page ——
  "onpage.matrix": {
    title: "On-page SEO matrix",
    purpose:
      "Per-page checklist for titles, metas, H1s, FAQs, CTAs, schema, images, and internal links using blueprint formulas.",
    unlockNote: "Add pages in Site Map first. Phase 6 looks for on-page progress or live pages.",
    process: [
      {
        heading: "Formulas",
        body: "Title: Primary Service + Location | Benefit | Brand (<60). Meta: local modifier + USP + CTA (<155).",
      },
      {
        heading: "Toggle items",
        body: "Mark each SEO checklist item Done as you implement it on the live page. Attach schema templates where relevant.",
      },
    ],
    links: [
      { label: "Rich Results Test", url: "https://search.google.com/test/rich-results" },
      { label: "Schema Markup Validator", url: "https://validator.schema.org/" },
    ],
  },
  "onpage.eeat": {
    title: "E-E-A-T & trust",
    purpose:
      "Site-wide trust signals: licences, insurance, team bios, years in business, privacy — shown across the site, not one page only.",
    process: [
      {
        heading: "Mark as you publish",
        body: "Set each item Done/N/A when the signal is live on the site. Add notes for where it appears.",
      },
    ],
  },
  "onpage.cro": {
    title: "Conversion rate optimization",
    purpose:
      "Site-wide CRO checklist: header phone, sticky mobile CTA, short quote forms, trust badges, map embed.",
    process: [
      {
        heading: "Implement then check off",
        body: "These drive lead conversion alongside SEO — complete before calling the site “launch ready.”",
      },
    ],
  },

  // —— GBP ——
  "gbp.tab": {
    title: "Google Business Profile",
    purpose:
      "Optimize and operate GBP: categories, posts, photos, Q&A, and review responses with UTM-tagged CTAs.",
    unlockNote: "Phase 7 advances with GBP connected or activity logged.",
    process: [
      {
        heading: "Connect & verify",
        body: "Ensure GBP is claimed and categories match Golden NAP / service lines.",
      },
      {
        heading: "Ongoing cadence",
        body: "Follow governance/content/SOP lists and log posts in this hub (target ~8–12 posts/month).",
      },
    ],
    links: [
      { label: "Google Business Profile", url: "https://business.google.com" },
    ],
  },
  "gbp.utm": {
    title: "GBP UTM builder",
    purpose:
      "Build UTM-tagged URLs for GBP posts and website buttons so GA4 can attribute profile traffic.",
    process: [
      {
        heading: "Generate link",
        body: "Enter base URL and campaign params, copy the result into GBP CTAs and posts.",
      },
    ],
  },
  "gbp.governance": {
    title: "GBP profile governance",
    purpose:
      "One-time / structural GBP setup checklist (categories, services, hours, attributes, description).",
    process: [
      {
        heading: "Work the list",
        body: "Use as a reference SOP while editing the live profile in Business Profile Manager.",
      },
    ],
  },
  "gbp.content": {
    title: "GBP content checklist",
    purpose:
      "Photos, posts, products/services, Q&A seeding — content assets that keep the profile fresh.",
    process: [
      {
        heading: "Ship then log",
        body: "Publish on GBP, then log posts in the activity section for reporting.",
      },
    ],
  },
  "gbp.sops": {
    title: "GBP ongoing SOPs",
    purpose:
      "Cadence tasks (posts, photos, review replies, spam monitoring) with suggested frequency.",
    process: [
      {
        heading: "Match frequency badges",
        body: "Treat frequency labels as the minimum ops rhythm for retainer delivery.",
      },
    ],
  },

  // —— Citations ——
  "citations.goldenNap": {
    title: "Golden Record NAP",
    purpose:
      "Lock the exact Name, Address, Phone, and website string that every citation and schema must match.",
    unlockNote: "Lock Golden NAP before treating citations as complete — Phase 8 expects a locked record plus live citations.",
    process: [
      {
        heading: "Enter & lock",
        body: "Fill legal name, phone format, street, city, region, postal, website. Save, then Lock when final.",
      },
      {
        heading: "Never drift",
        body: "Copy from Golden NAP into every directory — no abbreviation mismatches vs GBP.",
      },
    ],
  },
  "citations.tab": {
    title: "Citation directories",
    purpose:
      "Build consistent NAP listings across Tier 1–3 directories. Expand How to on each row for claim steps and free tool links.",
    process: [
      {
        heading: "Work by tier",
        body: "Finish Tier 1 (GBP, Apple, Bing, Facebook, Yelp) before Tier 2/3 aggregators and niche directories.",
      },
      {
        heading: "Update status",
        body: "Paste the live listing URL, set SUBMITTED → LIVE (or NEEDS_UPDATE), and re-check quarterly.",
      },
    ],
    links: [
      { label: "Whitespark Citation Finder", url: "https://whitespark.ca/citation-finder/" },
    ],
  },

  // —— Reviews ——
  "reviews.tab": {
    title: "Review engine",
    purpose:
      "Launch review acquisition: targets, request templates, QR/short links, and response protocol — then track rating/count over time.",
    unlockNote: "Phase 9 advances when review targets are configured on the brand profile.",
    process: [
      {
        heading: "Set targets",
        body: "Monthly review goal, minimum before work, Google review link, QR, SMS/email templates.",
      },
      {
        heading: "Respond fast",
        body: "Use the response protocol — aim for 24h SLA on new reviews.",
      },
    ],
    links: [
      { label: "Google Alerts", url: "https://www.google.com/alerts" },
      { label: "Bitly", url: "https://bitly.com" },
      { label: "QR Code Generator", url: "https://www.qr-code-generator.com/" },
    ],
  },
  "reviews.request": {
    title: "Review request system",
    purpose:
      "Configure how the client asks for reviews after jobs (link, QR, coaching prompt, templates).",
    process: [
      {
        heading: "Save targets",
        body: "Fill the form and save — this unlocks the reviews phase gate.",
      },
    ],
  },
  "reviews.response": {
    title: "Review response protocol",
    purpose:
      "Standard tone and steps for public replies to positive and negative reviews.",
    process: [
      {
        heading: "Apply on every platform",
        body: "GBP first, then Facebook / HomeStars as used by the client.",
      },
    ],
  },

  // —— Links & GEO ——
  "links.tab": {
    title: "Local link acquisition",
    purpose:
      "Prospect and track chamber, sponsorship, supplier, partner, and media links using free outreach methods.",
    unlockNote: "Phase 10 advances with at least one local link or content calendar item.",
    process: [
      {
        heading: "Pick a source type",
        body: "Choose CHAMBER / SPONSORSHIP / SUPPLIER / PARTNER / MEDIA / OTHER — the How to panel updates with steps and links.",
      },
      {
        heading: "Track prospects",
        body: "Add source name and notes; mark Acquired when the live link exists.",
      },
    ],
    links: [
      { label: "GSC Links", url: "https://search.google.com/search-console" },
      { label: "Bing Webmaster Tools", url: "https://www.bing.com/webmasters" },
    ],
  },
  "links.geo": {
    title: "GEO / AI readiness",
    purpose:
      "Prepare the site for AI/overview surfaces: JSON-LD geo, FAQ format, crawler access, entity consistency.",
    process: [
      {
        heading: "Work the checklist",
        body: "Set each GEO item status as you implement schema, robots, and content formats.",
      },
    ],
    links: [
      { label: "Rich Results Test", url: "https://search.google.com/test/rich-results" },
    ],
  },
  "links.content": {
    title: "Content calendar",
    purpose:
      "Plan blog, location, service-update, and FAQ content that supports keywords and linkable assets.",
    process: [
      {
        heading: "Add & publish",
        body: "Create items tied to keyword themes; mark Published when live on the site.",
      },
    ],
  },

  // —— Reports ——
  "reports.tab": {
    title: "Reports & monthly ops",
    purpose:
      "Run maintenance SOPs, review baseline/weekly/monthly reports, and track progress vs kickoff.",
    process: [
      {
        heading: "Baseline",
        body: "Kickoff report lives here once generated from Intake.",
      },
      {
        heading: "Maintenance checklist",
        body: "Mark weekly SOP items Done; CITATIONS/LINKS rows include How to playbooks.",
      },
    ],
  },
  "reports.maintenance": {
    title: "Monthly maintenance checklist",
    purpose:
      "Auto-generated Week 1–4 SOP items (monthly/quarterly/annual cadence). Primary ops rhythm for retainers.",
    process: [
      {
        heading: "Work the week",
        body: "Expand How to on CITATIONS/LINKS items for free-tool steps. Mark Done when complete.",
      },
      {
        heading: "QA list",
        body: "Use the static QA checklist as a pre-report quality gate.",
      },
    ],
  },
  "reports.baseline": {
    title: "Baseline report (reports tab)",
    purpose:
      "Read-only view of the frozen kickoff snapshot used for vs-baseline monthly comparisons.",
    process: [
      {
        heading: "Missing?",
        body: "Generate from Intake & Baseline → Baseline starting report.",
      },
    ],
  },
  "reports.monthly": {
    title: "Monthly reports",
    purpose:
      "Cron-generated monthly SEO summaries with KPI payload and vs-kickoff deltas when a baseline exists.",
    process: [
      {
        heading: "Client delivery",
        body: "Email sends to billing/portal address; full detail is in the client portal Reports page.",
      },
    ],
  },
  "reports.weekly": {
    title: "Weekly reports",
    purpose:
      "Short weekly highlight digests (ranks/traffic) generated for active clients with connected integrations.",
    process: [
      {
        heading: "Read highlights",
        body: "Top message is the primary win; portal shows the full bullet list.",
      },
    ],
  },

  // —— Vault / Portal ——
  "vault.tab": {
    title: "Credential vault",
    purpose:
      "Store encrypted CMS, hosting, DNS, and platform credentials for the client — never put passwords in plain task notes.",
    process: [
      {
        heading: "Add credentials",
        body: "Label clearly (e.g. WordPress admin), paste URL, store username/password via the vault form.",
      },
      {
        heading: "Access checklist",
        body: "Pair with onboarding access items — mark received when credentials land here.",
      },
    ],
  },
  "portal.tab": {
    title: "Client portal invite",
    purpose:
      "Create or manage the client’s portal login so they can view reports, checklist status, and integrations.",
    process: [
      {
        heading: "Invite",
        body: "Send portal invite to the client email. They use /client routes for reports and account.",
      },
    ],
  },
} as const satisfies Record<string, SectionGuideContent>;

export type SectionGuideId = keyof typeof SECTION_GUIDES;

export function getSectionGuide(id: SectionGuideId): SectionGuideContent {
  return SECTION_GUIDES[id];
}
