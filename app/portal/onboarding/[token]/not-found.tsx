import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OnboardingNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md space-y-4 rounded-xl border border-border-bright bg-surface-raised p-8 text-center">
        <h1 className="text-xl font-semibold">Link not found</h1>
        <p className="text-sm text-muted">
          This onboarding link is invalid or incomplete. Email clients sometimes
          break long URLs across lines — try the purple button in the email, or
          request a new onboarding link.
        </p>
        <Button size="sm" variant="outline" asChild>
          <Link href="/">Back to website</Link>
        </Button>
      </div>
    </div>
  );
}
