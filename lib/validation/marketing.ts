import { z } from "zod";

export const websiteLeadSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  contactName: z.string().min(1, "Your name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  website: z.string().optional(),
  budgetRange: z.string().optional(),
  interestedIn: z.array(z.string()).default([]),
  problemSummary: z.string().optional(),
  formVariant: z.enum(["full", "qualify"]).optional(),
}).superRefine((data, ctx) => {
  if (data.formVariant === "qualify") {
    if (!data.budgetRange?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Monthly revenue helps me know if we're a fit",
        path: ["budgetRange"],
      });
    }
    return;
  }
  if (!data.interestedIn.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Select at least one service",
      path: ["interestedIn"],
    });
  }
});

export type WebsiteLeadInput = z.infer<typeof websiteLeadSchema>;
