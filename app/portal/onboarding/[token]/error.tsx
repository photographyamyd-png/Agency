"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md space-y-4 rounded-xl border border-border-bright bg-surface-raised p-8 text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="text-sm text-muted">
          We couldn&apos;t load your onboarding questionnaire. If you clicked a
          link from email, make sure the full link was used and that the dev
          server is running at{" "}
          <code className="text-foreground">http://localhost:3000</code>.
        </p>
        {error.message && (
          <p className="text-xs text-muted break-all">{error.message}</p>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          <Button size="sm" onClick={reset}>
            Try again
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href="/">Back to website</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
