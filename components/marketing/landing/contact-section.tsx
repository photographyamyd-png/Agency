import { Check } from "lucide-react";
import { LeadCaptureForm } from "@/components/marketing/lead-capture-form";
import { SectionShell } from "@/components/marketing/primitives/section-shell";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";

const TRUST_POINTS = [
  "Free quote — no obligation, no pressure",
  "We specialize in trades & local service businesses",
  "Straight answers on pricing and timeline upfront",
  "Weekly reports — rankings and traffic in plain English",
];

export function ContactSection() {
  return (
    <SectionShell id="contact" band="stone">
      <div className="mkt-container">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="mkt-card bg-white p-8 lg:p-10">
            <LeadCaptureForm variant="panel" />
          </div>

          <div className="mkt-content flex flex-col justify-center">
            <Eyebrow label="Get started" />
            <h2 className="mkt-headline mt-4">Ready for more calls from Google?</h2>
            <p className="mkt-lead mt-4">
              Fill out the form. We&apos;ll review your market, send a short questionnaire,
              and put together a plan to get your trade business in front of more local
              customers.
            </p>

            <ul className="mt-8 space-y-3">
              {TRUST_POINTS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--mkt-accent)] text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm text-[var(--mkt-muted)]">
              We respond within 1 business day — usually sooner.
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
