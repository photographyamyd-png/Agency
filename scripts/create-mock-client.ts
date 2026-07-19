/**
 * Creates a mock lead + onboarding session for local walkthrough.
 * Usage: npx tsx scripts/create-mock-client.ts
 */
import { randomBytes } from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PORT = process.env.MOCK_PORT ?? "3003";
const BASE = `http://localhost:${PORT}`;

async function main() {
  let template = await prisma.onboardingTemplate.findFirst({
    where: { isDefault: true, active: true },
    include: { rules: true },
  });

  if (!template) {
    console.log("No default template — running seed prerequisites...");
    // Minimal: user should run npm run db:seed
    throw new Error("No onboarding template. Run: npm run db:seed");
  }

  const stamp = Date.now().toString(36);
  const lead = await prisma.lead.create({
    data: {
      businessName: "Maple Ridge HVAC Co.",
      contactName: "Jordan Blake",
      email: `jordan.blake+mock-${stamp}@example.com`,
      phone: "416-555-0142",
      website: "https://mapleridgehvac.example.com",
      location: "Maple Ridge, BC",
      serviceArea: "Maple Ridge, Pitt Meadows, Coquitlam",
      industry: "HVAC",
      budgetRange: "$2,000–$4,000/mo",
      interestedIn: ["WEBSITE", "SEO_RETAINER"],
      problemSummary:
        "Invisible in local Google results for furnace repair; GBP incomplete; no service-area pages.",
      source: "mock-walkthrough",
      status: "WON",
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

  await prisma.lead.update({
    where: { id: lead.id },
    data: { status: "QUESTIONNAIRE_SENT" },
  });

  const questionnaireUrl = `${BASE}/portal/onboarding/${token}`;
  const adminLogin = `${BASE}/admin/login`;
  const leadsUrl = `${BASE}/leads`;

  console.log(JSON.stringify({
    ok: true,
    leadId: lead.id,
    sessionId: session.id,
    token,
    businessName: lead.businessName,
    contactName: lead.contactName,
    questionnaireUrl,
    adminLogin,
    leadsUrl,
    nextSteps: [
      "1. Open adminLogin and sign in as admin",
      "2. Open questionnaireUrl and submit the onboarding form (or we'll complete it via script)",
      "3. After submit, open /clients/[newId] and walk SEO tabs",
    ],
  }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
