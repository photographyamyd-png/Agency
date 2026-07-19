export interface LaunchSopItem {
  category: string;
  label: string;
  order: number;
}

export const LAUNCH_SOP_ITEMS: LaunchSopItem[] = [
  { category: "GBP", label: "Claim and verify Google Business Profile", order: 1 },
  { category: "NAP", label: "Confirm and document NAP source of truth", order: 2 },
  { category: "TECHNICAL", label: "Run full baseline technical crawl (Screaming Frog)", order: 3 },
  { category: "TECHNICAL", label: "Set up Bing Webmaster Tools", order: 4 },
  { category: "CITATIONS", label: "Audit existing citations for NAP inconsistencies", order: 5 },
  { category: "TECHNICAL", label: "Domain/hosting/DNS health check", order: 6 },
  { category: "SEO", label: "Capture baseline keyword rank snapshot", order: 7 },
  { category: "SEO", label: "Confirm service area and full service list with client", order: 8 },
  { category: "TECHNICAL", label: "Set up uptime monitoring (UptimeRobot)", order: 9 },
  { category: "SEO", label: "Build seed keyword list by service + city", order: 10 },
  { category: "SEO", label: "Tag keyword search intent (informational/commercial/emergency)", order: 11 },
  { category: "CONTENT", label: "Build seasonal/emergency keyword content calendar (12-month)", order: 12 },
  { category: "SEO", label: "Complete keyword-to-URL mapping for all service pages", order: 13 },
  { category: "SEO", label: "Build out service-area pages for each town/region served", order: 14 },
  { category: "TECHNICAL", label: "Confirm favicon and branding consistency", order: 15 },
  { category: "CONTENT", label: "Write homepage copy", order: 16 },
  { category: "CONTENT", label: "Write service page copy for each service", order: 17 },
  { category: "CONTENT", label: "Write About/trust page copy (licenses, insurance, years in business)", order: 18 },
  { category: "GBP", label: "Select primary + secondary GBP categories", order: 19 },
  { category: "GBP", label: "Complete GBP services list and business description", order: 20 },
  { category: "GBP", label: "Set up GBP booking/appointment link", order: 21 },
  { category: "GBP", label: "Add GBP products/service menu with pricing ranges", order: 22 },
  { category: "GBP", label: "Set GBP attributes (licensed, insured, etc.)", order: 23 },
  { category: "GBP", label: "Set up GBP short name/URL", order: 24 },
  { category: "CITATIONS", label: "Submit core citations (Bing Places, Apple Maps, Facebook, Yelp)", order: 25 },
  { category: "CITATIONS", label: "Submit trade-specific directories (HomeStars, Houzz, BBB)", order: 26 },
  { category: "CITATIONS", label: "Submit Chamber of Commerce / local business association listing", order: 27 },
  { category: "CITATIONS", label: "Submit industry association directory listing", order: 28 },
  { category: "CITATIONS", label: "Request supplier/manufacturer 'find a dealer' listing", order: 29 },
  { category: "CITATIONS", label: "Optimize Facebook Business Page", order: 30 },
  { category: "CITATIONS", label: "Create Nextdoor business listing", order: 31 },
  { category: "REVIEWS", label: "Set up post-job review request workflow (photo + keyword prompts)", order: 32 },
  { category: "LINKS", label: "Capture backlink profile baseline (Bing Webmaster Tools)", order: 33 },
  { category: "SCHEMA", label: "Install LocalBusiness + Service schema on all pages", order: 34 },
  { category: "SCHEMA", label: "Confirm robots.txt / llms.txt don't block AI crawlers", order: 35 },
  { category: "REPORTING", label: "Set up Google Alerts for brand name monitoring", order: 36 },
];
