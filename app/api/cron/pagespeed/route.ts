import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runPageSpeedForClient } from "@/lib/actions/pagespeed";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clients = await prisma.client.findMany({
    where: { status: { in: ["ACTIVE_BUILD", "ACTIVE_RETAINER"] } },
    include: { brandProfile: true },
  });

  const results: { clientId: string; ok: boolean; error?: string }[] = [];

  for (const client of clients) {
    const url =
      client.brandProfile?.existingSiteUrl ??
      (client.brandProfile?.domain ? `https://${client.brandProfile.domain}` : null);

    if (!url) {
      results.push({ clientId: client.id, ok: false, error: "No URL" });
      continue;
    }

    const result = await runPageSpeedForClient(client.id, url);
    results.push({
      clientId: client.id,
      ok: !result.error,
      error: result.error,
    });
  }

  return NextResponse.json({ ok: true, results });
}
