import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAgencyProfile } from "@/lib/agency/profile";
import { OnboardingQuestionnaireForm } from "@/components/onboarding/questionnaire-form";
import {
  TokenPortalLayout,
  TokenPortalState,
} from "@/components/layout/token-portal-layout";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function PortalOnboardingPage({ params }: PageProps) {
  const { token } = await params;
  const agency = await getAgencyProfile();

  const session = await prisma.onboardingSession.findUnique({
    where: { token },
    include: { template: true, lead: true },
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

  if (session.status === "COMPLETED") {
    return (
      <TokenPortalState
        businessName={agency.businessName}
        logoUrl={agency.logoUrl}
        heroImageUrl={agency.heroImageUrl}
        email={agency.email}
        title="Already submitted"
        message="Thank you — we've already received your questionnaire."
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

  return (
    <TokenPortalLayout
      businessName={agency.businessName}
      logoUrl={agency.logoUrl}
      heroImageUrl={agency.heroImageUrl}
      email={agency.email}
      title={`Welcome, ${session.lead.contactName}`}
      subtitle={`Help us understand ${session.lead.businessName}'s needs so we can build your custom plan.`}
    >
      <OnboardingQuestionnaireForm
        token={token}
        fields={fields}
        contactName={session.lead.contactName}
      />
    </TokenPortalLayout>
  );
}
