import Link from "next/link";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { getAgencyProfile } from "@/lib/agency/profile";
import { Button } from "@/components/ui/button";

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
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent-muted text-2xl">
          ✓
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Thank you!</h1>
        <p className="mt-4 text-muted leading-relaxed">
          {onboardingSent
            ? "We've received your request and sent a welcome email with a short questionnaire. Check your inbox — we'll review your answers and follow up within one business day."
            : "We've received your request and will follow up within one business day."}
        </p>
        <Button className="mt-8" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </MarketingLayout>
  );
}
