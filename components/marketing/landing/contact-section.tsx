import { AccentButton } from "@/components/marketing/primitives/accent-button";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";
import { LeadCaptureForm } from "@/components/marketing/lead-capture-form";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";
import { SectionShell } from "@/components/marketing/primitives/section-shell";

export function ContactSection() {
  const { finalCta } = MARKETING_COPY;

  return (
    <SectionShell id="contact" tone="dark" className="py-20 lg:py-28">
      <div className="mkt-container">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5 lg:pt-4">
            <Eyebrow label="Get started" />
            <h2 className="mkt-headline mt-4">{finalCta.headline}</h2>
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              {finalCta.body}
            </p>
            <div className="mt-10">
              <AccentButton href="#contact-form">{finalCta.button}</AccentButton>
            </div>
          </div>

          <div id="contact-form" className="lg:col-span-7">
            <div className="mkt-glass-strong overflow-hidden rounded-2xl p-1">
              <LeadCaptureForm variant="panel" />
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
