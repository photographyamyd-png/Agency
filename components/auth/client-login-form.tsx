"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  heroImageUrl,
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
    <AuthLayout heroImageUrl={heroImageUrl}>
      <div className="text-center">
        <Link href="/" className="mx-auto mb-4 flex h-10 w-10 items-center justify-center">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={businessName}
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground shadow-accent-glow">
              {businessName.charAt(0).toUpperCase()}
            </span>
          )}
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">Client portal</h1>
        <p className="mt-1 text-sm text-muted">
          View reports, rankings, and project progress
        </p>
      </div>

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

      <p className="text-center text-xs text-muted">
        <Link href="/" className="text-accent-bright hover:underline">
          ← Back to website
        </Link>
      </p>
    </AuthLayout>
  );
}
