"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAgencyProfile } from "@/lib/agency/profile";
import { websiteLeadSchema } from "@/lib/validation/marketing";
import { emitSystemEvent } from "@/lib/events/emit";
import { SYSTEM_EVENT_TYPES } from "@/lib/events/types";
import { sendOnboardingEmail } from "@/lib/onboarding/send";
import { sendTemplatedEmail } from "@/lib/email/gmail";

export async function submitWebsiteLead(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const raw = {
    businessName: formData.get("businessName"),
    contactName: formData.get("contactName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    website: formData.get("website") || undefined,
    budgetRange: formData.get("budgetRange") || undefined,
    interestedIn: formData.getAll("interestedIn").map(String),
    problemSummary: formData.get("problemSummary") || undefined,
    formVariant: formData.get("formVariant") || undefined,
  };

  const parsed = websiteLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const { formVariant, ...data } = parsed.data;
  const interestedIn =
    data.interestedIn.length > 0
      ? data.interestedIn
      : formVariant === "qualify"
        ? ["INTRO_CALL"]
        : [];

  let lead;
  try {
    lead = await prisma.lead.create({
      data: {
        businessName: data.businessName,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone || null,
        website: data.website || null,
        budgetRange: data.budgetRange || null,
        interestedIn,
        problemSummary: data.problemSummary || null,
        source: formVariant === "qualify" ? "website_qualify" : "website",
        status: "NEW",
      },
    });
  } catch (err) {
    console.error("submitWebsiteLead: failed to create lead", err);
    return { error: "Unable to save your request. Please try again later." };
  }

  await emitSystemEvent({
    type: SYSTEM_EVENT_TYPES.LEAD_CREATED,
    leadId: lead.id,
    payload: { source: "website" },
  });

  const agency = await getAgencyProfile();

  if (agency.autoOnboardWebsiteLeads) {
    try {
      await sendOnboardingEmail({ leadId: lead.id });
    } catch {
      // Lead saved; onboarding email optional if template missing
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    await sendTemplatedEmail({
      to: adminEmail,
      subject: "New lead: {{businessName}}",
      bodyTemplate:
        "New website lead from {{contactName}} at {{businessName}}.\n\nEmail: {{email}}\n\nView in Agency OS: {{dashboardUrl}}",
      vars: {
        businessName: lead.businessName,
        contactName: lead.contactName,
        email: lead.email,
        dashboardUrl: `${process.env.NEXTAUTH_URL ?? ""}/leads/${lead.id}`,
      },
      leadId: lead.id,
    });
  }

  redirect(`/thank-you?onboard=${agency.autoOnboardWebsiteLeads ? "1" : "0"}`);
}
