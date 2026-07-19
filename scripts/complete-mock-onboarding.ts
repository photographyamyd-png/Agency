/**
 * Completes the mock onboarding questionnaire for a lead/session token.
 * Usage: npx tsx scripts/complete-mock-onboarding.ts <token>
 */
import { PrismaClient } from "@prisma/client";
import { processOnboardingSubmission } from "../lib/onboarding/process-submission";

const prisma = new PrismaClient();
const PORT = process.env.MOCK_PORT ?? "3003";
const BASE = `http://localhost:${PORT}`;

async function main() {
  const token = process.argv[2];
  if (!token) throw new Error("Usage: npx tsx scripts/complete-mock-onboarding.ts <token>");

  const session = await prisma.onboardingSession.findUnique({
    where: { token },
    include: {
      template: { include: { rules: { orderBy: { order: "asc" } } } },
      lead: true,
    },
  });

  if (!session?.leadId || !session.lead) throw new Error("Session not found");
  if (session.status === "COMPLETED") {
    const client = await prisma.client.findUnique({ where: { leadId: session.leadId } });
    console.log(JSON.stringify({ alreadyCompleted: true, clientId: client?.id, clientUrl: client ? `${BASE}/clients/${client.id}` : null }, null, 2));
    return;
  }

  const responses = {
    interestedIn: ["WEBSITE", "SEO_RETAINER"],
    industry: "HVAC",
    serviceArea: "Maple Ridge, Pitt Meadows, Coquitlam",
    budgetRange: "$2,000–$4,000/mo",
    timelineExpectation: "Launch SEO in 30 days; site refresh in 60",
    hasExistingGA4: "no",
    primaryKeyword: "furnace repair Maple Ridge",
    goals: "Rank in the local map pack for furnace repair and AC service; 15+ qualified calls/month from organic.",
    serviceLines: "Furnace repair 40%, AC install 30%, maintenance plans 20%, duct cleaning 10%",
    targetCities: "Maple Ridge (primary), Pitt Meadows, Coquitlam",
    avgJobValue: "$450 emergency / $8,500 install",
    closeRate: "35%",
    seasonality: "Furnace peak Oct–Feb; AC May–Aug; shoulder months for maintenance plans",
    serviceCapacity: "25–30 jobs/week",
    leadSources: "HomeStars, word of mouth, Facebook ads (paused), no SEO historically",
    reputation: "4.6 Google (38 reviews), thin HomeStars presence",
    knownCompetitors: "Coast Mountain Heating, Ridge Air Pros, Mr. Furnace Maple Ridge",
  };

  const client = await processOnboardingSubmission({
    sessionId: session.id,
    token,
    responses,
    template: session.template,
    leadId: session.leadId,
  });

  const launchCount = await prisma.launchChecklistItem.count({ where: { clientId: client.id } });

  console.log(JSON.stringify({
    ok: true,
    clientId: client.id,
    businessName: client.legalBusinessName,
    launchChecklistItems: launchCount,
    clientUrl: `${BASE}/clients/${client.id}`,
    adminLogin: `${BASE}/admin/login`,
    questionnaireWas: `${BASE}/portal/onboarding/${token}`,
    walkthrough: [
      `${BASE}/clients/${client.id}?tab=intake`,
      `${BASE}/clients/${client.id}?tab=research`,
      `${BASE}/clients/${client.id}?tab=keywords`,
      `${BASE}/clients/${client.id}?tab=sitemap`,
      `${BASE}/clients/${client.id}?tab=onpage`,
      `${BASE}/clients/${client.id}?tab=gbp`,
      `${BASE}/clients/${client.id}?tab=citations`,
      `${BASE}/clients/${client.id}?tab=reviews`,
      `${BASE}/clients/${client.id}?tab=links`,
      `${BASE}/clients/${client.id}?tab=reports`,
    ],
  }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
