import { NextResponse } from "next/server";
import { verifyOAuthState } from "@/lib/google/constants";
import { exchangeCodeForTokens } from "@/lib/google/oauth";
import { saveOAuthTokens } from "@/lib/actions/integrations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const stateToken = searchParams.get("state");
  const error = searchParams.get("error");

  const base = process.env.NEXTAUTH_URL ?? new URL(request.url).origin;

  if (error || !code || !stateToken) {
    return NextResponse.redirect(
      new URL(`/client/integrations?error=oauth_denied`, base)
    );
  }

  const state = verifyOAuthState(stateToken);
  if (!state) {
    return NextResponse.redirect(
      new URL(`/client/integrations?error=invalid_state`, base)
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    await saveOAuthTokens({
      clientId: state.clientId,
      service: state.service,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
    });

    const selectPath = state.returnPath.includes("/clients/")
      ? `${state.returnPath.replace(/\/$/, "")}/select`
      : "/client/integrations/select";

    const selectUrl = new URL(selectPath, base);
    selectUrl.searchParams.set("service", state.service);
    selectUrl.searchParams.set("clientId", state.clientId);

    return NextResponse.redirect(selectUrl);
  } catch {
    return NextResponse.redirect(
      new URL(`${state.returnPath}?error=oauth_failed`, base)
    );
  }
}
