export interface PlaybookLink {
  label: string;
  url: string;
}

export interface ChecklistPlaybook {
  summary: string;
  steps: string[];
  links: PlaybookLink[];
}

/** Strip "Week N: " prefix from generated maintenance item labels. */
export function baseMaintenanceLabel(storedLabel: string): string {
  return storedLabel.replace(/^Week\s+[1-4]:\s+/i, "");
}

export function getCitationPlaybook(directory: string): ChecklistPlaybook | undefined {
  return CITATION_PLAYBOOKS[directory];
}

export function getLinkSourcePlaybook(sourceType: string): ChecklistPlaybook | undefined {
  return LINK_SOURCE_PLAYBOOKS[sourceType];
}

export function getMonthlySopPlaybook(storedOrBaseLabel: string): ChecklistPlaybook | undefined {
  return MONTHLY_SOP_PLAYBOOKS[baseMaintenanceLabel(storedOrBaseLabel)];
}

// ---------------------------------------------------------------------------
// Citations — one playbook per CITATION_DIRECTORIES entry
// ---------------------------------------------------------------------------

export const CITATION_PLAYBOOKS: Record<string, ChecklistPlaybook> = {
  "Google Business Profile": {
    summary: "Claim or verify GBP and lock Golden NAP as the source of truth for all other directories.",
    steps: [
      "Open Business Profile Manager and search for the existing listing (or create one).",
      "Verify ownership via phone, postcard, or email if prompted.",
      "Copy name, address, phone, website, and categories exactly from Golden NAP.",
      "Add primary category, service area, hours, and at least 10 photos.",
      "Paste the live Maps / GBP URL into the citation tracker and mark LIVE.",
    ],
    links: [
      { label: "Google Business Profile", url: "https://business.google.com" },
      { label: "Google Maps", url: "https://www.google.com/maps" },
    ],
  },
  "Apple Business Connect": {
    summary: "Free Apple Maps listing via Business Connect — match NAP to GBP exactly.",
    steps: [
      "Sign in at Apple Business Connect with an Apple ID.",
      "Search for the business; claim the existing place or create a new location.",
      "Enter Golden NAP fields identically (no abbreviations that differ from GBP).",
      "Upload logo and cover photo; set hours and categories.",
      "Save, note the public Apple Maps URL, paste into tracker, mark SUBMITTED then LIVE when live.",
    ],
    links: [
      { label: "Apple Business Connect", url: "https://businessconnect.apple.com" },
    ],
  },
  "Bing Places for Business": {
    summary: "Free Bing / Yahoo / DuckDuckGo local listing; can import from GBP.",
    steps: [
      "Sign in to Bing Places with a Microsoft account.",
      "Use “Import from Google” if available, then correct any NAP drift to Golden NAP.",
      "Otherwise create/claim the listing and fill NAP, categories, and website.",
      "Verify via phone or postcard if required.",
      "Paste the Bing Places URL into the tracker when live.",
    ],
    links: [
      { label: "Bing Places", url: "https://www.bingplaces.com" },
      { label: "Bing Webmaster Tools", url: "https://www.bing.com/webmasters" },
    ],
  },
  "Facebook Business Page": {
    summary: "Create or claim the Page and publish consistent NAP in About + website link.",
    steps: [
      "Search Facebook for an existing Page; claim it or create a new Business Page.",
      "Set username, category, and About fields from Golden NAP.",
      "Add website, phone, address, and hours; enable messaging if the client wants it.",
      "Add cover, profile photo, and a first post with UTM-tagged CTA if available.",
      "Paste the Page URL into the tracker and mark LIVE.",
    ],
    links: [
      { label: "Facebook Pages", url: "https://www.facebook.com/pages/create" },
      { label: "Meta Business Suite", url: "https://business.facebook.com" },
    ],
  },
  "Yelp Business Listing": {
    summary: "Claim or add the free Yelp business page; keep NAP identical to GBP.",
    steps: [
      "Search biz.yelp.com for the business; claim the listing or add a new one.",
      "Complete Golden NAP, categories, and photos; avoid keyword stuffing in the name.",
      "Respond to any existing reviews after client approval of voice.",
      "Copy the public Yelp URL into the tracker; mark LIVE when claim is approved.",
    ],
    links: [
      { label: "Yelp for Business", url: "https://biz.yelp.com" },
    ],
  },
  Foursquare: {
    summary: "Free Foursquare / Swarm place page that also feeds partner apps.",
    steps: [
      "Search Foursquare for the venue; claim it via the business tools or create if missing.",
      "Align name, address, phone, and website with Golden NAP.",
      "Add categories and a short description without promotional spam.",
      "Paste the venue URL into the tracker when confirmed.",
    ],
    links: [
      { label: "Foursquare", url: "https://foursquare.com" },
      { label: "Foursquare for Business", url: "https://business.foursquare.com" },
    ],
  },
  "Data Axle / Infogroup": {
    summary: "Aggregator listing — correct NAP so it propagates to downstream directories.",
    steps: [
      "Search Data Axle / related local listing tools for the business phone or address.",
      "Submit a correction or claim using Golden NAP (name, address, phone, URL).",
      "Note any ticket / reference ID in outreach notes if available.",
      "Re-check in 2–4 weeks; paste the public listing URL when found and mark LIVE.",
    ],
    links: [
      { label: "Data Axle", url: "https://www.dataaxleusa.com" },
      { label: "Whitespark Citation Finder", url: "https://whitespark.ca/citation-finder/" },
    ],
  },
  "Neustar Localeze": {
    summary: "Localeze (Neustar) is a major aggregator; submit or correct via their business portal.",
    steps: [
      "Open the Localeze / Neustar business listing portal and search by phone.",
      "Claim or create the listing with exact Golden NAP.",
      "Submit supporting docs if asked (license, utility bill).",
      "Track status; paste the public or confirmation URL when available.",
    ],
    links: [
      { label: "Localeze / Neustar listings", url: "https://www.localeze.com" },
      { label: "Whitespark Citation Finder", url: "https://whitespark.ca/citation-finder/" },
    ],
  },
  "LinkedIn Company Page": {
    summary: "Free Company Page for brand + soft local signal; NAP in About and website.",
    steps: [
      "Create or claim the LinkedIn Company Page (client admin account preferred).",
      "Fill About, website, location, and specialty fields from Golden NAP / brand voice.",
      "Add logo and cover; publish one intro update.",
      "Paste the company URL into the tracker.",
    ],
    links: [
      { label: "LinkedIn Company Pages", url: "https://www.linkedin.com/company/setup/new/" },
    ],
  },
  "YouTube Channel": {
    summary: "Brand channel with consistent NAP in About; useful for video + local trust.",
    steps: [
      "Create a Brand Account channel (or transfer an existing one).",
      "Set channel name, handle, and About description with city + phone/website from Golden NAP.",
      "Add channel art and a pinned comment or description link to the site.",
      "Paste the channel URL into the tracker.",
    ],
    links: [
      { label: "YouTube Studio", url: "https://studio.youtube.com" },
    ],
  },
  "Better Business Bureau": {
    summary: "BBB profile (accreditation optional); free listing claim where available.",
    steps: [
      "Search bbb.org for the business; claim the profile or start an application.",
      "Match business name and address to Golden NAP; note accreditation fees are optional.",
      "Complete contact and website fields; upload any required docs.",
      "Paste the BBB profile URL into the tracker when live.",
    ],
    links: [
      { label: "BBB.org", url: "https://www.bbb.org" },
    ],
  },
  HomeStars: {
    summary: "Canadian home-services directory — claim free profile and sync NAP.",
    steps: [
      "Search HomeStars for the contractor; claim or create the profile.",
      "Enter Golden NAP, service categories, and service area cities.",
      "Import or request a few reviews after launch (client-approved ask).",
      "Paste the HomeStars URL into the tracker.",
    ],
    links: [
      { label: "HomeStars", url: "https://www.homestars.com" },
      { label: "HomeStars for pros", url: "https://www.homestars.com/pro" },
    ],
  },
  Houzz: {
    summary: "Free professional profile for design/home trades; NAP + project photos.",
    steps: [
      "Create or claim a Houzz Pro / professional profile.",
      "Match business name, phone, website, and location to Golden NAP.",
      "Upload 5–10 project photos with short captions.",
      "Paste the Houzz profile URL into the tracker.",
    ],
    links: [
      { label: "Houzz", url: "https://www.houzz.com" },
      { label: "Houzz Pro signup", url: "https://www.houzz.com/pro" },
    ],
  },
  "Local Chamber of Commerce": {
    summary: "Find the client’s city chamber and join/list via their free or member directory.",
    steps: [
      "Google “[city] chamber of commerce directory” for the client’s primary city.",
      "Check membership cost; prefer free community listings when offered.",
      "Submit Golden NAP + website; request a followed link on their member directory if possible.",
      "Also add a Local Link prospect (CHAMBER) for the directory URL.",
      "Paste the live listing URL into the citation tracker.",
    ],
    links: [
      { label: "Google: find local chamber", url: "https://www.google.com/search?q=chamber+of+commerce+directory" },
    ],
  },
  "Regional Trade Association": {
    summary: "Industry association “find a pro” directories — often free or low-cost member listings.",
    steps: [
      "Identify 1–2 relevant trade associations for the client’s niche (HVAC, plumbing, roofing, etc.).",
      "Search their site for “find a contractor / member directory / join”.",
      "Submit Golden NAP and any license numbers required.",
      "Request a profile link; paste URL into tracker and log as SUPPLIER/PARTNER link prospect if linked.",
    ],
    links: [
      { label: "Google: trade association directory", url: "https://www.google.com/search?q=trade+association+member+directory" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Local link acquisition — by sourceType
// ---------------------------------------------------------------------------

export type LinkSourceType =
  | "CHAMBER"
  | "SPONSORSHIP"
  | "SUPPLIER"
  | "PARTNER"
  | "MEDIA"
  | "OTHER";

export const LINK_SOURCE_PLAYBOOKS: Record<string, ChecklistPlaybook> = {
  CHAMBER: {
    summary: "Chamber / BIA member directory links — high-trust local citations + backlinks.",
    steps: [
      "Find the primary and nearby city chambers; note membership vs free listing options.",
      "Join or submit the directory form with Golden NAP and website.",
      "Ask specifically for a link on the public member directory page.",
      "When live, add URL here, mark ACQUIRED, and confirm the citation row if listed.",
    ],
    links: [
      { label: "Google: city chamber directory", url: "https://www.google.com/search?q=chamber+of+commerce+member+directory" },
    ],
  },
  SPONSORSHIP: {
    summary: "Sponsor local events, teams, or nonprofits in exchange for a site credit link.",
    steps: [
      "List low-cost options: youth sports, charity runs, school ads, community calendars.",
      "Pitch a small sponsorship with a written ask for a dofollow (or at least visible) link.",
      "Provide logo + 1-sentence blurb + preferred anchor (brand or city+service).",
      "When published, save URL, mark ACQUIRED, and screenshot for the monthly report.",
    ],
    links: [
      { label: "Google: local sponsorship opportunities", url: "https://www.google.com/search?q=local+event+sponsorship+opportunities" },
    ],
  },
  SUPPLIER: {
    summary: "Manufacturer / wholesaler “find a dealer” and partner directories.",
    steps: [
      "Ask the client which brands they carry or install.",
      "Search each brand site for dealer / installer / partner locator forms.",
      "Submit Golden NAP; request inclusion on the public locator with a website link.",
      "Paste the dealer-profile URL when live and mark ACQUIRED.",
    ],
    links: [
      { label: "Google: find a dealer listing", url: "https://www.google.com/search?q=%22find+a+dealer%22+OR+%22find+an+installer%22" },
    ],
  },
  PARTNER: {
    summary: "Complementary local businesses (referral partners) for reciprocal or one-way links.",
    steps: [
      "Identify non-competing partners (e.g. realtor ↔ contractor, plumber ↔ electrician).",
      "Offer a resource page mention, joint FAQ, or referral agreement with a link ask.",
      "Prefer editorial links on an existing resources / partners page over footer swaps.",
      "Log outreach notes; mark ACQUIRED when the link is live and crawlable.",
    ],
    links: [
      { label: "GSC Links report", url: "https://search.google.com/search-console" },
    ],
  },
  MEDIA: {
    summary: "Local news, blogs, and community sites — unlinked mentions + earned coverage.",
    steps: [
      "Set a Google Alert for the business name; scan for unlinked mentions.",
      "Pitch a short local story, expert quote, or project feature to city blogs / papers.",
      "Use free journalist-request digests when relevant (see monthly HARO SOP).",
      "When covered, secure a link to the homepage or relevant service page; mark ACQUIRED.",
    ],
    links: [
      { label: "Google Alerts", url: "https://www.google.com/alerts" },
      { label: "Connectively (HARO)", url: "https://www.connectively.us" },
    ],
  },
  OTHER: {
    summary: "Catch-all: resource pages, .edu/.gov lists, broken-link replacements, scholarships.",
    steps: [
      "Prospect with site:city “resources” / “recommended contractors” searches.",
      "For broken-link building: find 404 outbound links on local resource pages and pitch a replacement.",
      "Document contact email and pitch angle in outreach notes.",
      "Verify the live href, paste URL, mark ACQUIRED.",
    ],
    links: [
      { label: "Dead Link Checker", url: "https://www.deadlinkchecker.com/" },
      { label: "Bing Webmaster Tools", url: "https://www.bing.com/webmasters" },
      { label: "GSC Links", url: "https://search.google.com/search-console" },
    ],
  },
};

/** Free tools cheat sheet shown at top of Links tab. */
export const LINK_ACQUISITION_CHEAT_SHEET: PlaybookLink[] = [
  { label: "Google Search Console — Links", url: "https://search.google.com/search-console" },
  { label: "Bing Webmaster Tools — Backlinks", url: "https://www.bing.com/webmasters" },
  { label: "Google Alerts (unlinked mentions)", url: "https://www.google.com/alerts" },
  { label: "Connectively / HARO-style pitches", url: "https://www.connectively.us" },
  { label: "Dead Link Checker", url: "https://www.deadlinkchecker.com/" },
  { label: "Whitespark Citation Finder", url: "https://whitespark.ca/citation-finder/" },
];

// ---------------------------------------------------------------------------
// Monthly SOP — CITATIONS + LINKS labels only (match after stripping Week N:)
// ---------------------------------------------------------------------------

export const MONTHLY_SOP_PLAYBOOKS: Record<string, ChecklistPlaybook> = {
  "Manual NAP spot-check on 5 key directories": {
    summary: "Spot-check top directories against Golden NAP; fix drift before it spreads.",
    steps: [
      "Open Golden NAP and pick 5 live citations (GBP, Apple, Bing, Yelp, Facebook or top trade dir).",
      "Compare name, address, phone, and website character-for-character.",
      "Submit corrections on any mismatch; set citation status to NEEDS_UPDATE if pending.",
      "Note findings in the monthly report.",
    ],
    links: [
      { label: "Whitespark Citation Finder", url: "https://whitespark.ca/citation-finder/" },
      { label: "Google Maps", url: "https://www.google.com/maps" },
    ],
  },
  "Create or refresh one linkable asset (local resource guide)": {
    summary: "Publish or update a free local resource page worth linking to (guides, checklists, maps).",
    steps: [
      "Choose a useful local topic (permits, seasonal tips, cost guides, neighborhood FAQ).",
      "Publish on the client site with clear title, NAP footer, and internal links to service pages.",
      "Add the URL to content calendar as PUBLISHED and pitch it in chamber/partner outreach.",
      "Track referring links in GSC / Bing over the following quarter.",
    ],
    links: [
      { label: "Google Search Console", url: "https://search.google.com/search-console" },
    ],
  },
  "Link outreach follow-up (existing targets)": {
    summary: "Nudge open Local Link prospects still in PROSPECT / OUTREACH.",
    steps: [
      "Filter Local Links that are not ACQUIRED; skip REJECTED.",
      "Send a short polite follow-up (5–7 days after last touch) referencing the prior ask.",
      "Update outreach notes with date and outcome.",
      "Mark ACQUIRED when the link is live, or REJECTED if declined.",
    ],
    links: [
      { label: "GSC Links report", url: "https://search.google.com/search-console" },
    ],
  },
  "Identify new local link opportunities": {
    summary: "Add fresh prospects across chamber, supplier, partner, sponsorship, and media.",
    steps: [
      "Run 3–5 prospecting searches (chamber directory, find-a-dealer, local resources, news).",
      "Add each as a Local Link prospect with the correct source type and notes.",
      "Prioritize sites that already link to competitors or related local businesses.",
      "Queue first-touch emails for this week’s outreach block.",
    ],
    links: [
      { label: "Whitespark Citation Finder", url: "https://whitespark.ca/citation-finder/" },
      { label: "Google Alerts", url: "https://www.google.com/alerts" },
    ],
  },
  "Toxic/spam backlink scan via Bing Webmaster Tools": {
    summary: "Free backlink review in Bing Webmaster; flag spammy domains for disavow discussion.",
    steps: [
      "Open Bing Webmaster Tools → SEO → Backlinks (or Inbound links) for the client site.",
      "Sort by newest / suspicious TLDs, foreign spam, or exact-match anchor abuse.",
      "Export or screenshot questionable domains; cross-check GSC Links if available.",
      "Document keep vs. candidate-disavow list; only disavow after clear spam pattern.",
    ],
    links: [
      { label: "Bing Webmaster Tools", url: "https://www.bing.com/webmasters" },
      { label: "Google Search Console", url: "https://search.google.com/search-console" },
      { label: "Google Disavow tool", url: "https://search.google.com/search-console/disavow-links" },
    ],
  },
  "Check HARO-style journalist request platforms for open opportunities": {
    summary: "Scan free journalist-request inboxes and pitch the client as a local expert.",
    steps: [
      "Open Connectively (HARO successor) or similar free digests; filter by relevant beats.",
      "Draft a concise pitch with credentials, city, and a quotable insight (client-approved).",
      "Log the pitch as a MEDIA Local Link prospect.",
      "If published, add the article URL and mark ACQUIRED.",
    ],
    links: [
      { label: "Connectively", url: "https://www.connectively.us" },
      { label: "Google Alerts", url: "https://www.google.com/alerts" },
    ],
  },
  "Broken link building — find and pitch replacements on local resource pages": {
    summary: "Find 404s on local resource pages and offer the client’s relevant page as replacement.",
    steps: [
      "Find city resource / recommended-vendor pages (chamber, nonprofit, .gov/.edu lists).",
      "Run Dead Link Checker (or Screaming Frog free tier) on those URLs.",
      "Where a broken outbound link matches the client’s niche, email the webmaster a replacement URL.",
      "Log as OTHER or PARTNER prospect; mark ACQUIRED when fixed.",
    ],
    links: [
      { label: "Dead Link Checker", url: "https://www.deadlinkchecker.com/" },
      { label: "Screaming Frog (free 500 URLs)", url: "https://www.screamingfrog.co.uk/seo-spider/" },
    ],
  },
  "Audit citation/directory links for followed vs. nofollow": {
    summary: "Check live citation URLs for rel=nofollow and whether the link points to the right page.",
    steps: [
      "Open each LIVE citation URL from the Citations tab.",
      "Inspect the site link (view source or DevTools) for rel=\"nofollow\" / sponsored / ugc.",
      "Note follow vs nofollow in outreach notes; still valuable for NAP even if nofollow.",
      "Fix wrong destination URLs (homepage vs contact) where the directory allows edits.",
    ],
    links: [
      { label: "Whitespark Citation Finder", url: "https://whitespark.ca/citation-finder/" },
    ],
  },
  "Full NAP consistency re-check across all live citations": {
    summary: "Quarterly full pass: every LIVE citation vs Golden NAP.",
    steps: [
      "Export or scroll all LIVE rows in the Citations tracker.",
      "Open each listing; compare NAP to Golden NAP; fix or file corrections.",
      "Set NEEDS_UPDATE where pending; leave LIVE only when exact match.",
      "Summarize % consistent in the quarterly report.",
    ],
    links: [
      { label: "Whitespark Citation Finder", url: "https://whitespark.ca/citation-finder/" },
      { label: "Google Business Profile", url: "https://business.google.com" },
    ],
  },
  "Citation duplicate cleanup": {
    summary: "Find and suppress duplicate listings that split reviews and confuse NAP.",
    steps: [
      "Search Maps / Apple / Bing / Yelp for name + phone + address variants.",
      "List duplicates; claim or request merge/removal via each platform’s support flow.",
      "Prefer keeping the listing with reviews / correct NAP; mark others for cleanup.",
      "Re-check in 30 days; update citation statuses.",
    ],
    links: [
      { label: "Google Maps", url: "https://www.google.com/maps" },
      { label: "Bing Places", url: "https://www.bingplaces.com" },
      { label: "Yelp for Business", url: "https://biz.yelp.com" },
    ],
  },
  "Check for local news/community listing opportunities": {
    summary: "Find free community calendars, news “local business” pages, and neighborhood blogs.",
    steps: [
      "Search “[city] submit event”, “local business spotlight”, and community association sites.",
      "Submit free listings or pitch a short feature with a link ask.",
      "Add MEDIA prospects in Local Links for each target.",
      "Mark ACQUIRED when published with a URL.",
    ],
    links: [
      { label: "Google Alerts", url: "https://www.google.com/alerts" },
      { label: "Google: local business spotlight", url: "https://www.google.com/search?q=local+business+spotlight+submit" },
    ],
  },
};
