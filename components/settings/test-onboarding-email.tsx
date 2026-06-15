"use client";

import { useActionState } from "react";
import { sendOnboardingTestEmail } from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";

export function TestOnboardingEmail({
  templateId,
  emailConfigured,
  fromEmail,
  toEmail,
}: {
  templateId: string;
  emailConfigured: boolean;
  fromEmail: string | null;
  toEmail: string | null;
}) {
  const [state, action, pending] = useActionState(sendOnboardingTestEmail, null);

  return (
    <section className="space-y-4 rounded-lg border border-border bg-surface p-5">
      <div>
        <h3 className="text-sm font-medium">Test onboarding email</h3>
        <p className="mt-1 text-xs text-muted">
          Sends the saved template to your admin inbox with sample data and a real
          questionnaire link you can open and submit.
        </p>
      </div>

      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">From</dt>
          <dd className="font-medium">{fromEmail ?? "Not set"}</dd>
        </div>
        <div>
          <dt className="text-muted">Test recipient</dt>
          <dd className="font-medium">{toEmail ?? "Not set"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted">Status</dt>
          <dd className={emailConfigured ? "text-accent-bright" : "text-amber-400"}>
            {emailConfigured ? "Gmail configured" : "Gmail app password missing"}
          </dd>
        </div>
      </dl>

      {!emailConfigured && (
        <p className="text-xs text-muted">
          In Google Account → Security → 2-Step Verification → App passwords,
          create a password for &quot;Mail&quot;, then add it as{" "}
          <code className="text-foreground">GMAIL_APP_PASSWORD</code> in{" "}
          <code className="text-foreground">.env</code> and restart{" "}
          <code className="text-foreground">npm run dev</code>.
        </p>
      )}

      <form action={action} className="space-y-3">
        <input type="hidden" name="templateId" value={templateId} />
        <Button type="submit" variant="outline" disabled={pending || !emailConfigured}>
          {pending ? "Sending…" : "Send test to my inbox"}
        </Button>
      </form>

      {state?.error && (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      )}
      {state?.success && (
        <div className="space-y-2 text-sm text-accent-bright" role="status">
          <p>{state.success}</p>
          {state.questionnaireUrl && (
            <p>
              Questionnaire link:{" "}
              <a
                href={state.questionnaireUrl}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Open test questionnaire
              </a>
            </p>
          )}
        </div>
      )}
    </section>
  );
}
