export interface PricingPackage {
  id: string;
  name: string;
  category: string;
  priceMin: number;
  priceMax: number;
  unit: "monthly" | "flat";
  scopeIncluded: string;
  lineItems: { description: string; unitPrice: number }[];
}

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: "starter",
    name: "Starter Retainer",
    category: "SEO Retainer",
    priceMin: 1500,
    priceMax: 2000,
    unit: "monthly",
    scopeIncluded: "GBP management + 2 posts/week, review monitoring + response, monthly reporting (GA4 + GSC), up to 2 city or service pages per month",
    lineItems: [
      { description: "GBP management (2 posts/week)", unitPrice: 800 },
      { description: "Review monitoring and response", unitPrice: 300 },
      { description: "Monthly GA4 + GSC reporting", unitPrice: 400 },
      { description: "Up to 2 city/service pages per month", unitPrice: 500 },
    ],
  },
  {
    id: "growth",
    name: "Growth Retainer",
    category: "SEO Retainer",
    priceMin: 2500,
    priceMax: 3500,
    unit: "monthly",
    scopeIncluded: "Everything in Starter + 1 blog post/month, manual citation management, on-page optimization of 4 pages/month, link prospecting and outreach",
    lineItems: [
      { description: "Starter retainer base", unitPrice: 1750 },
      { description: "1 blog post per month", unitPrice: 400 },
      { description: "Citation management", unitPrice: 350 },
      { description: "On-page optimization (4 pages/month)", unitPrice: 500 },
      { description: "Link prospecting and outreach", unitPrice: 400 },
    ],
  },
  {
    id: "domination",
    name: "Domination Retainer",
    category: "SEO Retainer",
    priceMin: 4000,
    priceMax: 6000,
    unit: "monthly",
    scopeIncluded: "Everything in Growth + full site technical audit, 2 blog posts/month, active link building, competitor geo-grid monitoring, quarterly strategy call",
    lineItems: [
      { description: "Growth retainer base", unitPrice: 3000 },
      { description: "Full site technical audit (quarterly)", unitPrice: 500 },
      { description: "2 blog posts per month", unitPrice: 600 },
      { description: "Active link building", unitPrice: 600 },
      { description: "Competitor geo-grid monitoring", unitPrice: 400 },
      { description: "Quarterly strategy call", unitPrice: 300 },
    ],
  },
  {
    id: "one_time_build",
    name: "One-Time Website Build",
    category: "Website",
    priceMin: 3500,
    priceMax: 10000,
    unit: "flat",
    scopeIncluded: "Full website design and build, keyword mapping, full on-page SEO, schema implementation, GBP setup and optimization, 30-day post-launch support",
    lineItems: [
      { description: "Website design and build", unitPrice: 4500 },
      { description: "Keyword mapping and architecture", unitPrice: 800 },
      { description: "Full on-page SEO + schema", unitPrice: 1200 },
      { description: "GBP setup and optimization", unitPrice: 500 },
      { description: "30-day post-launch support", unitPrice: 500 },
    ],
  },
  {
    id: "website_care",
    name: "Website Care / Maintenance",
    category: "Maintenance",
    priceMin: 150,
    priceMax: 400,
    unit: "monthly",
    scopeIncluded: "Monthly uptime monitoring, plugin/CMS updates, backup verification, security patches, up to 1 hour of small content edits, monthly health report",
    lineItems: [
      { description: "Uptime + security monitoring", unitPrice: 75 },
      { description: "CMS/plugin updates + backups", unitPrice: 100 },
      { description: "Up to 1 hr content edits / month", unitPrice: 75 },
      { description: "Monthly site health report", unitPrice: 50 },
    ],
  },
];
