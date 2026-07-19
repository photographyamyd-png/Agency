import { notFound } from "next/navigation";
import { getProposalBySignToken } from "@/lib/actions/proposals";
import { getAgencyProfile } from "@/lib/agency/profile";
import { ProposalSignForm } from "@/components/proposals/proposal-sign-form";
import {
  TokenPortalLayout,
  TokenPortalState,
} from "@/components/layout/token-portal-layout";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function PortalProposalPage({ params }: PageProps) {
  const { token } = await params;
  const agency = await getAgencyProfile();
  const proposal = await getProposalBySignToken(token);

  if (!proposal) {
    notFound();
  }

  if (proposal.signTokenExpiresAt && proposal.signTokenExpiresAt < new Date()) {
    return (
      <TokenPortalState
        businessName={agency.businessName}
        logoUrl={agency.logoUrl}
        heroImageUrl={agency.heroImageUrl}
        email={agency.email}
        title="Link expired"
        message="This signing link has expired. Please contact us for a new one."
      />
    );
  }

  if (proposal.status === "SIGNED") {
    return (
      <TokenPortalState
        businessName={agency.businessName}
        logoUrl={agency.logoUrl}
        heroImageUrl={agency.heroImageUrl}
        email={agency.email}
        title="Already signed"
        message="This proposal has already been signed. Thank you!"
      />
    );
  }

  const total = proposal.lineItems.reduce((s, i) => s + Number(i.total), 0);

  return (
    <TokenPortalLayout
      businessName={agency.businessName}
      logoUrl={agency.logoUrl}
      heroImageUrl={agency.heroImageUrl}
      email={agency.email}
      title={`Proposal for ${proposal.client.legalBusinessName}`}
    >
      <div className="space-y-6 max-w-lg mx-auto">
        {proposal.scopeIncluded && (
          <p className="text-sm text-muted">{proposal.scopeIncluded}</p>
        )}
        <ul className="text-sm space-y-1">
          {proposal.lineItems.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.description}</span>
              <span>{formatCurrency(Number(item.total))}</span>
            </li>
          ))}
          <li className="flex justify-between font-medium border-t pt-2">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </li>
        </ul>
        <ProposalSignForm token={token} businessName={proposal.client.legalBusinessName} />
      </div>
    </TokenPortalLayout>
  );
}
