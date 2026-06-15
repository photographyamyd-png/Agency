"use client";

import { useTransition } from "react";
import { forceSyncClient } from "@/lib/actions/integrations";
import { Button } from "@/components/ui/button";

export function SyncButton({ clientId }: { clientId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await forceSyncClient(clientId);
        })
      }
    >
      {pending ? "Syncing..." : "Sync now"}
    </Button>
  );
}
