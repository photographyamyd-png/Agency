export const DEFAULT_IMAGES = {
  hero: "/images/marketing/stuart/hero-jobsite.jpg",
  heroAlt: "Bobcat track loader on a real jobsite — the work Amy builds sites for",
  auth: "/images/marketing/stuart/about-portrait.jpg",
  services: {
    WEBSITE: "/images/marketing/stuart/hero-jobsite.jpg",
    SEO: "/images/marketing/stuart/footer-note.jpg",
    REPORTING: "/images/marketing/stuart/about-extra.jpg",
  },
  results: [
    "/images/marketing/stuart/hero-jobsite.jpg",
    "/images/marketing/stuart/about-extra.jpg",
  ],
  trades: "/images/marketing/stuart/about-portrait.jpg",
  tradesAlt: "Jobsite equipment — the kind of business I build websites for",
  chickens: "/images/marketing/stuart/footer-note.jpg",
  chickensAlt: "Hands on the controls — real work, real clients",
  midCtaVideo: "/videos/marketing/mid-cta.mp4?v=2",
  midCtaPoster: "/images/marketing/stuart/mid-cta-poster.jpg",
} as const;

export type ServicesImages = {
  WEBSITE?: string;
  SEO?: string;
  REPORTING?: string;
};

const BROKEN_IMAGE_IDS = [
  "1621905252507",
  "1612170153131",
  "1504328345606",
  "1573497019940",
];

function isBrokenImageUrl(url: string) {
  return BROKEN_IMAGE_IDS.some((id) => url.includes(id));
}

export function resolveHeroImage(url?: string | null) {
  const stale = url?.includes("1460925895917") || url?.includes("analytics");
  if (!url || stale || isBrokenImageUrl(url)) return DEFAULT_IMAGES.hero;
  return url;
}

export function resolveHeroAlt(alt?: string | null) {
  if (!alt || alt.toLowerCase().includes("analytics") || alt.toLowerCase().includes("dashboard")) {
    return DEFAULT_IMAGES.heroAlt;
  }
  return alt;
}

export function resolveServiceImage(
  key: keyof ServicesImages,
  images?: ServicesImages | null
) {
  const custom = images?.[key];
  if (custom && !isBrokenImageUrl(custom)) return custom;
  return DEFAULT_IMAGES.services[key];
}

export function resolveResultsImages(images?: string[] | null) {
  if (images && images.length > 0) {
    const filtered = images.filter(
      (u) =>
        !u.includes("1460925895917") &&
        !u.includes("1551288049-bebda4e38f71") &&
        !isBrokenImageUrl(u)
    );
    if (filtered.length > 0) return filtered;
  }
  return [...DEFAULT_IMAGES.results];
}

export function resolveTradesImage(url?: string | null) {
  if (
    !url ||
    url.includes("1573497019940") ||
    url.includes("unsplash.com") ||
    isBrokenImageUrl(url)
  ) {
    return DEFAULT_IMAGES.trades;
  }
  return url;
}

export function resolveTradesAlt(alt?: string | null) {
  return alt || DEFAULT_IMAGES.tradesAlt;
}

export function resolveChickenImage(url?: string | null) {
  // Prefer Stuart stills over legacy Unsplash chicken shots
  if (url && !isBrokenImageUrl(url) && !url.includes("unsplash.com") && !url.includes("1548558960")) {
    return url;
  }
  return DEFAULT_IMAGES.chickens;
}

export function parseServicesImages(json: unknown): ServicesImages | null {
  if (!json || typeof json !== "object") return null;
  return json as ServicesImages;
}

export function parseResultsImages(json: unknown): string[] | null {
  if (!Array.isArray(json)) return null;
  return json.filter((v): v is string => typeof v === "string");
}
