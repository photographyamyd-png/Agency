export const GBP_GOVERNANCE_CHECKLIST = [
  { key: "claimed_verified", label: "Profile claimed and verified under client account" },
  { key: "agency_manager", label: "Agency added as Manager (client remains Owner)" },
  { key: "two_factor", label: "Two-factor authentication enabled" },
  { key: "duplicate_audit", label: "Duplicate listing audit completed" },
  { key: "primary_category", label: "Primary category matches core revenue service" },
  { key: "secondary_categories", label: "Up to 9 secondary categories set" },
  { key: "business_name", label: "Business name matches legal name (no keyword stuffing)" },
  { key: "nap_match", label: "Address and phone match Golden Record NAP" },
  { key: "service_area", label: "Service area defined (if applicable)" },
];

export const GBP_CONTENT_CHECKLIST = [
  { key: "description_300", label: "Business description uses all 300 characters" },
  { key: "services_listed", label: "All services listed with keyword-rich names" },
  { key: "service_descriptions", label: "Unique 300-char description per service" },
  { key: "photos_minimum", label: "Minimum 10 photos uploaded" },
  { key: "cover_photo", label: "Cover photo set (real job-site photo)" },
  { key: "logo_photo", label: "Logo photo set (high-resolution)" },
];

export const GBP_ONGOING_SOPS = [
  { frequency: "weekly", label: "Publish 2–3 GBP posts with UTM-tagged CTAs" },
  { frequency: "weekly", label: "Upload new job-site photos" },
  { frequency: "daily", label: "Respond to every new review within 24 hours" },
  { frequency: "monthly", label: "Check for Google-suggested edits" },
  { frequency: "monthly", label: "Monitor for spam listings and competitor violations" },
  { frequency: "quarterly", label: "Review and update service descriptions, hours, attributes" },
];

export const GBP_POST_UTM_TEMPLATE =
  "?utm_source=gbp&utm_medium=posts&utm_campaign={service}";

export function buildGbpUtmUrl(baseUrl: string, service: string) {
  const trimmed = baseUrl.replace(/\?.*$/, "").replace(/\/$/, "");
  const campaign = encodeURIComponent(service.replace(/\s+/g, "-").toLowerCase());
  return `${trimmed}?utm_source=gbp&utm_medium=posts&utm_campaign=${campaign}`;
}
