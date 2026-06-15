import { NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/google/constants";
import { syncAllConnectedClients } from "@/lib/google/sync-client";

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await syncAllConnectedClients();
  return NextResponse.json({ ok: true, synced: summary.length, summary });
}
