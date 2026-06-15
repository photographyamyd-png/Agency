import { prisma } from "@/lib/prisma";
import { formatClientStatus } from "@/lib/format";

export async function getAgencyDashboardData() {
  const [
    clients,
    leads,
    invoices,
    payments,
    rankSnapshots,
    metricSnapshots,
    recentEvents,
  ] = await Promise.all([
    prisma.client.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        brandProfile: true,
        invoices: { where: { status: { in: ["SENT", "OVERDUE", "PARTIALLY_PAID"] } } },
        integrations: { where: { status: "CONNECTED" } },
        keywords: {
          include: {
            rankSnapshots: { orderBy: { capturedAt: "desc" }, take: 2 },
          },
        },
      },
    }),
    prisma.lead.count({ where: { status: { notIn: ["WON", "LOST"] } } }),
    prisma.invoice.findMany({
      where: { status: { in: ["SENT", "OVERDUE", "PARTIALLY_PAID"] } },
    }),
    prisma.payment.findMany({
      where: {
        paidAt: { gte: new Date(new Date().setDate(1)) },
      },
    }),
    prisma.rankSnapshot.findMany({
      orderBy: { capturedAt: "desc" },
      take: 100,
      include: { keyword: { include: { client: true } } },
    }),
    prisma.metricSnapshot.findMany({
      orderBy: { capturedAt: "desc" },
      take: 50,
    }),
    prisma.systemEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
      include: { client: { select: { legalBusinessName: true } } },
    }),
  ]);

  const monthlyRevenue = payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  const activeClients = clients.filter((c) =>
    ["ACTIVE_BUILD", "ACTIVE_RETAINER"].includes(c.status)
  ).length;

  const openInvoices = invoices.length;

  const clientRows = clients.map((c) => {
    let health: "good" | "warning" | "critical" = "good";
    if (c.status === "ONBOARDING" || c.status === "ARREARS") health = "critical";
    else if (c.status === "ACTIVE_BUILD" || c.status === "PAUSED") health = "warning";

    const retainerInvoice = c.invoices.find((i) => i.type === "RETAINER");
    const mrr = retainerInvoice ? Number(retainerInvoice.totalAmount) : 0;

    const rankWin = c.keywords.some((kw) => {
      const [cur, prev] = kw.rankSnapshots;
      return cur?.rank != null && prev?.rank != null && prev.rank > cur.rank;
    });
    if (rankWin && health === "good") health = "good";

    return {
      id: c.id,
      name: c.legalBusinessName,
      status: formatClientStatus(c.status),
      mrr,
      health,
      integrations: c.integrations.length,
    };
  });

  const revenueByMonth = buildMonthlyRevenueChart(payments);
  const rankImprovements = rankSnapshots
    .filter((s) => s.rank != null)
    .slice(0, 5)
    .map((s) => ({
      client: s.keyword.client.legalBusinessName,
      keyword: s.keyword.term,
      rank: s.rank,
    }));

  const activities = recentEvents.map((e) => ({
    id: e.id,
    time: e.createdAt.toISOString(),
    event: formatEventLabel(e.type, e.client?.legalBusinessName),
    type: eventTypeVariant(e.type),
  }));

  return {
    kpis: {
      monthlyRevenue,
      activeClients,
      openInvoices,
      openLeads: leads,
      connectedIntegrations: clients.reduce(
        (n, c) => n + c.integrations.length,
        0
      ),
    },
    clientRows,
    revenueByMonth,
    rankImprovements,
    activities,
    totalSessions: metricSnapshots.reduce((s, m) => s + (m.sessions ?? 0), 0),
  };
}

function buildMonthlyRevenueChart(
  payments: { amount: unknown; paidAt: Date }[]
) {
  const months: Record<string, number> = {};
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months[labels[d.getMonth()]] = 0;
  }
  for (const p of payments) {
    const label = labels[p.paidAt.getMonth()];
    if (label in months) months[label] += Number(p.amount);
  }
  return Object.entries(months).map(([month, revenue]) => ({ month, revenue }));
}

function formatEventLabel(type: string, clientName?: string | null) {
  const name = clientName ? ` — ${clientName}` : "";
  const map: Record<string, string> = {
    LEAD_CREATED: "New lead from website",
    ONBOARDING_COMPLETED: "Onboarding questionnaire completed",
    ONBOARDING_SENT: "Onboarding email sent",
    GA4_CONNECTED: "Google Analytics connected",
    GSC_CONNECTED: "Search Console connected",
    GBP_CONNECTED: "Google Business Profile connected",
    RANK_UPDATED: "Keyword rankings updated",
    METRICS_SYNCED: "Traffic metrics synced",
    REPORT_GENERATED: "Report generated and sent",
    PORTAL_LOGIN: "Client logged into portal",
  };
  return (map[type] ?? type.replace(/_/g, " ").toLowerCase()) + name;
}

function eventTypeVariant(type: string): "success" | "default" | "danger" {
  if (type.includes("OVERDUE") || type.includes("ERROR")) return "danger";
  if (
    type.includes("COMPLETED") ||
    type.includes("CONNECTED") ||
    type.includes("RANK") ||
    type.includes("REPORT")
  )
    return "success";
  return "default";
}

export async function getCrossClientMetrics() {
  const clients = await prisma.client.findMany({
    where: { status: { in: ["ACTIVE_BUILD", "ACTIVE_RETAINER"] } },
    include: {
      keywords: {
        include: {
          rankSnapshots: { orderBy: { capturedAt: "desc" }, take: 2 },
        },
      },
      metricSnapshots: { orderBy: { capturedAt: "desc" }, take: 1 },
      integrations: true,
      weeklyReports: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const rankWins: { client: string; keyword: string; from: number; to: number; delta: number }[] = [];

  for (const client of clients) {
    for (const kw of client.keywords) {
      const [cur, prev] = kw.rankSnapshots;
      if (cur?.rank != null && prev?.rank != null && prev.rank > cur.rank) {
        rankWins.push({
          client: client.legalBusinessName,
          keyword: kw.term,
          from: prev.rank,
          to: cur.rank,
          delta: prev.rank - cur.rank,
        });
      }
    }
  }

  rankWins.sort((a, b) => b.delta - a.delta);

  const trafficByClient = clients
    .filter((c) => c.metricSnapshots[0]?.sessions)
    .map((c) => ({
      name: c.legalBusinessName.slice(0, 12),
      sessions: c.metricSnapshots[0]?.sessions ?? 0,
    }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 8);

  const integrationCounts = {
    ga4: clients.filter((c) => c.integrations.some((i) => i.service === "GA4" && i.status === "CONNECTED")).length,
    gsc: clients.filter((c) => c.integrations.some((i) => i.service === "GOOGLE_SEARCH_CONSOLE" && i.status === "CONNECTED")).length,
    gbp: clients.filter((c) => c.integrations.some((i) => i.service === "GBP" && i.status === "CONNECTED")).length,
  };

  return { rankWins, trafficByClient, integrationCounts, clientCount: clients.length };
}
