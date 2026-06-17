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
      <SectionShell tone="light" className="flex min-h-[60vh] items-center">
        <div className="mkt-container flex justify-center">
          <div className="mkt-slab mkt-slab-light max-w-lg p-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
              <Check className="h-8 w-8" strokeWidth={2.5} />
            </div>
            <h1 className="mkt-headline">Thank you!</h1>
            <p className="mkt-lead mx-auto mt-4">
              {onboardingSent
                ? "I got your request and sent a welcome email with a short questionnaire. Check your inbox — I'll review it and call you back within one business day."
                : "I got your request. Expect to hear from me within one business day with next steps."}
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
