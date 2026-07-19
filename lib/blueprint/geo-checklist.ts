export const GEO_READINESS_CHECKLIST = [
  { key: "geo_coordinates", label: "Geo coordinates in LocalBusiness schema", description: "Latitude and longitude required for hyper-local AI queries" },
  { key: "json_ld_format", label: "All schema uses JSON-LD format", description: "Easier for AI crawlers to parse than microdata" },
  { key: "rich_results_valid", label: "Schema validates in Rich Results Test", description: "https://search.google.com/test/rich-results" },
  { key: "server_side_facts", label: "Key facts rendered server-side", description: "Avoid JS-only content for critical business facts" },
  { key: "faq_qa_format", label: "FAQ sections in Q&A format", description: "H3 question + paragraph answer, 40–100 words" },
  { key: "entity_consistency", label: "Consistent NAP across all platforms", description: "Multi-platform entity signals for AI systems" },
  { key: "ai_crawler_access", label: "robots.txt allows AI crawlers", description: "GPTBot, Google-Extended, ClaudeBot, PerplexityBot not blocked" },
  { key: "semantic_html", label: "Clean semantic HTML structure", description: "Proper heading hierarchy and paragraph structure" },
  { key: "fast_load", label: "Page load times under targets", description: "Slow sites skipped by AI crawlers under time limits" },
];
