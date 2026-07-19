export interface FreeTool {
  category: string;
  name: string;
  url: string;
  useCase: string;
}

export const FREE_TOOL_STACK: FreeTool[] = [
  { category: "Keyword Research", name: "Google Search Console", url: "https://search.google.com/search-console", useCase: "Keyword discovery and position tracking" },
  { category: "Keyword Research", name: "Google Keyword Planner", url: "https://ads.google.com/home/tools/keyword-planner/", useCase: "Search volume estimates" },
  { category: "Keyword Research", name: "Google Trends", url: "https://trends.google.com", useCase: "Seasonal keyword momentum" },
  { category: "Keyword Research", name: "AnswerThePublic", url: "https://answerthepublic.com", useCase: "Question-based keyword discovery" },
  { category: "Keyword Research", name: "Ubersuggest", url: "https://neilpatel.com/ubersuggest/", useCase: "Volume estimates and competitor keyword overview (free tier)" },
  { category: "Competitor Research", name: "PlePer", url: "https://pleper.com", useCase: "GBP category research browser extension" },
  { category: "Competitor Research", name: "GMBSpy", url: "https://gmbspy.io", useCase: "Competitor GBP categories" },
  { category: "Technical SEO", name: "Screaming Frog", url: "https://www.screamingfrog.co.uk/seo-spider/", useCase: "Free crawl up to 500 URLs" },
  { category: "Technical SEO", name: "PageSpeed Insights", url: "https://pagespeed.web.dev", useCase: "Core Web Vitals diagnosis" },
  { category: "Technical SEO", name: "Dead Link Checker", url: "https://www.deadlinkchecker.com/", useCase: "Identify broken internal and external links" },
  { category: "Mobile", name: "Google Mobile-Friendly Test", url: "https://search.google.com/test/mobile-friendly", useCase: "Verify mobile usability with zero issues" },
  { category: "Schema Validation", name: "Rich Results Test", url: "https://search.google.com/test/rich-results", useCase: "Validate structured data" },
  { category: "Schema Validation", name: "Schema.org Markup Validator", url: "https://validator.schema.org/", useCase: "Confirm JSON-LD schema validity" },
  { category: "Analytics", name: "Google Analytics 4", url: "https://analytics.google.com", useCase: "Traffic and conversions" },
  { category: "Analytics", name: "Google Tag Manager", url: "https://tagmanager.google.com", useCase: "Conversion events and click-to-call tracking" },
  { category: "Geo-Grid", name: "Local Falcon", url: "https://www.localfalcon.com", useCase: "Limited free geo-grid searches" },
  { category: "Geo-Grid", name: "Localo", url: "https://localo.com", useCase: "Free tier geo-grid rank checker" },
  { category: "Rank Tracking", name: "SerpRobot", url: "https://serprobot.com", useCase: "Free tier rank tracking for target cities" },
  { category: "Citations", name: "Whitespark Citation Finder", url: "https://whitespark.ca/citation-finder/", useCase: "Limited free citation searches" },
  { category: "Call Tracking", name: "Google Ads Call Extensions", url: "https://ads.google.com", useCase: "Call attribution with a free Ads account" },
  { category: "Call Tracking", name: "CallRail", url: "https://www.callrail.com", useCase: "Free trial — upgrade when retainer supports it" },
  { category: "Review Monitoring", name: "Google Alerts", url: "https://www.google.com/alerts", useCase: "Alert on new review mentions for client name" },
  { category: "Reviews Workflow", name: "Bitly", url: "https://bitly.com", useCase: "Shorten Google review links for SMS requests" },
  { category: "Reviews Workflow", name: "QR Code Generator", url: "https://www.qr-code-generator.com/", useCase: "QR codes pointing to review link for invoices/cards" },
  { category: "Project Management", name: "Notion", url: "https://www.notion.so", useCase: "Client SOPs and task management (free tier)" },
  { category: "Project Management", name: "Trello", url: "https://trello.com", useCase: "Kanban task boards (free tier)" },
  { category: "Images", name: "Squoosh", url: "https://squoosh.app", useCase: "Compress and convert to WebP" },
  { category: "Images", name: "TinyPNG", url: "https://tinypng.com", useCase: "Batch image compression (free tier)" },
];
