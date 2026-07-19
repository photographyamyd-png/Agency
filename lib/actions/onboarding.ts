"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { OnboardingStage } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { sendOnboardingEmail } from "@/lib/onboarding/send";
import {
  completeAccessStage,
  completeAgreementStage,
  completePackagesStage,
  completeProfileStage,
} from "@/lib/onboarding/process-submission";
import {
  validateAccessHandoff,
  validatePackageSelection,
  validateProfileAnswers,
  type AccessHandoffItem,
} from "@/lib/onboarding/stages";
import { PRICING_PACKAGES } from "@/lib/blueprint/pricing-packages";

async function loadOnboardingSession(token: string) {
  const session = await prisma.onboardingSession.findUnique({
    where: { token },
    include: {
      template: { include: { rules: { orderBy: { order: "asc" } } } },
      lead: true,
      proposal: { include: { lineItems: true } },
      client: {
        include: {
          accessItems: { orderBy: { label: "asc" } },
        },
      },
    },
  });
  return session;
}

function sessionError(
  session: Awaited<ReturnType<typeof loadOnboardingSession>>
): string | null {
  if (!session || !session.leadId || !session.lead) {
    return "Invalid or expired onboarding link";
  }
  if (session.tokenExpiresAt < new Date()) {
    return "This onboarding link has expired";
  }
  if (session.status === "COMPLETED" || session.currentStage === "COMPLETED") {
    return "This onboarding was already completed";
  }
  return null;
}

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

/** @deprecated Prefer staged wizard; kept for older forms. */
export async function submitOnboardingQuestionnaire(
  token: string,
  responses: Record<string, unknown>
) {
  const session = await loadOnboardingSession(token);
  const err = sessionError(session);
  if (err || !session) return { error: err ?? "Invalid session" };

  const result = await advanceOnboardingProfile(token, responses);
  return result;
}

export async function getOnboardingWizardState(token: string) {
  const session = await loadOnboardingSession(token);
  if (!session || !session.lead) return null;
  if (session.tokenExpiresAt < new Date()) return { expired: true as const };

  const agency = await prisma.agencyProfile.findFirst();
  const questionnaire = session.template.questionnaire as {
    fields?: Array<{
      id: string;
      type: string;
      label: string;
      required?: boolean;
      options?: { value: string; label: string }[];
      placeholder?: string;
    }>;
  };

  return {
    expired: false as const,
    completed: session.status === "COMPLETED",
    currentStage: session.currentStage as OnboardingStage,
    completedStages: session.completedStages,
    responses: (session.responses as Record<string, unknown>) ?? {},
    selectedPackages: Array.isArray(session.selectedPackages)
      ? (session.selectedPackages as string[])
      : [],
    contactName: session.lead.contactName,
    businessName: session.lead.businessName,
    fields: questionnaire.fields ?? [],
    packages: PRICING_PACKAGES.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      priceMin: p.priceMin,
      priceMax: p.priceMax,
      unit: p.unit,
      scopeIncluded: p.scopeIncluded,
    })),
    proposal: session.proposal
      ? {
          id: session.proposal.id,
          status: session.proposal.status,
          scopeIncluded: session.proposal.scopeIncluded,
          signedAt: session.proposal.signedAt,
          lineItems: session.proposal.lineItems.map((li) => ({
            id: li.id,
            description: li.description,
            total: Number(li.total),
          })),
          retainerTerms: session.proposal.retainerTerms,
        }
      : null,
    agreementTerms: agency?.standardAgreementTerms ?? null,
    agencyEmail: agency?.email ?? null,
    accessItems:
      session.client?.accessItems.map((a) => ({
        id: a.id,
        label: a.label,
        systemType: a.systemType,
        status: a.status,
        notes: a.notes,
      })) ?? [],
    encryptionReady: Boolean(process.env.ENCRYPTION_KEY?.trim()),
  };
}

export async function advanceOnboardingProfile(
  token: string,
  responses: Record<string, unknown>
) {
  const session = await loadOnboardingSession(token);
  const err = sessionError(session);
  if (err || !session?.leadId) return { error: err ?? "Invalid session" };

  if (session.currentStage !== "PROFILE") {
    return { error: "Profile stage already completed — refresh the page" };
  }

  const validation = validateProfileAnswers(responses);
  if (validation) return { error: validation };

  // Prefill contact from lead if blank
  if (!responses.primaryContactName) {
    responses.primaryContactName = session.lead!.contactName;
  }
  if (!responses.billingEmail) {
    responses.billingEmail = session.lead!.email;
  }

  try {
    const { nextStage } = await completeProfileStage({
      sessionId: session.id,
      leadId: session.leadId,
      template: session.template,
      responses,
    });
    return { success: true, nextStage };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save profile" };
  }
}

export async function advanceOnboardingPackages(
  token: string,
  packageIds: string[]
) {
  const session = await loadOnboardingSession(token);
  const err = sessionError(session);
  if (err || !session?.leadId) return { error: err ?? "Invalid session" };
  if (session.currentStage !== "PACKAGES") {
    return { error: "Complete the profile stage first" };
  }
  if (!session.clientId) {
    return { error: "Client profile missing — complete profile first" };
  }

  const validation = validatePackageSelection(packageIds);
  if (validation) return { error: validation };

  try {
    const { nextStage } = await completePackagesStage({
      sessionId: session.id,
      clientId: session.clientId,
      packageIds,
      template: session.template,
      leadId: session.leadId,
    });
    return { success: true, nextStage };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save packages" };
  }
}

export async function advanceOnboardingAgreement(
  token: string,
  signatureDataUrl: string
) {
  const session = await loadOnboardingSession(token);
  const err = sessionError(session);
  if (err || !session) return { error: err ?? "Invalid session" };
  if (session.currentStage !== "AGREEMENT") {
    return { error: "Complete package selection first" };
  }
  if (!session.proposalId) {
    return { error: "No proposal found — go back and select packages" };
  }
  if (!signatureDataUrl || !signatureDataUrl.startsWith("data:image")) {
    return { error: "Please draw your signature before continuing" };
  }

  const h = await headers();
  const signedIp =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    undefined;

  try {
    const { nextStage } = await completeAgreementStage({
      sessionId: session.id,
      proposalId: session.proposalId,
      signatureDataUrl,
      signedIp,
    });
    return { success: true, nextStage };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to sign agreement" };
  }
}

export async function advanceOnboardingAccess(
  token: string,
  items: AccessHandoffItem[]
) {
  const session = await loadOnboardingSession(token);
  const err = sessionError(session);
  if (err || !session?.leadId || !session.clientId) {
    return { error: err ?? "Invalid session" };
  }
  if (session.currentStage !== "ACCESS") {
    return { error: "Sign the agreement first" };
  }

  const validation = validateAccessHandoff(items);
  if (validation) return { error: validation };

  const packageIds = Array.isArray(session.selectedPackages)
    ? (session.selectedPackages as string[])
    : [];

  try {
    const result = await completeAccessStage({
      sessionId: session.id,
      clientId: session.clientId,
      leadId: session.leadId,
      items,
      packageIds,
    });
    if (session.clientId) {
      revalidatePath(`/clients/${session.clientId}`);
    }
    return { success: true, nextStage: result.nextStage, clientStatus: result.clientStatus };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save access" };
  }
}
