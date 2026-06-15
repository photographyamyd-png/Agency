import { redirect } from "next/navigation";
import { verifyMagicLinkToken } from "@/lib/actions/client-auth";

export default async function VerifyMagicLinkPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    redirect("/client/login?error=missing_token");
  }

  const result = await verifyMagicLinkToken(token);
  if (result?.error) {
    redirect(`/client/login?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/client/dashboard");
}
