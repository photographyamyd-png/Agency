import type { PageType } from "@prisma/client";

export interface PageTemplate {
  pageType: PageType;
  name: string;
  slug: string;
  children?: PageTemplate[];
}

export const DEFAULT_SITEMAP_TEMPLATE: PageTemplate[] = [
  { pageType: "HOMEPAGE", name: "Homepage", slug: "/" },
  {
    pageType: "SERVICE",
    name: "Services",
    slug: "/services",
    children: [
      { pageType: "SERVICE", name: "Core Service", slug: "/services/core-service" },
    ],
  },
  {
    pageType: "SERVICE_AREA",
    name: "Service Areas",
    slug: "/service-areas",
    children: [
      { pageType: "LOCATION", name: "City Landing Page", slug: "/service-areas/city" },
    ],
  },
  { pageType: "ABOUT", name: "About", slug: "/about" },
  { pageType: "CONTACT", name: "Contact", slug: "/contact" },
  { pageType: "FAQ", name: "FAQ", slug: "/faq" },
  { pageType: "CASE_STUDY", name: "Case Studies", slug: "/case-studies" },
  { pageType: "BLOG", name: "Blog", slug: "/blog" },
  { pageType: "TESTIMONIALS", name: "Testimonials", slug: "/testimonials" },
  { pageType: "EMERGENCY", name: "Emergency Services", slug: "/emergency" },
];

export const PAGE_TYPE_LABELS: Record<PageType, string> = {
  HOMEPAGE: "Homepage",
  SERVICE: "Service Page",
  SERVICE_AREA: "Service Area Hub",
  LOCATION: "City/Location Page",
  ABOUT: "About",
  CONTACT: "Contact",
  BLOG: "Blog",
  FAQ: "FAQ",
  CASE_STUDY: "Case Study",
  TESTIMONIALS: "Testimonials",
  EMERGENCY: "Emergency Services",
  OTHER: "Other",
};
