import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendTemplatedEmail } from "@/lib/email/gmail";
import { emitSystemEvent } from "@/lib/events/emit";
import { SYSTEM_EVENT_TYPES } from "@/lib/events/types";

const TOKEN_TTL_DAYS = 14;

function appUrl(path: string) {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
}

export async function getDefaultTemplate() {
  return prisma.onboardingTemplate.findFirst({
    where: { isDefault: true, active: true },
    include: { rules: { orderBy: { order: "asc" } } },
  });
}

export async function sendOnboardingEmail(input: {
  leadId: string;
  templateId?: string;
}) {
  const lead = await prisma.lead.findUnique({ where: { id: input.leadId } });
  if (!lead) throw new Error("Lead not found");

  const template =
    (input.templateId
      ? await prisma.onboardingTemplate.findUnique({
          where: { id: input.templateId },
        })
      : null) ?? (await getDefaultTemplate());

  if (!template) throw new Error("No onboarding template configured");

  const token = randomBytes(32).toString("hex");
  const session = await prisma.onboardingSession.create({
    data: {
      templateId: template.id,
      leadId: lead.id,
      token,
      tokenExpiresAt: new Date(
        Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
      ),
      status: "SENT",
      sentAt: new Date(),
    },
  });

  const questionnaireUrl = appUrl(`/portal/onboarding/${token}`);

  const emailResult = await sendTemplatedEmail({
    to: lead.email,
    subject: template.welcomeEmailSubject,
    bodyTemplate: template.welcomeEmailBody,
    vars: {
      contactName: lead.contactName,
      businessName: lead.businessName,
      questionnaireUrl,
    },
    leadId: lead.id,
  });

  if (!emailResult.ok) {
    throw new Error(emailResult.error ?? "Failed to send onboarding email");
  }

  await prisma.lead.update({
    where: { id: lead.id },
    data: { status: "QUESTIONNAIRE_SENT" },
  });

  await emitSystemEvent({
    type: SYSTEM_EVENT_TYPES.ONBOARDING_SENT,
    leadId: lead.id,
    payload: { sessionId: session.id, templateId: template.id },
  });

  return session;
}

export { appUrl };
