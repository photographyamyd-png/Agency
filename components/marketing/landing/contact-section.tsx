import { Check } from "lucide-react";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";
import { LeadCaptureForm } from "@/components/marketing/lead-capture-form";
import { GoogleSerpMock } from "@/components/marketing/primitives/google-serp-mock";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";
import { SectionShell } from "@/components/marketing/primitives/section-shell";

const TRUST = [
  "You talk to me — not an account manager",
  "Sites built for phone calls, not vanity metrics",
  "Weekly reports in plain English",
  "No fluff subscriptions you don't need",
];

export function ContactSection() {
  const { finalCta } = MARKETING_COPY;

  return (
    <SectionShell id="contact" band="stone" className="py-28 lg:py-36">
      <div className="mkt-container">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-0">
          <div className="relative lg:col-span-7">
            <div className="mkt-form-panel relative flex h-full gap-0 overflow-hidden">
              <div className="hidden shrink-0 items-center border-r border-white/10 px-3 py-10 lg:flex">
                <span className="mkt-vertical-label">Start a project</span>
              </div>
              <div id="contact-form" className="min-w-0 flex-1 p-8 lg:p-10">
                <Eyebrow label="Get started" light />
                <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {finalCta.headline}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
                  {finalCta.body}
                </p>
                <div className="mt-8">
                  <LeadCaptureForm variant="panel" />
                </div>
                <p className="mt-3 text-xs text-white/45">{MARKETING_COPY.ctaHint}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-[var(--mkt-stone)] px-2 py-6 lg:col-span-5 lg:pl-12 lg:pr-4">
            <div className="mb-8">
              <GoogleSerpMock
                compact
                query="contractor in your town"
                businessName="Your Trade Shop"
                rankBadge="Maps pack"
              />
            </div>
            <Eyebrow label="Why it works" />
            <ul className="mt-6 space-y-4">
              {TRUST.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-[var(--mkt-text)]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--mkt-accent)] text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
