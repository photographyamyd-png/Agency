import { z } from "zod";

export const websiteLeadSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  contactName: z.string().min(1, "Your name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  website: z.string().optional(),
  interestedIn: z.array(z.string()).min(1, "Select at least one service"),
  problemSummary: z.string().optional(),
});

export type WebsiteLeadInput = z.infer<typeof websiteLeadSchema>;
