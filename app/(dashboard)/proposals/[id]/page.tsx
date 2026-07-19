import Link from "next/link";
import { notFound } from "next/navigation";
import { getProposal, sendProposalAction } from "@/lib/actions/proposals";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

interface ProposalPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProposalDetailPage({ params }: ProposalPageProps) {
  const { id } = await params;
  const proposal = await getProposal(id);
  if (!proposal) notFound();

  const signUrl = proposal.signToken
    ? `${process.env.NEXTAUTH_URL ?? ""}/portal/proposal/${proposal.signToken}`
    : null;

  const total = proposal.lineItems.reduce((s, i) => s + Number(i.total), 0);

  return (
    <DashboardShell
      title={`Proposal — ${proposal.client.legalBusinessName}`}
      description={`Version ${proposal.version}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/proposals">Back</Link>
          </Button>
          {proposal.status === "DRAFT" && (
            <form action={sendProposalAction}>
              <input type="hidden" name="id" value={proposal.id} />
              <Button type="submit" size="sm">Send for signature</Button>
            </form>
          )}
        </div>
      }
    >
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Badge variant={proposal.status === "SIGNED" ? "success" : "muted"}>
            {proposal.status}
          </Badge>
          {proposal.signedAt && (
            <span className="text-sm text-muted">
              Signed {new Date(proposal.signedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {proposal.scopeIncluded && (
          <div className="rounded-xl border border-border-bright bg-surface-raised p-6">
            <h3 className="text-sm font-medium mb-2">Scope included</h3>
            <p className="text-sm text-muted">{proposal.scopeIncluded}</p>
          </div>
        )}

        <div className="rounded-xl border border-border-bright bg-surface-raised p-6">
          <h3 className="text-sm font-medium mb-4">Line items</h3>
          <ul className="space-y-2 text-sm">
            {proposal.lineItems.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.description}</span>
                <span className="tabular-nums">{formatCurrency(Number(item.total))}</span>
              </li>
            ))}
            <li className="flex justify-between font-medium border-t border-border-bright pt-2 mt-2">
              <span>Total</span>
              <span className="tabular-nums">{formatCurrency(total)}</span>
            </li>
          </ul>
        </div>

        {signUrl && proposal.status === "SENT" && (
          <div className="rounded-xl border border-border-bright bg-surface-raised p-6">
            <h3 className="text-sm font-medium mb-2">Signing link</h3>
            <p className="text-sm text-accent-bright break-all">{signUrl}</p>
            <p className="text-xs text-muted mt-2">Share this link with the client to collect e-signature.</p>
          </div>
        )}

        {proposal.signatureDataUrl && (
          <div className="rounded-xl border border-border-bright bg-surface-raised p-6">
            <h3 className="text-sm font-medium mb-2">Signature</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={proposal.signatureDataUrl} alt="Client signature" className="max-h-24 border border-border rounded" />
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
