import type { LeadStatus } from "@prisma/client";

export const LEAD_STATUS_ORDER: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUESTIONNAIRE_SENT",
  "QUESTIONNAIRE_COMPLETED",
  "DISCOVERY_SCHEDULED",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUESTIONNAIRE_SENT: "Questionnaire Sent",
  QUESTIONNAIRE_COMPLETED: "Questionnaire Completed",
  DISCOVERY_SCHEDULED: "Discovery Scheduled",
  PROPOSAL_SENT: "Proposal Sent",
  WON: "Won",
  LOST: "Lost",
};

export const LOSS_REASONS = [
  "Budget too low",
  "Not a fit",
  "Went with competitor",
  "No response",
  "Timeline mismatch",
  "Other",
] as const;

export const INTERESTED_IN_OPTIONS = [
  { value: "WEBSITE", label: "Website" },
  { value: "SEO_RETAINER", label: "SEO Retainer" },
  { value: "BOTH", label: "Both" },
] as const;

export const FIT_DECISIONS = [
  { value: "PROCEED", label: "Proceed" },
  { value: "PAUSE", label: "Pause" },
  { value: "DECLINE", label: "Decline" },
] as const;
