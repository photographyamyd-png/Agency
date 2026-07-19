/**
 * Creates a lead + onboarding session and emails the questionnaire link
 * (or prints it if Gmail isn't configured).
 *
 * Usage: npx tsx scripts/send-test-onboarding-link.ts
 */
import { randomBytes } from "crypto";
import { PrismaClient } from "@prisma/client";
import { sendTemplatedEmail, isEmailConfigured } from "../lib/email/gmail";
import { onboardingEmailVars } from "../lib/email/templates";

const prisma = new PrismaClient();
const BASE = (process.env.NEXTAUTH_URL ?? "http://localhost:3003").replace(/\/$/, "");

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) throw new Error("ADMIN_EMAIL not set in .env");

  const template = await prisma.onboardingTemplate.findFirst({
    where: { isDefault: true, active: true },
  });
  if (!template) throw new Error("No default onboarding template. Run: npm run db:seed");

  const stamp = Date.now().toString(36);
  const lead = await prisma.lead.create({
    data: {
      businessName: `Email-Test HVAC ${stamp}`,
      contactName: "Jordan Blake",
      email: adminEmail,
      phone: "416-555-0199",
      website: "https://example-hvac-test.local",
      location: "Maple Ridge, BC",
      serviceArea: "Maple Ridge",
      industry: "HVAC",
      interestedIn: ["WEBSITE", "SEO_RETAINER"],
      problemSummary: "Testing email onboarding → client hydrate flow",
      source: "email-onboarding-test",
      status: "NEW",
    },
  });

  const token = randomBytes(16).toString("hex");
  const session = await prisma.onboardingSession.create({
    data: {
      templateId: template.id,
      leadId: lead.id,
      token,
      tokenExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: "SENT",
      sentAt: new Date(),
    },
  });

  const questionnaireUrl = `${BASE}/portal/onboarding/${token}`;

  await prisma.lead.update({
    where: { id: lead.id },
    data: { status: "QUESTIONNAIRE_SENT" },
  });

  let emailSent = false;
  let emailError: string | null = null;

  if (isEmailConfigured()) {
    const result = await sendTemplatedEmail({
      to: adminEmail,
      subject: template.welcomeEmailSubject,
      bodyTemplate: template.welcomeEmailBody,
      vars: onboardingEmailVars({
        contactName: lead.contactName,
        businessName: lead.businessName,
        questionnaireUrl,
      }),
      leadId: lead.id,
    });
    emailSent = result.ok;
    emailError = result.error ?? null;
  } else {
    emailError = "Gmail not configured (GMAIL_USER / GMAIL_APP_PASSWORD)";
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        emailSent,
        emailError,
        emailedTo: adminEmail,
        leadId: lead.id,
        businessName: lead.businessName,
        questionnaireUrl,
        instructions: emailSent
          ? "Check your inbox, click the questionnaire link, fill every field, submit. Then open /clients in admin."
          : "Email failed/skipped — open questionnaireUrl directly, fill every field, submit.",
      },
      null,
      2
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
