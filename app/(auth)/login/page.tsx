"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
            A
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Agency OS</h1>
          <p className="mt-1 text-sm text-muted">
            Sign in with your admin Google account
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-danger/30 bg-danger-muted px-4 py-3 text-sm text-danger">
            Access denied. Only the authorized admin email can sign in.
          </div>
        )}

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-accent text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Continue with Google
        </button>

        <p className="text-center text-xs text-muted">
          Single-admin access only. Contact your agency owner if you need access.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
