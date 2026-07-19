import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateMonthlyMaintenanceChecklist } from "@/lib/blueprint/instantiate";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const periodMonth = now.getMonth() + 1;
  const periodYear = now.getFullYear();

  const clients = await prisma.client.findMany({
    where: { status: { in: ["ACTIVE_BUILD", "ACTIVE_RETAINER"] } },
    select: { id: true },
  });

  const results = [];
  for (const { id } of clients) {
    await generateMonthlyMaintenanceChecklist(id, periodMonth, periodYear);
    results.push(id);
  }

  return NextResponse.json({
    ok: true,
    month: periodMonth,
    year: periodYear,
    clientsProcessed: results.length,
  });
}
