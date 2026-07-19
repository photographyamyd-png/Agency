export type SchemaType =
  | "LocalBusiness"
  | "Organization"
  | "Service"
  | "FAQPage"
  | "BreadcrumbList"
  | "AggregateRating";

export interface SchemaTemplate {
  type: SchemaType;
  label: string;
  description: string;
  template: Record<string, unknown>;
}

export const SCHEMA_TEMPLATES: SchemaTemplate[] = [
  {
    type: "LocalBusiness",
    label: "LocalBusiness",
    description: "Homepage + contact page — name, address, telephone, geo, hours",
    template: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "",
      address: { "@type": "PostalAddress", streetAddress: "", addressLocality: "", addressRegion: "", postalCode: "" },
      telephone: "",
      url: "",
      geo: { "@type": "GeoCoordinates", latitude: 0, longitude: 0 },
      openingHoursSpecification: [],
      areaServed: [],
    },
  },
  {
    type: "Organization",
    label: "Organization",
    description: "Homepage — name, url, logo, contactPoint, sameAs",
    template: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "",
      url: "",
      logo: "",
      contactPoint: { "@type": "ContactPoint", telephone: "", contactType: "customer service" },
      sameAs: [],
    },
  },
  {
    type: "Service",
    label: "Service",
    description: "Each service page — name, description, provider, areaServed",
    template: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "",
      description: "",
      provider: { "@type": "LocalBusiness", name: "" },
      areaServed: [],
      serviceType: "",
    },
  },
  {
    type: "FAQPage",
    label: "FAQPage",
    description: "FAQ sections — mainEntity with Question and Answer pairs",
    template: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [{ "@type": "Question", name: "", acceptedAnswer: { "@type": "Answer", text: "" } }],
    },
  },
  {
    type: "BreadcrumbList",
    label: "BreadcrumbList",
    description: "Interior pages — itemListElement with position, name, item",
    template: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [{ "@type": "ListItem", position: 1, name: "", item: "" }],
    },
  },
  {
    type: "AggregateRating",
    label: "AggregateRating",
    description: "Pages with review widgets — ratingValue, reviewCount",
    template: {
      "@context": "https://schema.org",
      "@type": "AggregateRating",
      ratingValue: 0,
      reviewCount: 0,
      bestRating: 5,
    },
  },
];
