import { prisma } from "@/lib/prisma";
import { sendTemplatedEmail } from "@/lib/email/gmail";
import { emitSystemEvent } from "@/lib/events/emit";
import { SYSTEM_EVENT_TYPES } from "@/lib/events/types";
import { buildHighlightMessages } from "./highlights";

function periodDaysAgo(days: number) {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

export async function generateWeeklyReport(clientId: string) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: { brandProfile: true },
  });
  if (!client) return null;

  const { start, end } = periodDaysAgo(7);
  const existing = await prisma.weeklyReport.findFirst({
    where: {
      clientId,
      periodStart: { gte: start },
    },
  });
  if (existing) return existing;

  const highlights = await buildHighlightMessages(clientId);
  const latestMetrics = await prisma.metricSnapshot.findFirst({
    where: { clientId },
    orderBy: { capturedAt: "desc" },
  });

  const summary =
    highlights.length > 0
      ? highlights[0]
      : "Your weekly SEO report is ready — connect Google Analytics and Search Console for detailed insights.";

  const report = await prisma.weeklyReport.create({
    data: {
      clientId,
      periodStart: start,
      periodEnd: end,
      summary,
      highlights,
      dataJson: {
        sessions: latestMetrics?.sessions,
        users: latestMetrics?.users,
        pageviews: latestMetrics?.pageviews,
      },
    },
  });

  await emitSystemEvent({
    type: SYSTEM_EVENT_TYPES.REPORT_GENERATED,
    clientId,
    payload: { type: "weekly", reportId: report.id },
  });

  return report;
}

export async function generateMonthlyReport(clientId: string) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const existing = await prisma.monthlyReport.findFirst({
    where: { clientId, periodStart: start },
  });
  if (existing) return existing;

  const highlights = await buildHighlightMessages(clientId);
  const summary =
    highlights.length > 0
      ? highlights.slice(0, 3).join(" ")
      : "Monthly SEO summary — rankings and traffic data syncing.";

  const report = await prisma.monthlyReport.create({
    data: {
      clientId,
      periodStart: start,
      periodEnd: end,
      summary,
      dataJson: { highlights },
    },
  });

  await emitSystemEvent({
    type: SYSTEM_EVENT_TYPES.REPORT_GENERATED,
    clientId,
    payload: { type: "monthly", reportId: report.id },
  });

  return report;
}

export async function sendReportEmail(input: {
  clientId: string;
  type: "weekly" | "monthly";
  reportId: string;
}) {
  const client = await prisma.client.findUnique({
    where: { id: input.clientId },
    include: { portalUser: true },
  });
  if (!client) return;

  const email = client.billingEmail ?? client.portalUser?.email;
  if (!email) return;

  const report =
    input.type === "weekly"
      ? await prisma.weeklyReport.findUnique({ where: { id: input.reportId } })
      : await prisma.monthlyReport.findUnique({ where: { id: input.reportId } });

  if (!report) return;

  const highlights =
    input.type === "weekly"
      ? ((report as { highlights?: string[] | null }).highlights ?? [])
      : ((report.dataJson as { highlights?: string[] })?.highlights ?? []);

  const summaryText = report.summary ?? "";

  const highlightHtml = highlights.length
    ? highlights.map((h) => `• ${h}`).join("\n")
    : summaryText || "Check your client portal for details.";

  const portalUrl = `${process.env.NEXTAUTH_URL ?? ""}/client/reports`;

  await sendTemplatedEmail({
    to: email,
    subject: `{{businessName}} — Your ${input.type} SEO update`,
    bodyTemplate: `Hi,

Here's your ${input.type} SEO progress update for {{businessName}}:

{{highlights}}

View full details in your client portal: {{portalUrl}}

— Your web agency`,
    vars: {
      businessName: client.legalBusinessName,
      highlights: highlightHtml,
      portalUrl,
    },
    clientId: input.clientId,
  });

  if (input.type === "weekly") {
    await prisma.weeklyReport.update({
      where: { id: input.reportId },
      data: { sentAt: new Date() },
    });
  } else {
    await prisma.monthlyReport.update({
      where: { id: input.reportId },
      data: { sentAt: new Date() },
    });
  }
}

const ACTIVE_STATUSES = ["ACTIVE_BUILD", "ACTIVE_RETAINER"] as const;

export async function runWeeklyReportsForAllClients() {
  const clients = await prisma.client.findMany({
    where: {
      status: { in: [...ACTIVE_STATUSES] },
      integrations: { some: { status: "CONNECTED" } },
    },
    select: { id: true },
  });

  const results = [];
  for (const { id } of clients) {
    const report = await generateWeeklyReport(id);
    if (report) {
      await sendReportEmail({ clientId: id, type: "weekly", reportId: report.id });
      results.push(id);
    }
  }
  return results;
}

export async function runMonthlyReportsForAllClients() {
  const clients = await prisma.client.findMany({
    where: {
      status: { in: [...ACTIVE_STATUSES] },
      integrations: { some: { status: "CONNECTED" } },
    },
    select: { id: true },
  });

  const results = [];
  for (const { id } of clients) {
    const report = await generateMonthlyReport(id);
    if (report) {
      await sendReportEmail({ clientId: id, type: "monthly", reportId: report.id });
      results.push(id);
    }
  }
  return results;
}
