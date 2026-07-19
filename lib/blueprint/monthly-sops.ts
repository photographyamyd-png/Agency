export interface MonthlySopItem {
  week: 1 | 2 | 3 | 4;
  category: string;
  label: string;
  order: number;
  cadence?: "monthly" | "quarterly" | "annual"; // defaults to monthly if omitted
}

export const MONTHLY_SOP_ITEMS: MonthlySopItem[] = [
  // --- Week 1 (original + monthly additions + annual) ---
  { week: 1, category: "GBP", label: "Publish 2–3 GBP posts", order: 1 },
  { week: 1, category: "GBP", label: "Upload new job-site photos to GBP", order: 2 },
  { week: 1, category: "REVIEWS", label: "Respond to all new reviews", order: 3 },
  { week: 1, category: "SEO", label: "Manual rank checks in incognito browser", order: 4 },
  { week: 1, category: "REPORTING", label: "Review GA4 and GSC for anomalies", order: 5 },
  { week: 1, category: "TECHNICAL", label: "Run PageSpeed Insights check on homepage + top 3 service pages", order: 6 },
  { week: 1, category: "GBP", label: "Check GBP messages and respond to any pending", order: 7 },
  { week: 1, category: "TECHNICAL", label: "Validate XML sitemap against live routes", order: 8 },
  { week: 1, category: "TECHNICAL", label: "Review GSC Crawl Stats report", order: 9 },
  { week: 1, category: "INDEX", label: "Submit any newly published pages for indexing in GSC", order: 10 },
  { week: 1, category: "CONTENT", label: "Refresh seasonal/emergency content calendar for the year", order: 20, cadence: "annual" },
  { week: 1, category: "CONTENT", label: "Plan seasonal/emergency landing pages for the year ahead", order: 21, cadence: "annual" },
  { week: 1, category: "LINKS", label: "Create or refresh one linkable asset (local resource guide)", order: 22, cadence: "annual" },
  { week: 1, category: "REPORTING", label: "Annual review and goal reset with client", order: 23, cadence: "annual" },

  // --- Week 2 (original + monthly additions + quarterly) ---
  { week: 2, category: "CONTENT", label: "Publish blog post or FAQ content targeting informational keywords", order: 1 },
  { week: 2, category: "GBP", label: "Check for Google-suggested GBP edits", order: 2 },
  { week: 2, category: "GBP", label: "Monitor for new competitor GBP spam", order: 3 },
  { week: 2, category: "CITATIONS", label: "Manual NAP spot-check on 5 key directories", order: 4 },
  { week: 2, category: "GBP", label: "Review and seed 1–2 new GBP Q&A entries", order: 5 },
  { week: 2, category: "SCHEMA", label: "Validate all page schema in Google Rich Results Test", order: 6 },
  { week: 2, category: "TECHNICAL", label: "Check GSC index coverage report for errors", order: 7 },
  { week: 2, category: "CONTENT", label: "Mine 'People Also Ask' questions for FAQ/blog fuel", order: 8 },
  { week: 2, category: "INDEX", label: "Check GSC for manual actions or security issues", order: 9 },
  { week: 2, category: "TECHNICAL", label: "Full crawl — broken links, duplicate content, redirect chains, crawl depth, canonical tags, thin content", order: 10, cadence: "quarterly" },
  { week: 2, category: "TECHNICAL", label: "Mobile-friendliness check (Google Mobile-Friendly Test)", order: 11, cadence: "quarterly" },
  { week: 2, category: "TECHNICAL", label: "Robots.txt review", order: 12, cadence: "quarterly" },
  { week: 2, category: "SEO", label: "Map 'near me' and geo-modifier keyword variants", order: 13, cadence: "quarterly" },
  { week: 2, category: "CONTENT", label: "Run AnswerThePublic-style question mapping", order: 14, cadence: "quarterly" },
  { week: 2, category: "SEO", label: "Expand long-tail service+problem keyword list", order: 15, cadence: "quarterly" },
  { week: 2, category: "SEO", label: "Map voice search phrase variants", order: 16, cadence: "quarterly" },

  // --- Week 3 (original + monthly additions + quarterly) ---
  { week: 3, category: "GBP", label: "Publish 2–3 GBP posts", order: 1 },
  { week: 3, category: "LINKS", label: "Link outreach follow-up (existing targets)", order: 2 },
  { week: 3, category: "LINKS", label: "Identify new local link opportunities", order: 3 },
  { week: 3, category: "SEO", label: "Internal link audit on new content", order: 4 },
  { week: 3, category: "AI_SEARCH", label: "Spot-check ChatGPT/Perplexity/Google AI Overview visibility for top 3 keywords", order: 5 },
  { week: 3, category: "TECHNICAL", label: "Scan for broken links (Screaming Frog or equivalent)", order: 6 },
  { week: 3, category: "SEO", label: "Site-wide internal linking pass", order: 8, cadence: "quarterly" },
  { week: 3, category: "LINKS", label: "Toxic/spam backlink scan via Bing Webmaster Tools", order: 9, cadence: "quarterly" },
  { week: 3, category: "LINKS", label: "Check HARO-style journalist request platforms for open opportunities", order: 10, cadence: "quarterly" },
  { week: 3, category: "LINKS", label: "Broken link building — find and pitch replacements on local resource pages", order: 11, cadence: "quarterly" },
  { week: 3, category: "LINKS", label: "Audit citation/directory links for followed vs. nofollow", order: 12, cadence: "quarterly" },

  // --- Week 4 (original + monthly additions + quarterly) ---
  { week: 4, category: "REPORTING", label: "Compile monthly report using GA4 + GSC data", order: 1 },
  { week: 4, category: "SEO", label: "Review keyword rank changes", order: 2 },
  { week: 4, category: "CONTENT", label: "Identify new content opportunities from GSC queries", order: 3 },
  { week: 4, category: "CONTENT", label: "Plan next month's content calendar", order: 4 },
  { week: 4, category: "GBP", label: "Review GBP Insights (calls, direction requests, profile views) vs. last month", order: 5 },
  { week: 4, category: "REVIEWS", label: "Review count + rating trend check across GBP, Facebook, HomeStars", order: 6 },
  { week: 4, category: "CONTENT", label: "Draft a case study from a completed job this month", order: 7 },
  { week: 4, category: "REPORTING", label: "Compile next-month priority list for client", order: 8 },
  { week: 4, category: "CITATIONS", label: "Full NAP consistency re-check across all live citations", order: 9, cadence: "quarterly" },
  { week: 4, category: "CITATIONS", label: "Citation duplicate cleanup", order: 10, cadence: "quarterly" },
  { week: 4, category: "CITATIONS", label: "Check for local news/community listing opportunities", order: 11, cadence: "quarterly" },
  { week: 4, category: "GBP", label: "GBP hours accuracy check (incl. upcoming holidays)", order: 12, cadence: "quarterly" },
  { week: 4, category: "GBP", label: "Duplicate GBP listing check across Google Maps", order: 13, cadence: "quarterly" },
  { week: 4, category: "CONTENT", label: "Testimonial/review integration pass into site copy", order: 14, cadence: "quarterly" },
  { week: 4, category: "CONTENT", label: "E-E-A-T signal audit refresh (credentials, licenses, years in business)", order: 15, cadence: "quarterly" },
  { week: 4, category: "CONTENT", label: "Content freshness pass — flag pages unedited 12+ months", order: 16, cadence: "quarterly" },
  { week: 4, category: "REVIEWS", label: "Competitor review count/rating benchmarking", order: 17, cadence: "quarterly" },
  { week: 4, category: "REPORTING", label: "CTR analysis — flag low-CTR/high-impression pages for metadata fixes", order: 18, cadence: "quarterly" },
  { week: 4, category: "REPORTING", label: "Quarterly strategy review with client", order: 19, cadence: "quarterly" },
  { week: 4, category: "REPORTING", label: "Competitor movement alert — flag any competitor rank jumps", order: 20, cadence: "quarterly" },
];

export const QA_CHECKLIST_ITEMS = [
  "All published pages pass GSC coverage check",
  "All new schema validates in Google Rich Results Test",
  "All new images are WebP, compressed under 200KB, with descriptive alt text",
  "All new GBP posts include UTM-tagged CTA link",
  "All new content reviewed against keyword map — no duplicate primary keywords",
  "Run Screaming Frog quarterly for broken links and crawl issues",
  "All new content passes a plain-language/tone pass against brand voice",
  "GBP hours and holiday schedule reflect current information",
];
