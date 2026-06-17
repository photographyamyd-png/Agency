export const DEFAULT_IMAGES = {
  hero: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
  heroAlt: "Construction crew reviewing plans on a commercial job site",
  auth: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
  services: {
    WEBSITE:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
    SEO: "https://images.unsplash.com/photo-1569336412239-889163776e01?w=1200&q=80",
    REPORTING:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80",
  },
  results: [
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
  ],
  trades:
    "https://images.unsplash.com/photo-1581094797790-f07339a71dca?w=1200&q=80",
  tradesAlt: "Skilled tradesperson in hard hat working on site",
} as const;

export type ServicesImages = {
  WEBSITE?: string;
  SEO?: string;
  REPORTING?: string;
};

export function resolveHeroImage(url?: string | null) {
  return url || DEFAULT_IMAGES.hero;
}

export function resolveHeroAlt(alt?: string | null) {
  return alt || DEFAULT_IMAGES.heroAlt;
}

export function resolveServiceImage(
  key: keyof ServicesImages,
  images?: ServicesImages | null
) {
  return images?.[key] || DEFAULT_IMAGES.services[key];
}

export function resolveResultsImages(images?: string[] | null) {
  if (images && images.length > 0) return images;
  return [...DEFAULT_IMAGES.results];
}

export function resolveTradesImage(url?: string | null) {
  return url || DEFAULT_IMAGES.trades;
}

export function resolveTradesAlt(alt?: string | null) {
  return alt || DEFAULT_IMAGES.tradesAlt;
}

export function parseServicesImages(json: unknown): ServicesImages | null {
  if (!json || typeof json !== "object") return null;
  return json as ServicesImages;
}

export function parseResultsImages(json: unknown): string[] | null {
  if (!Array.isArray(json)) return null;
  return json.filter((v): v is string => typeof v === "string");
}
