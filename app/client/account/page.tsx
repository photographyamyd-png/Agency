"use client";

import { useActionState } from "react";
import { changeClientPassword, requestMagicLink } from "@/lib/actions/client-auth";
import { SectionTitle } from "@/components/ui/section-band";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ClientAccountPage() {
  const [passwordState, passwordAction, passwordPending] = useActionState(
    changeClientPassword,
    null
  );
  const [magicState, magicAction, magicPending] = useActionState(
    requestMagicLink,
    null
  );

  return (
    <div className="space-y-10">
      <SectionTitle subtitle="Manage your portal login credentials.">
        Account settings
      </SectionTitle>

      <section className="rounded-xl border border-border-bright bg-surface-raised p-6 shadow-lg shadow-black/20">
        <h2 className="text-sm font-semibold">Change password</h2>
        <form action={passwordAction} className="mt-4 max-w-sm space-y-4">
          <Input
            name="currentPassword"
            type="password"
            placeholder="Current password"
            required
          />
          <Input
            name="newPassword"
            type="password"
            placeholder="New password (min 8 characters)"
            required
            minLength={8}
          />
          {passwordState?.error && (
            <p className="text-sm text-danger">{passwordState.error}</p>
          )}
          {passwordState?.success && (
            <p className="text-sm text-success">Password updated successfully.</p>
          )}
          <Button type="submit" variant="glow" disabled={passwordPending}>
            {passwordPending ? "Saving..." : "Update password"}
          </Button>
        </form>
      </section>

      <section className="rounded-xl border border-border-bright bg-surface-raised p-6 shadow-lg shadow-black/20">
        <h2 className="text-sm font-semibold">Magic link login</h2>
        <p className="mt-1 text-sm text-muted">
          Prefer passwordless? We&apos;ll email you a one-time sign-in link.
        </p>
        <form action={magicAction} className="mt-4 max-w-sm space-y-4">
          <Input name="email" type="email" placeholder="Your account email" required />
          {magicState?.error && (
            <p className="text-sm text-danger">{magicState.error}</p>
          )}
          {magicState?.sent && (
            <p className="text-sm text-success">
              If an account exists, we sent a login link to your email.
            </p>
          )}
          <Button type="submit" variant="outline" disabled={magicPending}>
            {magicPending ? "Sending..." : "Send magic link"}
          </Button>
        </form>
      </section>
    </div>
  );
}
