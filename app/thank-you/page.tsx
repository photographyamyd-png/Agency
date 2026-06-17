import { Check } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { getAgencyProfile } from "@/lib/agency/profile";
import { SectionShell } from "@/components/marketing/primitives/section-shell";
import { AccentButton } from "@/components/marketing/primitives/accent-button";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ onboard?: string }>;
}) {
  const agency = await getAgencyProfile();
  const params = await searchParams;
  const onboardingSent = params.onboard === "1";

  return (
    <MarketingLayout
      businessName={agency.businessName}
      logoUrl={agency.logoUrl}
      email={agency.email}
      phone={agency.phone}
    >
      <SectionShell band="stone" className="flex min-h-[60vh] items-center">
        <div className="mkt-container flex justify-center">
          <div className="mkt-float-card max-w-lg p-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--mkt-accent)] text-white">
              <Check className="h-8 w-8" strokeWidth={2.5} />
            </div>
            <h1 className="mkt-headline">Thank you!</h1>
            <p className="mkt-lead mx-auto mt-4">
              {onboardingSent
                ? "We got your request and sent a welcome email with a short questionnaire. Check your inbox — we'll review it and call you back within one business day."
                : "We got your request. Expect to hear from us within one business day with next steps."}
            </p>
            <div className="mt-10 flex justify-center">
              <AccentButton href="/">Back to home</AccentButton>
            </div>
          </div>
        </div>
      </SectionShell>
    </MarketingLayout>
  );
}
