import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAgencyProfile } from "@/lib/agency/profile";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import {
  TokenPortalLayout,
  TokenPortalState,
} from "@/components/layout/token-portal-layout";
import { PRICING_PACKAGES } from "@/lib/blueprint/pricing-packages";
import { isEncryptionConfigured } from "@/lib/crypto/encryption";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function PortalOnboardingPage({ params }: PageProps) {
  const { token } = await params;
  const agency = await getAgencyProfile();

  const session = await prisma.onboardingSession.findUnique({
    where: { token },
    include: {
      template: true,
      lead: true,
      proposal: { include: { lineItems: true } },
      client: {
        include: {
          accessItems: { orderBy: { label: "asc" } },
        },
      },
    },
  });

  if (!session || !session.lead) {
    notFound();
  }

  if (session.tokenExpiresAt < new Date()) {
    return (
      <TokenPortalState
        businessName={agency.businessName}
        logoUrl={agency.logoUrl}
        heroImageUrl={agency.heroImageUrl}
        email={agency.email}
        title="Link expired"
        message="This onboarding link has expired. Please contact us for a new one."
      />
    );
  }

  if (session.status === "COMPLETED" || session.currentStage === "COMPLETED") {
    return (
      <TokenPortalState
        businessName={agency.businessName}
        logoUrl={agency.logoUrl}
        heroImageUrl={agency.heroImageUrl}
        email={agency.email}
        title="Onboarding complete"
        message="Thank you — we've received your profile, agreement, and access details. We'll be in touch soon."
      />
    );
  }

  const questionnaire = session.template.questionnaire as {
    fields?: Array<{
      id: string;
      type: string;
      label: string;
      required?: boolean;
      options?: { value: string; label: string }[];
      placeholder?: string;
    }>;
  };

  const fields = questionnaire.fields ?? [];
  const selectedPackages = Array.isArray(session.selectedPackages)
    ? (session.selectedPackages as string[])
    : [];

  return (
    <TokenPortalLayout
      businessName={agency.businessName}
      logoUrl={agency.logoUrl}
      heroImageUrl={agency.heroImageUrl}
      email={agency.email}
      title={`Welcome, ${session.lead.contactName}`}
      subtitle={`Complete onboarding for ${session.lead.businessName}: profile, packages, agreement, and access.`}
    >
      <OnboardingWizard
        token={token}
        contactName={session.lead.contactName}
        businessName={session.lead.businessName}
        initialStage={session.currentStage}
        fields={fields}
        packages={PRICING_PACKAGES.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          priceMin: p.priceMin,
          priceMax: p.priceMax,
          unit: p.unit,
          scopeIncluded: p.scopeIncluded,
        }))}
        proposal={
          session.proposal
            ? {
                id: session.proposal.id,
                status: session.proposal.status,
                scopeIncluded: session.proposal.scopeIncluded,
                lineItems: session.proposal.lineItems.map((li) => ({
                  id: li.id,
                  description: li.description,
                  total: Number(li.total),
                })),
                retainerTerms: session.proposal.retainerTerms,
              }
            : null
        }
        agreementTerms={agency.standardAgreementTerms ?? null}
        agencyEmail={agency.email ?? null}
        accessItems={
          session.client?.accessItems.map((a) => ({
            id: a.id,
            label: a.label,
            systemType: a.systemType,
            status: a.status,
          })) ?? []
        }
        encryptionReady={isEncryptionConfigured()}
        initialResponses={(session.responses as Record<string, unknown>) ?? {}}
        initialSelectedPackages={selectedPackages}
      />
    </TokenPortalLayout>
  );
}
