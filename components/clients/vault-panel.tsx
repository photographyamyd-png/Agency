"use client";

import { useState } from "react";
import type { CredentialVaultEntry } from "@prisma/client";
import { createVaultEntry, revealVaultEntry, revokeVaultEntry } from "@/lib/actions/vault";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type VaultEntryPreview = Pick<
  CredentialVaultEntry,
  "id" | "label" | "url" | "lastAccessedAt"
>;

interface VaultPanelProps {
  clientId: string;
  entries: VaultEntryPreview[];
}

export function VaultPanel({ clientId, entries }: VaultPanelProps) {
  const [revealed, setRevealed] = useState<Record<string, {
    username: string | null;
    password: string | null;
    notes: string | null;
  }>>({});

  async function handleReveal(entryId: string) {
    const result = await revealVaultEntry(entryId);
    if ("error" in result && result.error) return;
    if ("username" in result) {
      setRevealed((prev) => ({
        ...prev,
        [entryId]: {
          username: result.username ?? null,
          password: result.password ?? null,
          notes: result.notes ?? null,
        },
      }));
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">Admin-only credential vault. All access is logged.</p>

      <form action={createVaultEntry} className="rounded-lg border border-border-bright bg-surface-raised p-4 space-y-3 max-w-lg">
        <input type="hidden" name="clientId" value={clientId} />
        <Input name="label" placeholder="Label (e.g. CMS Admin)" required />
        <Input name="url" placeholder="URL" />
        <Input name="username" placeholder="Username" />
        <Input name="password" type="password" placeholder="Password" />
        <Input name="notes" placeholder="Notes" />
        <Button type="submit" size="sm" variant="outline">Add credential</Button>
      </form>

      <ul className="space-y-3">
        {entries.map((entry) => (
          <li key={entry.id} className="rounded-lg border border-border-bright bg-surface-raised p-4 text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{entry.label}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleReveal(entry.id)}>
                  Reveal
                </Button>
                <form action={async () => { await revokeVaultEntry(entry.id); }}>
                  <Button type="submit" size="sm" variant="outline">Revoke</Button>
                </form>
              </div>
            </div>
            {entry.url && <p className="text-muted text-xs">{entry.url}</p>}
            {revealed[entry.id] && (
              <div className="mt-2 p-3 rounded bg-surface text-xs font-mono space-y-1">
                {revealed[entry.id].username && <p>User: {revealed[entry.id].username}</p>}
                {revealed[entry.id].password && <p>Pass: {revealed[entry.id].password}</p>}
                {revealed[entry.id].notes && <p>Notes: {revealed[entry.id].notes}</p>}
              </div>
            )}
          </li>
        ))}
        {entries.length === 0 && (
          <p className="text-sm text-muted">No credentials stored yet.</p>
        )}
      </ul>
    </div>
  );
}
