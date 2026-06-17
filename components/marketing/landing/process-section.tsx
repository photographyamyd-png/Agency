import { Hammer, Phone, Wrench } from "lucide-react";
import { SectionShell } from "@/components/marketing/primitives/section-shell";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";
import { IconFeature } from "@/components/marketing/primitives/icon-feature";

const STEPS = [
  {
    step: "01",
    icon: Phone,
    title: "Quick call & questionnaire",
    desc: "Tell us your trade, service area, and goals. Short form — about 15 minutes.",
  },
  {
    step: "02",
    icon: Hammer,
    title: "We build & launch",
    desc: "New site or SEO overhaul, Google Business Profile, everything wired for local search.",
  },
  {
    step: "03",
    icon: Wrench,
    title: "We keep you climbing",
    desc: "Weekly reports, rank tracking, and monthly tune-ups to stay on page one.",
  },
];

export function ProcessSection() {
  return (
    <SectionShell id="process" band="paper">
      <div className="mkt-container">
        <div className="mkt-content max-w-3xl">
          <Eyebrow label="How it works" />
          <h2 className="mkt-headline mt-4">Simple process. No runaround.</h2>
          <p className="mkt-lead mt-4">
            You&apos;re busy running jobs. Three steps, always know what&apos;s next.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ step, icon, title, desc }) => (
            <article key={step} className="mkt-card-stone p-6">
              <span className="font-display text-sm font-bold tabular-nums text-[var(--mkt-accent)]">
                {step}
              </span>
              <div className="mt-4">
                <IconFeature icon={icon} title={title} description={desc} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
