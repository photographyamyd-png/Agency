"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function AdminLoginInner({
  businessName,
  logoUrl,
  heroImageUrl,
  adminEmailConfigured: _adminEmailConfigured,
  googleConfigured,
  devLoginEnabled,
  adminEmailHint,
}: {
  businessName: string;
  logoUrl?: string | null;
  heroImageUrl?: string | null;
  adminEmailConfigured: boolean;
  googleConfigured: boolean;
  devLoginEnabled: boolean;
  adminEmailHint?: string;
}) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [pending, setPending] = useState(false);
  const [devError, setDevError] = useState<string | null>(null);

  async function handleDevLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setDevError(null);
    const form = new FormData(e.currentTarget);
    const result = await signIn("admin-credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      callbackUrl,
      redirect: false,
    });
    setPending(false);
    if (result?.error) {
      setDevError("Invalid email or password.");
      return;
    }
    if (result?.url) {
      window.location.href = result.url;
    }
  }

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
              A
            </span>
          )}
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted">
          Manage clients, leads, and your agency
        </p>
      </div>

      {error && googleConfigured && (
        <div className="rounded-md border border-danger/30 bg-danger-muted px-4 py-3 text-sm text-danger space-y-1">
          <p>Access denied. The Google account you used is not authorized.</p>
          {adminEmailHint && (
            <p className="text-xs opacity-90">
              Sign in with the Google account matching ADMIN_EMAIL ({adminEmailHint}).
            </p>
          )}
        </div>
      )}

      {devLoginEnabled ? (
        <>
          <div className="rounded-md border border-border-bright bg-surface-raised px-4 py-3 text-sm text-muted">
            <p className="font-medium text-foreground">Local dev login</p>
            <p className="mt-1 text-xs">
              Google OAuth isn&apos;t set up yet. Use your admin email and{" "}
              <code className="text-accent-bright">DEV_ADMIN_PASSWORD</code> from .env.
            </p>
          </div>
          <form onSubmit={handleDevLogin} className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="Admin email"
              defaultValue="photographyamyd@gmail.com"
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Dev password"
              required
            />
            {devError && <p className="text-sm text-danger">{devError}</p>}
            <Button type="submit" variant="glow" className="w-full" disabled={pending}>
              {pending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </>
      ) : (
        <>
          {!googleConfigured && (
            <div className="rounded-md border border-warning/30 bg-warning-muted px-4 py-3 text-sm text-warning">
              Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and DEV_ADMIN_PASSWORD to .env
              for login options.
            </div>
          )}
          <button
            type="button"
            onClick={() => signIn("google-admin", { callbackUrl })}
            disabled={!googleConfigured}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-accent text-sm font-medium text-accent-foreground shadow-accent-glow transition-colors hover:bg-accent-bright disabled:opacity-50"
          >
            Continue with Google
          </button>
        </>
      )}

      {googleConfigured && devLoginEnabled && (
        <p className="text-center text-xs text-muted">
          Or use Google above once configured
        </p>
      )}

      <p className="text-center text-xs text-muted">
        <Link href="/" className="text-accent-bright hover:underline">
          ← Back to website
        </Link>
      </p>
    </AuthLayout>
  );
}

export function AdminLoginForm(props: {
  businessName: string;
  logoUrl?: string | null;
  heroImageUrl?: string | null;
  adminEmailConfigured: boolean;
  googleConfigured: boolean;
  devLoginEnabled: boolean;
  adminEmailHint?: string;
}) {
  return (
    <Suspense>
      <AdminLoginInner {...props} />
    </Suspense>
  );
}
