export const DEFAULT_IMAGES = {
  hero: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=85",
  heroAlt: "Construction crew on a jobsite — mud, boots, real work",
  auth: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
  services: {
    WEBSITE:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=85",
    SEO: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=85",
    REPORTING:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85",
  },
  results: [
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=85",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=85",
  ],
  trades:
    "https://images.unsplash.com/photo-1504148455320-c376907d081c?w=1200&q=85",
  tradesAlt: "Welder on a jobsite — the kind of business I build websites for",
  chickens:
    "https://images.unsplash.com/photo-1548558960-f6787264f4cc?w=400&q=85",
  chickensAlt: "Amy's backyard chickens",
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
  if (!url || url.includes("1573497019940") || isBrokenImageUrl(url)) {
    return DEFAULT_IMAGES.trades;
  }
  return url;
}

export function resolveTradesAlt(alt?: string | null) {
  return alt || DEFAULT_IMAGES.tradesAlt;
}

export function resolveChickenImage(url?: string | null) {
  if (url && !isBrokenImageUrl(url)) return url;
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
