"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

interface PageSpeedResult {
  lcp?: number;
  inp?: number;
  cls?: number;
  score?: number;
}

export async function runPageSpeedForClient(clientId: string, url: string) {
  await requireAdmin();

  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    return { error: "PAGESPEED_API_KEY not configured" };
  }

  const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  apiUrl.searchParams.set("url", url);
  apiUrl.searchParams.set("key", apiKey);
  apiUrl.searchParams.set("category", "performance");

  const res = await fetch(apiUrl.toString());
  if (!res.ok) {
    return { error: `PageSpeed API error: ${res.status}` };
  }

  const json = await res.json();
  const metrics = json?.lighthouseResult?.audits;
  const categories = json?.lighthouseResult?.categories;

  const result: PageSpeedResult = {
    score: categories?.performance?.score
      ? Math.round(categories.performance.score * 100)
      : undefined,
    lcp: metrics?.["largest-contentful-paint"]?.numericValue
      ? metrics["largest-contentful-paint"].numericValue / 1000
      : undefined,
    inp: metrics?.["interaction-to-next-paint"]?.numericValue,
    cls: metrics?.["cumulative-layout-shift"]?.numericValue,
  };

  await prisma.technicalHealthLog.create({
    data: {
      clientId,
      lcp: result.lcp,
      inp: result.inp,
      cls: result.cls,
      pagespeedScores: { [url]: result.score } as object,
    },
  });

  try {
    const { maybeAutoGenerateBaselineReport } = await import("@/lib/reports/generate");
    await maybeAutoGenerateBaselineReport(clientId);
  } catch {
    // non-fatal
  }

  revalidatePath(`/clients/${clientId}`);
  return { success: true, result };
}

export async function runPageSpeedAction(formData: FormData): Promise<void> {
  const clientId = formData.get("clientId") as string;
  const url = formData.get("url") as string;
  if (clientId && url) {
    await runPageSpeedForClient(clientId, url);
  }
}
