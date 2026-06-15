"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { sendOnboardingEmail } from "@/lib/onboarding/send";
import { processOnboardingSubmission } from "@/lib/onboarding/process-submission";

export async function sendLeadOnboarding(leadId: string) {
  await requireAdmin();
  await sendOnboardingEmail({ leadId });
  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
}

export async function sendOnboardingTestEmail(
  _prev: { error?: string; success?: string; questionnaireUrl?: string } | null,
  formData: FormData
): Promise<{ error?: string; success?: string; questionnaireUrl?: string } | null> {
  await requireAdmin();

  const { isEmailConfigured } = await import("@/lib/email/gmail");
  if (!isEmailConfigured()) {
    return {
      error:
        "Gmail not configured. Add GMAIL_APP_PASSWORD to .env (Google Account → Security → App passwords), then restart the dev server.",
    };
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) {
    return { error: "ADMIN_EMAIL is not set in .env" };
  }

  const templateId = String(formData.get("templateId") ?? "") || undefined;

  let lead = await prisma.lead.findFirst({
    where: { email: adminEmail, source: "onboarding-test" },
  });

  if (!lead) {
    lead = await prisma.lead.create({
      data: {
        businessName: "Test Business Co.",
        contactName: "Test Contact",
        email: adminEmail,
        source: "onboarding-test",
        status: "NEW",
      },
    });
  } else {
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        businessName: "Test Business Co.",
        contactName: "Test Contact",
        status: "NEW",
      },
    });
  }

  try {
    const session = await sendOnboardingEmail({
      leadId: lead.id,
      templateId,
    });
    const { appUrl } = await import("@/lib/onboarding/send");
    const questionnaireUrl = appUrl(`/portal/onboarding/${session.token}`);

    revalidatePath("/settings/onboarding");
    revalidatePath("/leads");

    return {
      success: `Test onboarding email sent to ${adminEmail}`,
      questionnaireUrl,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to send test email",
    };
  }
}

export async function submitOnboardingQuestionnaire(
  token: string,
  responses: Record<string, unknown>
) {
  const session = await prisma.onboardingSession.findUnique({
    where: { token },
    include: {
      template: { include: { rules: { orderBy: { order: "asc" } } } },
      lead: true,
    },
  });

  if (!session || !session.leadId || !session.lead) {
    return { error: "Invalid or expired onboarding link" };
  }

  if (session.tokenExpiresAt < new Date()) {
    await prisma.onboardingSession.update({
      where: { id: session.id },
      data: { status: "EXPIRED" },
    });
    return { error: "This onboarding link has expired" };
  }

  if (session.status === "COMPLETED") {
    return { error: "This questionnaire was already submitted" };
  }

  await processOnboardingSubmission({
    sessionId: session.id,
    token,
    responses,
    template: session.template,
    leadId: session.leadId,
  });

  return { success: true };
}
