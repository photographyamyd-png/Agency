import type { AgencyProfile } from "@prisma/client";

/** Canonical Amy landing copy — anti-boring, deadpan, trade-first */
export const MARKETING_COPY = {
  tagline: "Websites for people who actually work for a living",
  headline:
    "Stop selling premium work with a website that looks like a 1992 game of Frogger.",
  subhead:
    "Aunt Martha—or whoever built your site—meant well, but your digital storefront is costing you the jobs that pay the bills. You're a pro; stop looking like an amateur.",
  ctaPrimary: "Fix my site",
  ctaSecondary: "Call Amy",
  chickenLine:
    "If I can teach a chicken to stay in the coop, I can teach your website to actually generate leads.",
  realityCheck: {
    leftCaption: "What the homeowner sees vs. the actual work you do.",
    rightCaption: "What you actually deserve.",
    punchline:
      "I know your work belongs in a magazine. Right now, your online presence belongs in the garbage. Let me bridge the gap.",
  },
  antiAgency: {
    headline: "I'm Amy. I have chickens. I don't have \"Account Managers.\"",
    pitch:
      "I'm not some massive agency trying to sell you a subscription for 'digital health' that you don't need. I'm a developer. When you call, you get me. I don't speak in jargon because I know you'd rather be on the job site than listening to me talk about 'synergy.' I build, I deploy, and I make sure you get paid.",
    callout:
      "I've seen the 'packages' those other guys try to sell you. It's 90% fluff and 10% stuff you could do yourself if you had the time—which you don't, because you're actually working.",
  },
  services: [
    {
      key: "WEBSITE" as const,
      title: "Websites",
      line: "Sites that don't crash. No Frogger mechanics allowed.",
    },
    {
      key: "SEO" as const,
      title: "SEO",
      line: "Making sure you're the first one they call when they need the job done.",
    },
    {
      key: "REPORTING" as const,
      title: "CRM / Reporting",
      line: "Automating the boring stuff so you don't have to chase invoices from people who ask if you 'used all the stones.'",
    },
  ],
  finalCta: {
    headline: "Tired of clients who question your stone count?",
    body: "A bad website attracts tire-kickers. A professional, high-performance site attracts the clients who know your worth and pay for it. Let's quit the guesswork and get your business looking as professional as your work.",
    button: "Let's get to work",
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
