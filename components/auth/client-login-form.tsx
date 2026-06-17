"use client";

import { useActionState, useState } from "react";
import {
  clientPasswordLogin,
  requestMagicLink,
} from "@/lib/actions/client-auth";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ClientLoginFormProps {
  businessName: string;
  logoUrl?: string | null;
  heroImageUrl?: string | null;
}

export function ClientLoginForm({
  businessName,
  logoUrl,
  heroImageUrl: _heroImageUrl,
}: ClientLoginFormProps) {
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [passwordState, passwordAction, passwordPending] = useActionState(
    clientPasswordLogin,
    null
  );
  const [magicState, magicAction, magicPending] = useActionState(
    requestMagicLink,
    null
  );

  return (
    <AuthLayout
      businessName={businessName}
      logoUrl={logoUrl}
      tagline="View reports, rankings, and project progress."
      title="Client portal"
    >
      <div className="flex rounded-lg border border-border-bright p-1">
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
            mode === "password"
              ? "bg-accent-muted text-accent-bright"
              : "text-muted hover:text-foreground"
          }`}
        >
          Email & password
        </button>
        <button
          type="button"
          onClick={() => setMode("magic")}
          className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
            mode === "magic"
              ? "bg-accent-muted text-accent-bright"
              : "text-muted hover:text-foreground"
          }`}
        >
          Magic link
        </button>
      </div>

      {mode === "password" ? (
        <form action={passwordAction} className="space-y-4">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required />
          {passwordState?.error && (
            <p className="text-sm text-danger">{passwordState.error}</p>
          )}
          <Button type="submit" variant="glow" className="w-full" disabled={passwordPending}>
            {passwordPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      ) : (
        <form action={magicAction} className="space-y-4">
          <Input name="email" type="email" placeholder="Email" required />
          {magicState?.error && (
            <p className="text-sm text-danger">{magicState.error}</p>
          )}
          {magicState?.sent && (
            <p className="text-sm text-success">
              If an account exists, we sent a login link to your email.
            </p>
          )}
          <Button type="submit" variant="glow" className="w-full" disabled={magicPending}>
            {magicPending ? "Sending..." : "Email me a login link"}
          </Button>
        </form>
      )}

    </AuthLayout>
  );
}
