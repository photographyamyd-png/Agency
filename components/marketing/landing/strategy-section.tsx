import { Eyebrow } from "@/components/marketing/primitives/eyebrow";
import { SectionShell } from "@/components/marketing/primitives/section-shell";
import { QualifyLeadForm } from "@/components/marketing/landing/qualify-lead-form";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";

export function StrategySection() {
  const { strategy } = MARKETING_COPY;

  return (
    <SectionShell id="strategy" band="paper" className="py-24 lg:py-32">
      <div className="mkt-container">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow index="01" label={strategy.eyebrow} />
            <h2 className="mkt-headline mt-5">{strategy.headline}</h2>
            <p className="mkt-lead mt-5">{strategy.body}</p>
            <ul className="mt-8 space-y-3 text-sm text-[var(--mkt-muted)]">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mkt-accent)]" />
                Local search that surfaces when something breaks
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mkt-accent)]" />
                Sites built for phone calls, not portfolio awards
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mkt-accent)]" />
                Straight talk on fit — before you spend a dime
              </li>
            </ul>
          </div>
          <div className="lg:col-span-7">
            <QualifyLeadForm />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
