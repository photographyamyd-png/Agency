"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getErrorMessage, isDatabaseConfigError } from "@/lib/errors/message";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message = getErrorMessage(error);
  const isDatabaseConfig = isDatabaseConfigError(message);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="max-w-lg space-y-4 rounded-xl border border-border-bright bg-surface-raised p-8">
        <h1 className="text-xl font-semibold">Dashboard unavailable</h1>
        {isDatabaseConfig ? (
          <p className="text-sm text-muted leading-relaxed">
            The database is not configured yet. This project requires{" "}
            <strong className="text-foreground">PostgreSQL</strong> (Neon is
            recommended). Update <code className="text-foreground">DATABASE_URL</code>{" "}
            and <code className="text-foreground">DIRECT_URL</code> in your{" "}
            <code className="text-foreground">.env</code> file, then run{" "}
            <code className="text-foreground">npm run db:migrate</code> and{" "}
            <code className="text-foreground">npm run db:seed</code>.
          </p>
        ) : (
          <p className="text-sm text-muted leading-relaxed">
            Something went wrong while loading dashboard data.
          </p>
        )}
        {message && message !== "[object Event]" && (
          <pre className="overflow-x-auto rounded-md bg-background p-3 text-xs text-muted whitespace-pre-wrap break-words">
            {message}
          </pre>
        )}
        <div className="flex flex-wrap gap-2">
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
