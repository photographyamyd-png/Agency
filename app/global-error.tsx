"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getErrorMessage, isDatabaseConfigError } from "@/lib/errors/message";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message = getErrorMessage(error);
  const isDatabaseConfig = isDatabaseConfigError(message);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background p-6 font-sans text-foreground">
        <div className="mx-auto flex min-h-screen max-w-lg items-center">
          <div className="w-full space-y-4 rounded-xl border border-border bg-surface p-8">
            <h1 className="text-xl font-semibold">Runtime error</h1>
            {isDatabaseConfig ? (
              <p className="text-sm text-muted leading-relaxed">
                The database is not configured yet. Update{" "}
                <code className="text-foreground">DATABASE_URL</code> and{" "}
                <code className="text-foreground">DIRECT_URL</code> in your{" "}
                <code className="text-foreground">.env</code> file with Neon
                PostgreSQL URLs, then run{" "}
                <code className="text-foreground">npm run db:migrate</code>.
              </p>
            ) : (
              <p className="text-sm text-muted leading-relaxed">
                {message === "[object Event]"
                  ? "The app hit a network or hot-reload error. Refresh the page. If it keeps happening, restart the dev server and check the terminal."
                  : "Something went wrong while rendering this page."}
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
      </body>
    </html>
  );
}
