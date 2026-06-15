import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  GOOGLE_SCOPES,
  signOAuthState,
} from "@/lib/google/constants";
import { getAuthorizationUrl } from "@/lib/google/oauth";
import type { IntegrationService } from "@prisma/client";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/client/login", request.url));
  }

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");
  const service = searchParams.get("service") as IntegrationService | null;
  const returnPath =
    searchParams.get("returnPath") ??
    (session.user.role === "admin" && clientId
      ? `/clients/${clientId}/integrations`
      : "/client/integrations");

  if (!clientId || !service || !GOOGLE_SCOPES[service]) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  if (session.user.role === "client" && session.user.clientId !== clientId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (session.user.role !== "admin" && session.user.role !== "client") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const state = signOAuthState({ clientId, service, returnPath });
  const url = getAuthorizationUrl(GOOGLE_SCOPES[service], state);
  return NextResponse.redirect(url);
}
