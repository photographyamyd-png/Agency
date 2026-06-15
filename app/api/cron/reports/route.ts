import { NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/google/constants";
import {
  runWeeklyReportsForAllClients,
  runMonthlyReportsForAllClients,
} from "@/lib/reports/generate";

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "auto";
  const now = new Date();
  const isMonday = now.getDay() === 1;
  const isFirstOfMonth = now.getDate() === 1;

  const results: Record<string, string[]> = {};

  if (type === "weekly" || (type === "auto" && isMonday)) {
    results.weekly = await runWeeklyReportsForAllClients();
  }

  if (type === "monthly" || (type === "auto" && isFirstOfMonth)) {
    results.monthly = await runMonthlyReportsForAllClients();
  }

  return NextResponse.json({ ok: true, ...results });
}
