import type { SEOCategory } from "@prisma/client";

export interface SeoChecklistKeyDef {
  itemKey: string;
  label: string;
  category: SEOCategory;
}

export const ON_PAGE_SEO_CHECKLIST: SeoChecklistKeyDef[] = [
  { itemKey: "primary_keyword", label: "Unique primary keyword assigned", category: "METADATA" },
  { itemKey: "title_tag", label: "Unique title tag under 60 characters", category: "METADATA" },
  { itemKey: "meta_description", label: "Unique meta description under 155 characters", category: "METADATA" },
  { itemKey: "h1_keyword", label: "Single H1 with primary keyword and location", category: "HEADINGS" },
  { itemKey: "header_hierarchy", label: "Logical H2/H3 structure", category: "HEADINGS" },
  { itemKey: "url_slug_clean", label: "Clean URL slug (short, keyword-rich, no stop words)", category: "LINKING" },
  { itemKey: "location_modifiers", label: "Location modifiers used naturally in body copy", category: "METADATA" },
  { itemKey: "service_proof", label: "Service proof included (photos, case studies)", category: "METADATA" },
  { itemKey: "testimonials", label: "Testimonials or review excerpts embedded", category: "METADATA" },
  { itemKey: "faq_section", label: "FAQ section with 4–7 long-tail questions", category: "METADATA" },
  { itemKey: "cta_placement", label: "CTAs above fold, mid-page, and bottom", category: "METADATA" },
  { itemKey: "click_to_call", label: "Click-to-call phone number present on page", category: "METADATA" },
  { itemKey: "nap_consistent", label: "NAP matches Golden NAP source of truth", category: "NAP" },
  { itemKey: "breadcrumbs", label: "Breadcrumb navigation present and schema-ready", category: "LINKING" },
  { itemKey: "internal_links", label: "Internal links to 2–3 relevant pages", category: "LINKING" },
  { itemKey: "og_tags", label: "Open Graph title, description, and image tags set", category: "METADATA" },
  { itemKey: "faq_schema", label: "FAQPage schema added for FAQ sections", category: "SCHEMA" },
  { itemKey: "review_schema", label: "Review / AggregateRating schema where reviews are shown", category: "SCHEMA" },
  { itemKey: "image_filenames", label: "Descriptive image file names", category: "IMAGES" },
  { itemKey: "image_alt_text", label: "Descriptive alt text on all images", category: "IMAGES" },
  { itemKey: "page_speed", label: "Page speed checked via PageSpeed Insights", category: "SPEED" },
  { itemKey: "conversion_tracking", label: "Conversion tracking confirmed in GA4", category: "METADATA" },
];

export const TECHNICAL_AUDIT_CHECKLIST: SeoChecklistKeyDef[] = [
  { itemKey: "robots_txt", label: "Robots.txt allows important pages", category: "METADATA" },
  { itemKey: "xml_sitemap", label: "XML sitemap submitted to GSC", category: "METADATA" },
  { itemKey: "canonical_tags", label: "Self-referencing canonical on every page", category: "METADATA" },
  { itemKey: "no_duplicate_content", label: "No duplicate content across city/service pages", category: "METADATA" },
  { itemKey: "redirect_map", label: "301 redirects mapped, no chains > 1 hop", category: "METADATA" },
  { itemKey: "no_orphan_pages", label: "No orphan pages — all have internal links", category: "LINKING" },
  { itemKey: "mobile_friendly", label: "Passes Google Mobile-Friendly Test", category: "MOBILE" },
  { itemKey: "https_redirect", label: "All HTTP pages redirect to HTTPS", category: "SECURITY" },
  { itemKey: "cwv_lcp", label: "LCP under 2.5 seconds", category: "SPEED" },
  { itemKey: "cwv_inp", label: "INP under 200ms", category: "SPEED" },
  { itemKey: "cwv_cls", label: "CLS under 0.1", category: "SPEED" },
];

export const EAT_TRUST_CHECKLIST: SeoChecklistKeyDef[] = [
  { itemKey: "licences", label: "Business licences and certifications displayed", category: "METADATA" },
  { itemKey: "insurance", label: "Insurance documentation confirmed", category: "METADATA" },
  { itemKey: "years_business", label: "Years in business and founding story", category: "METADATA" },
  { itemKey: "team_bios", label: "Named team members with bios and photos", category: "METADATA" },
  { itemKey: "warranty", label: "Warranty and satisfaction guarantee details", category: "METADATA" },
  { itemKey: "privacy_policy", label: "Privacy policy and terms accessible", category: "METADATA" },
];

export const CRO_CHECKLIST: SeoChecklistKeyDef[] = [
  { itemKey: "header_phone", label: "Click-to-call phone in site header", category: "METADATA" },
  { itemKey: "sticky_mobile_cta", label: "Sticky mobile CTA bar with phone number", category: "MOBILE" },
  { itemKey: "short_quote_form", label: "Short quote form (name, service, city, phone)", category: "METADATA" },
  { itemKey: "trust_badges", label: "Trust badges near CTAs", category: "METADATA" },
  { itemKey: "review_widget", label: "Review widget on high-traffic pages", category: "METADATA" },
  { itemKey: "map_embed", label: "Embedded Google Map on contact/location pages", category: "METADATA" },
  { itemKey: "thank_you_goal", label: "Thank-you page set as GA4 conversion goal", category: "METADATA" },
];
