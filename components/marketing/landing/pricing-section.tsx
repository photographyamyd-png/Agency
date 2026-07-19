import { Check } from "lucide-react";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";
import { SectionShell } from "@/components/marketing/primitives/section-shell";
import { AccentButton } from "@/components/marketing/primitives/accent-button";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const { pricing, ctaPrimary, ctaHint } = MARKETING_COPY;

  return (
    <SectionShell id="pricing" band="stone" className="py-24 lg:py-32">
      <div className="mkt-container">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow index="05" label={pricing.eyebrow} />
          <h2 className="mkt-headline mt-5">{pricing.headline}</h2>
          <p className="mkt-lead mx-auto mt-5">{pricing.note}</p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricing.tiers.map((tier) => {
            const featured = "featured" in tier && tier.featured;
            return (
              <article
                key={tier.name}
                className={cn(
                  "relative flex flex-col rounded-xl border bg-white p-7 shadow-sm",
                  featured
                    ? "border-[var(--mkt-orange)] shadow-lg ring-1 ring-[var(--mkt-orange)]"
                    : "border-[var(--mkt-border)]"
                )}
              >
                {featured && (
                  <span className="absolute -top-3 left-6 bg-[var(--mkt-orange)] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Most shops land here
                  </span>
                )}
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--mkt-muted)]">
                  {tier.qualifier}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-[var(--mkt-text)]">
                  {tier.name}
                </h3>
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold tabular-nums tracking-tight text-[var(--mkt-text)]">
                    {tier.price}
                  </span>
                  <span className="text-sm text-[var(--mkt-muted)]">{tier.period}</span>
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-2.5 text-sm leading-relaxed text-[var(--mkt-muted)]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--mkt-accent-soft)] text-[var(--mkt-accent)]">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs text-[var(--mkt-muted)]">{tier.valuedNote}</p>
                <div className="mt-6">
                  <AccentButton href={tier.ctaHref} className="w-full justify-center">
                    {ctaPrimary}
                  </AccentButton>
                  <p className="mt-2 text-center text-xs text-[var(--mkt-muted)]">{ctaHint}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
