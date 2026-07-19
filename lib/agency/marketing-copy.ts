import type { AgencyProfile } from "@prisma/client";

/** Canonical Amy landing copy — Semrush clarity, construction-led trades */
export const MARKETING_COPY = {
  tagline: "Websites & local SEO for construction and the trades",
  headline: "Be the obvious choice when locals need a contractor",
  subhead:
    "Show up in Maps and local search, look as professional as your jobsite, and get the phone ringing with jobs that pay.",
  /** Single primary CTA verb used across nav, hero, pricing, contact */
  ctaPrimary: "Book a free intro call",
  ctaSecondary: "Call Amy",
  ctaHint: "No obligation · 20 minutes · you talk to Amy",
  chickenLine:
    "Yes, I have chickens. No, I don't have a stack of account managers between us and your site.",
  trustPartners: [
    "Google Business Profile",
    "Google Search Console",
    "Google Analytics",
    "Jobber",
    "ServiceTitan",
    "Housecall Pro",
  ],
  strategy: {
    eyebrow: "The strategy",
    headline: "Grow booked jobs, not vanity traffic",
    body: "Rank where homeowners and property managers search, show up in the Map pack, and keep the schedule full — without an agency zoo of account managers.",
    formTitle: "Tell me where you're at — I'll tell you if I can help",
    privacy: "Your info stays with me. No list-selling. No spam.",
  },
  revenueBands: [
    { value: "under-50k", label: "Less than $50K / mo" },
    { value: "50k-100k", label: "$50K – $100K / mo" },
    { value: "100k-500k", label: "$100K – $500K / mo" },
    { value: "500k-1m", label: "$500K – $1M / mo" },
    { value: "1m-3m", label: "$1M – $3M / mo" },
    { value: "3m-plus", label: "$3M+ / mo" },
  ],
  outcomes: [
    {
      value: "#41 → #5",
      title: "Map pack climb on a money keyword",
      client: "Local general contractor",
      channel: "Local SEO + site rebuild",
    },
    {
      value: "#58 → #7",
      title: "Google ranking jump on a money keyword",
      client: "Local HVAC shop",
      channel: "Local SEO + site rebuild",
    },
    {
      value: "+2×",
      title: "More call inquiries after launch",
      client: "Plumbing crew",
      channel: "Conversion-focused website",
    },
    {
      value: "Weekly",
      title: "Reports you actually read",
      client: "Every client",
      channel: "Rankings & traffic, plain English",
    },
  ],
  pricing: {
    eyebrow: "Clear pricing",
    headline: "Pick the stage you're in. No mystery retainers.",
    note: "Prices are starting points for a typical trade shop. Custom scopes (multi-location, migrations) get a custom quote. Month-to-month after any build project wraps.",
    tiers: [
      {
        name: "The Fix",
        qualifier: "Solo / small crew",
        price: "$3,500",
        period: "one-time",
        features: [
          "Conversion-focused website",
          "Mobile-first, fast, call-to-action clear",
          "Google Business Profile wired up",
          "Launch + handoff walkthrough",
        ],
        valuedNote: "What most agencies pad into a 6-month fluff package",
        ctaHref: "#contact",
      },
      {
        name: "Phone Ringer",
        qualifier: "Growing crew · under ~$1M / yr",
        price: "$1,200",
        period: "/mo",
        featured: true,
        features: [
          "Everything in The Fix (or work with your site)",
          "Ongoing local SEO & Google Maps",
          "Weekly ranking & traffic reports",
          "Lead tracking that isn't theater",
        ],
        valuedNote: "Site + Maps + reporting without the agency tax",
        ctaHref: "#contact",
      },
      {
        name: "Full Shop",
        qualifier: "$1M+ / multi-truck",
        price: "$2,000+",
        period: "/mo",
        features: [
          "Website + organic local SEO",
          "CRM / reporting automation",
          "Monthly tune-ups & priority support",
          "Built for crews that need the board full",
        ],
        valuedNote: "For shops past DIY marketing",
        ctaHref: "#contact",
      },
    ],
  },
  realityCheck: {
    leftCaption: "What the homeowner sees vs. the actual work you do.",
    rightCaption: "What you actually deserve.",
    punchline:
      "Your work should sell itself online the same way it does on the jobsite. Right now the gap is costing you calls. Let's close it.",
  },
  antiAgency: {
    headline: "I'm Amy. When you call, you get me — not an account manager.",
    pitch:
      "I'm not a big agency selling you a subscription for 'digital health' you don't need. I'm a developer who builds sites and local SEO for construction crews and trade shops. When you call, you get me. No jargon — I know you'd rather be on the job than listening to someone talk about synergy. I build, I deploy, and I make sure you get paid.",
    callout:
      "I've seen the packages other shops try to sell you. It's mostly fluff and a little work you could do yourself if you had the time — which you don't, because you're actually working.",
  },
  services: [
    {
      key: "WEBSITE" as const,
      title: "Websites",
      line: "A storefront that turns searchers into callers.",
    },
    {
      key: "SEO" as const,
      title: "SEO",
      line: "Own the Map pack for the work you actually sell.",
    },
    {
      key: "REPORTING" as const,
      title: "CRM / Reporting",
      line: "Know what's ranking without marketing theater.",
    },
  ],
  finalCta: {
    headline: "Ready to show up where the jobs are searching?",
    body: "A professional site plus Google Maps visibility draws callers who take your work seriously. Book a free intro call and I'll tell you straight if I can help.",
    button: "Book a free intro call",
  },
} as const;

const STALE_PATTERNS = [
  /get more customers from google/i,
  /websites & local seo that get you found/i,
  /websites and local seo for plumbers/i,
  /websites & google maps for the trades/i,
  /custom websites and local seo for service businesses/i,
  /service businesses — with weekly reports/i,
  /frogger/i,
  /aunt martha/i,
  /websites for people who actually work for a living/i,
  /stone count/i,
  /i'?m amy\. i build solid sites/i,
  /emergency plumber near me/i,
  /roofer in \[your town\]/i,
];

function isStaleCopy(text: string | null | undefined): boolean {
  if (!text?.trim()) return true;
  return STALE_PATTERNS.some((re) => re.test(text));
}

export function resolveMarketingCopy(
  agency: Pick<AgencyProfile, "tagline" | "heroHeadline" | "heroSubhead" | "businessName">
) {
  return {
    tagline: isStaleCopy(agency.tagline) ? MARKETING_COPY.tagline : agency.tagline!,
    headline: isStaleCopy(agency.heroHeadline)
      ? MARKETING_COPY.headline
      : agency.heroHeadline!,
    subhead: isStaleCopy(agency.heroSubhead)
      ? MARKETING_COPY.subhead
      : agency.heroSubhead!,
    businessName: agency.businessName || "Amy · Web for Trades",
  };
}
