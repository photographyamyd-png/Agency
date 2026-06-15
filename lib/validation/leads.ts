import { z } from "zod";

export const createLeadSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  serviceArea: z.string().optional(),
  industry: z.string().optional(),
  urgency: z.string().optional(),
  budgetRange: z.string().optional(),
  interestedIn: z.array(z.string()).default([]),
  problemSummary: z.string().optional(),
  source: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial().extend({
  id: z.string().min(1),
  status: z
    .enum([
      "NEW",
      "CONTACTED",
      "QUESTIONNAIRE_SENT",
      "QUESTIONNAIRE_COMPLETED",
      "DISCOVERY_SCHEDULED",
      "PROPOSAL_SENT",
      "WON",
      "LOST",
    ])
    .optional(),
  lossReason: z.string().optional(),
});

export const updateLeadStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum([
    "NEW",
    "CONTACTED",
    "QUESTIONNAIRE_SENT",
    "QUESTIONNAIRE_COMPLETED",
    "DISCOVERY_SCHEDULED",
    "PROPOSAL_SENT",
    "WON",
    "LOST",
  ]),
  lossReason: z.string().optional(),
});

export const discoveryCallSchema = z.object({
  leadId: z.string().min(1),
  scheduledAt: z.string().optional(),
  completedAt: z.string().optional(),
  notes: z.string().optional(),
  summary: z.string().optional(),
  decisionMaker: z.boolean().optional(),
  responsivenessNote: z.string().optional(),
  painPoints: z.string().optional(),
  seasonalPatterns: z.string().optional(),
  topServices: z.string().optional(),
  hasGBP: z.boolean().optional(),
  hasDomainAccess: z.boolean().optional(),
  hasAnalyticsAccess: z.boolean().optional(),
  hasAdsAccount: z.boolean().optional(),
  fitDecision: z.enum(["PROCEED", "PAUSE", "DECLINE"]).optional(),
});
