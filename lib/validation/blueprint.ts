import { z } from "zod";
import { GEO_READINESS_CHECKLIST } from "@/lib/blueprint/geo-checklist";
import { SITE_WIDE_CHECKLIST } from "@/lib/blueprint/site-checklist";

const itemValueSchema = z.object({
  status: z.enum(["pending", "done", "na"]),
  notes: z.string().optional(),
  completedAt: z.string().optional(),
});

export const baselineAuditDataSchema = z.object({
  ga4_tracking: itemValueSchema,
  gsc_verified: itemValueSchema,
  gbp_state: itemValueSchema,
  gsc_rankings: itemValueSchema,
  backlink_profile: itemValueSchema,
  citation_audit: itemValueSchema,
  pagespeed_baseline: itemValueSchema,
  indexed_pages: itemValueSchema,
  conversion_tracking: itemValueSchema,
  content_inventory: itemValueSchema,
});

const geoShape = Object.fromEntries(
  GEO_READINESS_CHECKLIST.map((item) => [item.key, itemValueSchema])
);

export const geoReadinessDataSchema = z.object(geoShape);

const siteChecklistShape = Object.fromEntries(
  SITE_WIDE_CHECKLIST.map((item) => [item.itemKey, itemValueSchema])
);

export const siteChecklistDataSchema = z.object(siteChecklistShape);

export const goldenNapSchema = z.object({
  businessName: z.string().min(1),
  streetAddress: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  phone: z.string().min(1),
  websiteUrl: z.string().url(),
  hours: z.string().optional(),
  shortDescription: z.string().optional(),
  formatRules: z.string().optional(),
  locked: z.boolean().default(false),
});

export const reviewTargetsSchema = z.object({
  monthlyTarget: z.number().min(1).default(5),
  minimumBeforeWork: z.number().default(10),
  reviewLink: z.string().url().optional().or(z.literal("")),
  qrCodeUrl: z.string().url().optional().or(z.literal("")),
  requestTemplate: z.string().optional(),
  coachingPrompt: z.string().optional(),
});
