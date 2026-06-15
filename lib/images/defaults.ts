export const DEFAULT_IMAGES = {
  hero: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
  heroAlt: "Analytics dashboard on a laptop screen",
  auth: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
  services: {
    WEBSITE: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
    SEO: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    REPORTING: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  results: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  ],
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

export function parseServicesImages(json: unknown): ServicesImages | null {
  if (!json || typeof json !== "object") return null;
  return json as ServicesImages;
}

export function parseResultsImages(json: unknown): string[] | null {
  if (!Array.isArray(json)) return null;
  return json.filter((v): v is string => typeof v === "string");
}
