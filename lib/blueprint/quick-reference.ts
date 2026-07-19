export interface QuickReferencePillar {
  pillar: string;
  items: string[];
}

export const MASTER_QUICK_REFERENCE: QuickReferencePillar[] = [
  {
    pillar: "Website Foundation",
    items: ["Fast hosting", "Mobile-first design", "Dedicated service pages", "City pages", "Schema", "Internal linking", "Conversion tracking"],
  },
  {
    pillar: "Technical SEO",
    items: ["HTTPS", "Robots.txt", "Sitemap", "Canonical tags", "Redirect map", "Core Web Vitals", "Clean indexation"],
  },
  {
    pillar: "On-Page SEO",
    items: ["Unique title tags", "Unique meta descriptions", "Single H1 per page", "Keyword-mapped content", "Image alt text", "FAQ sections", "CTAs"],
  },
  {
    pillar: "E-E-A-T & Trust",
    items: ["Licences displayed", "Team bios", "Years in business", "Project portfolio", "Warranties", "Privacy policy"],
  },
  {
    pillar: "Schema Markup",
    items: ["LocalBusiness", "Organization", "Service", "FAQPage", "BreadcrumbList", "AggregateRating", "GeoCoordinates"],
  },
  {
    pillar: "GBP",
    items: ["Correct primary category", "Full service list", "Regular posts", "Photo uploads", "UTM-tagged links", "Review responses"],
  },
  {
    pillar: "Citations & NAP",
    items: ["Golden Record established", "Tier 1 platforms complete", "Duplicates suppressed", "NAP identical everywhere"],
  },
  {
    pillar: "Reviews",
    items: ["Acquisition workflow", "Consistent monthly velocity", "24h response SLA", "Keyword-rich review coaching"],
  },
  {
    pillar: "Link Building",
    items: ["Local sponsorships", "Chamber link", "Supplier/partner links", "Unlinked mention reclamation"],
  },
  {
    pillar: "GEO / AI Visibility",
    items: ["JSON-LD with geo coordinates", "FAQ Q&A format", "Multi-platform entity consistency", "AI crawler access"],
  },
  {
    pillar: "Tracking",
    items: ["GA4 + GTM", "Conversion events", "Search Console", "GTM click-to-call", "GBP UTM links"],
  },
  {
    pillar: "Conversion",
    items: ["Click-to-call in header", "Sticky mobile CTA", "Short quote forms", "Trust badges", "Map embed"],
  },
];
