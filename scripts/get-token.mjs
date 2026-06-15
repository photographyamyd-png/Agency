import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const session = await prisma.onboardingSession.findFirst({
  orderBy: { sentAt: "desc" },
  include: { lead: true, template: true },
});

if (session) {
  console.log("token:", session.token);
  console.log("url:", `http://localhost:3000/portal/onboarding/${session.token}`);
  console.log("status:", session.status);
  console.log("questionnaire:", JSON.stringify(session.template.questionnaire).slice(0, 200));
}

await prisma.$disconnect();
