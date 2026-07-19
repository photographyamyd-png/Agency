/**
 * Re-hydrate a client from their completed onboarding session responses.
 * Usage: npx tsx scripts/rehydrate-client.ts <clientId>
 */
import { PrismaClient } from "@prisma/client";
import { hydrateClientFromOnboardingAnswers } from "../lib/onboarding/hydrate-from-answers";

const prisma = new PrismaClient();

async function main() {
  const clientId = process.argv[2];
  if (!clientId) throw new Error("Usage: npx tsx scripts/rehydrate-client.ts <clientId>");

  const session = await prisma.onboardingSession.findFirst({
    where: { clientId, status: "COMPLETED" },
    orderBy: { completedAt: "desc" },
  });

  if (!session?.responses) {
    throw new Error("No completed onboarding responses found for this client");
  }

  await hydrateClientFromOnboardingAnswers(
    clientId,
    session.responses as Record<string, unknown>
  );

  const profile = await prisma.brandProfile.findUnique({ where: { clientId } });
  const keywords = await prisma.keyword.count({ where: { clientId } });
  const competitors = await prisma.competitor.count({ where: { clientId } });
  const citations = await prisma.citationRecord.count({ where: { clientId } });

  console.log(
    JSON.stringify(
      {
        ok: true,
        clientId,
        primaryKeyword: profile?.primaryKeyword,
        industry: profile?.industry,
        intelKeys: Object.keys((profile?.businessIntelJson as object) ?? {}),
        keywords,
        competitors,
        citations,
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
