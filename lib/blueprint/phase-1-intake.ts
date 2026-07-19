export type BaselineAuditItemKey =
  | "ga4_tracking"
  | "gsc_verified"
  | "gbp_state"
  | "gsc_rankings"
  | "backlink_profile"
  | "citation_audit"
  | "pagespeed_baseline"
  | "indexed_pages"
  | "conversion_tracking"
  | "content_inventory";

export interface BaselineAuditItemDef {
  key: BaselineAuditItemKey;
  label: string;
  description: string;
  toolUrl?: string;
}

export const BASELINE_AUDIT_ITEMS: BaselineAuditItemDef[] = [
  { key: "ga4_tracking", label: "GA4 tracking installed and firing", description: "Confirm tracking code installed and firing", toolUrl: "https://analytics.google.com" },
  { key: "gsc_verified", label: "Search Console verified", description: "Check coverage errors, manual actions, crawl anomalies", toolUrl: "https://search.google.com/search-console" },
  { key: "gbp_state", label: "GBP current state documented", description: "All fields, photo count, review count and velocity", toolUrl: "https://business.google.com" },
  { key: "gsc_rankings", label: "Keyword rankings exported from GSC", description: "Export Performance report queries", toolUrl: "https://search.google.com/search-console" },
  { key: "backlink_profile", label: "Backlink profile reviewed", description: "GSC Links report + manual referring domain search", toolUrl: "https://search.google.com/search-console" },
  { key: "citation_audit", label: "Citation spot-check (top 10 directories)", description: "Google, Apple Maps, Bing, Yelp, Facebook, Yellow Pages, BBB, HomeStars, LinkedIn, chamber", toolUrl: "https://www.google.com/maps" },
  { key: "pagespeed_baseline", label: "PageSpeed baseline captured", description: "Homepage and top 3 service pages", toolUrl: "https://pagespeed.web.dev" },
  { key: "indexed_pages", label: "Indexed page count documented", description: "site:domain.com check in Google", toolUrl: "https://www.google.com" },
  { key: "conversion_tracking", label: "Conversion tracking confirmed", description: "Calls and form fills recorded in GA4 via GTM", toolUrl: "https://tagmanager.google.com" },
  { key: "content_inventory", label: "Content inventory listed", description: "All pages, URLs, and traffic from GA4", toolUrl: "https://analytics.google.com" },
];

export type BaselineAuditItemStatus = "pending" | "done" | "na";

export interface BaselineAuditItemValue {
  status: BaselineAuditItemStatus;
  notes?: string;
  completedAt?: string;
}

export type BaselineAuditData = Record<BaselineAuditItemKey, BaselineAuditItemValue>;

export function emptyBaselineAudit(): BaselineAuditData {
  return Object.fromEntries(
    BASELINE_AUDIT_ITEMS.map((item) => [
      item.key,
      { status: "pending" as const },
    ])
  ) as BaselineAuditData;
}

export const BUSINESS_INTEL_FIELDS = [
  { id: "serviceLines", label: "Primary service lines and revenue split" },
  { id: "targetCities", label: "Target cities, service radius, priority geography" },
  { id: "avgJobValue", label: "Average job/ticket value" },
  { id: "closeRate", label: "Estimated close rate" },
  { id: "seasonality", label: "Seasonal demand peaks and slow periods" },
  { id: "serviceCapacity", label: "Service capacity limits (jobs per week)" },
  { id: "leadSources", label: "Current lead sources and marketing history" },
  { id: "reputation", label: "Existing reviews, ratings, reputation situation" },
  { id: "knownCompetitors", label: "Known competitors client is aware of" },
  { id: "brandVoice", label: "Brand voice, preferred tone, brand guidelines" },
] as const;
