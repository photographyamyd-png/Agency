export type CitationTier = "TIER_1" | "TIER_2" | "TIER_3";

export interface CitationDirectory {
  directory: string;
  tier: CitationTier;
  url?: string;
}

export const CITATION_DIRECTORIES: CitationDirectory[] = [
  { directory: "Google Business Profile", tier: "TIER_1", url: "https://business.google.com" },
  { directory: "Apple Business Connect", tier: "TIER_1", url: "https://businessconnect.apple.com" },
  { directory: "Bing Places for Business", tier: "TIER_1", url: "https://www.bingplaces.com" },
  { directory: "Facebook Business Page", tier: "TIER_1", url: "https://www.facebook.com" },
  { directory: "Yelp Business Listing", tier: "TIER_1", url: "https://biz.yelp.com" },
  { directory: "Foursquare", tier: "TIER_2", url: "https://foursquare.com" },
  { directory: "Data Axle / Infogroup", tier: "TIER_2", url: "https://www.dataaxleusa.com" },
  { directory: "Neustar Localeze", tier: "TIER_2" },
  { directory: "LinkedIn Company Page", tier: "TIER_3", url: "https://www.linkedin.com" },
  { directory: "YouTube Channel", tier: "TIER_3", url: "https://www.youtube.com" },
  { directory: "Better Business Bureau", tier: "TIER_3", url: "https://www.bbb.org" },
  { directory: "HomeStars", tier: "TIER_3", url: "https://www.homestars.com" },
  { directory: "Houzz", tier: "TIER_3", url: "https://www.houzz.com" },
  { directory: "Local Chamber of Commerce", tier: "TIER_3" },
  { directory: "Regional Trade Association", tier: "TIER_3" },
];
