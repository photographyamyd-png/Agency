import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";

const TEST_EMAIL = "Hutchisondamy@gmail.com";
const prisma = new PrismaClient();

function appUrl(path) {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
}

function onboardingEmailVars({ contactName, businessName, questionnaireUrl }) {
  const questionnaireButton = `<a href="${questionnaireUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#6366f1;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;">Complete questionnaire</a>`;
  return {
    contactName,
    businessName,
    questionnaireUrl,
    questionnaireButton,
  };
}

function renderTemplate(template, vars) {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${key}}}`, String(value ?? ""));
  }
  return out;
}

async function main() {
  const email = TEST_EMAIL.trim().toLowerCase();

  let lead = await prisma.lead.findFirst({
    where: { email, source: "manual-test" },
  });

  if (!lead) {
    lead = await prisma.lead.create({
      data: {
        businessName: "Hutchison Test Plumbing",
        contactName: "Amy Hutchison",
        email,
        phone: "555-0100",
        website: "https://example-hutchison-plumbing.com",
        serviceArea: "Barrie, ON",
        industry: "HVAC / Plumbing",
        interestedIn: ["WEBSITE", "SEO_RETAINER"],
        source: "manual-test",
        status: "NEW",
      },
    });
    console.log("Created test lead:", lead.id);
  } else {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: "NEW" },
    });
    console.log("Using existing test lead:", lead.id);
  }

  const template = await prisma.onboardingTemplate.findFirst({
    where: { isDefault: true, active: true },
  });
  if (!template) throw new Error("No default onboarding template");

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

  const questionnaireUrl = appUrl(`/portal/onboarding/${token}`);
  const vars = onboardingEmailVars({
    contactName: lead.contactName,
    businessName: lead.businessName,
    questionnaireUrl,
  });
  const subject = renderTemplate(template.welcomeEmailSubject, vars);
  const bodyHtml = renderTemplate(template.welcomeEmailBody, vars);

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.error("Gmail not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env");
    console.log("\nQuestionnaire link (open manually):\n", questionnaireUrl);
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"${process.env.GMAIL_FROM_NAME ?? "Agency OS"}" <${user}>`,
    to: email,
    subject,
    html: bodyHtml,
  });

  await prisma.lead.update({
    where: { id: lead.id },
    data: { status: "QUESTIONNAIRE_SENT" },
  });

  console.log("\n✓ Onboarding email sent to:", email);
  console.log("\nQuestionnaire link:\n", questionnaireUrl);
  console.log("\nAfter you submit:");
  console.log("  • Lead status → QUESTIONNAIRE_COMPLETED");
  console.log("  • Client record + brand profile auto-created");
  console.log("  • Checklists/tasks generated from onboarding rules");
  console.log("  • View lead:", appUrl(`/leads/${lead.id}`));
  console.log("  • Then convert or open client workspace to see distributed data");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
