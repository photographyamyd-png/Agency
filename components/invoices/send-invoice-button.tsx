"use client";

import { useState, useTransition } from "react";
import { sendInvoiceViaStripe } from "@/lib/actions/invoices";

export function SendInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await sendInvoiceViaStripe(invoiceId);
            if (result?.error) setMessage(result.error);
            else if (result?.url) setMessage("Payment link sent!");
          })
        }
        className="inline-flex h-9 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send via Stripe"}
      </button>
      {message && <span className="text-sm text-muted">{message}</span>}
    </div>
  );
}
