import { prisma } from "@/lib/prisma";

export async function getClientWorkspaceData(clientId: string) {
  return prisma.client.findUnique({
    where: { id: clientId },
    include: {
      lead: { select: { id: true, businessName: true } },
      brandProfile: true,
      portalUser: { select: { email: true, lastLoginAt: true } },
      accessItems: { orderBy: { requestedAt: "asc" } },
      launchChecklist: { orderBy: { order: "asc" } },
      weeklyReports: { orderBy: { createdAt: "desc" }, take: 5 },
      monthlyReports: { orderBy: { createdAt: "desc" }, take: 3 },
      integrations: true,
      keywords: {
        include: {
          rankSnapshots: { orderBy: { capturedAt: "desc" }, take: 2 },
          pages: { select: { id: true, name: true, slug: true } },
        },
      },
      competitors: { orderBy: { createdAt: "asc" } },
      geoGridSnapshots: { orderBy: { capturedAt: "desc" } },
      pages: {
        include: {
          primaryKeyword: true,
          seoItems: true,
          schemaItems: true,
          children: { include: { primaryKeyword: true, seoItems: true } },
        },
        where: { parentId: null },
        orderBy: { order: "asc" },
      },
      citations: { orderBy: { directory: "asc" } },
      reviewSnapshots: { orderBy: { capturedAt: "desc" }, take: 12 },
      gbpActivity: { orderBy: { postedAt: "desc" }, take: 10 },
      localLinks: { orderBy: { createdAt: "desc" } },
      contentItems: {
        include: { targetKeyword: true },
        orderBy: { publishedAt: "desc" },
      },
      techHealthLogs: { orderBy: { capturedAt: "desc" }, take: 5 },
      baselineAudits: { orderBy: { capturedAt: "desc" }, take: 1 },
      maintenanceLogs: {
        include: { items: { orderBy: { order: "asc" } } },
        orderBy: { generatedAt: "desc" },
        take: 1,
      },
      actionPlanItems: { orderBy: { id: "desc" }, take: 10 },
      vaultEntries: {
        where: { revoked: false },
        select: { id: true, label: true, url: true, lastAccessedAt: true },
      },
      systemEvents: { orderBy: { createdAt: "desc" }, take: 10 },
      onboardingSessions: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          status: true,
          currentStage: true,
          completedStages: true,
          completedAt: true,
          selectedPackages: true,
          proposalId: true,
        },
      },
      proposals: {
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: {
          lineItems: true,
        },
      },
    },
  });
}

export type ClientWorkspaceData = NonNullable<
  Awaited<ReturnType<typeof getClientWorkspaceData>>
>;
