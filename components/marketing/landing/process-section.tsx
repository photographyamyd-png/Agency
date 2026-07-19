import { ClipboardList, Hammer, Phone } from "lucide-react";
import { SectionShell } from "@/components/marketing/primitives/section-shell";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";
import { IconFeature } from "@/components/marketing/primitives/icon-feature";
import { DiagonalAccent } from "@/components/marketing/primitives/diagonal-accent";

const STEPS = [
  {
    step: "01",
    icon: Phone,
    title: "Free intro call",
    desc: "Tell me your trade, service area, and what's costing you jobs online. Twenty minutes — you talk to Amy.",
  },
  {
    step: "02",
    icon: Hammer,
    title: "I build & launch",
    desc: "New site or SEO overhaul, Google Business Profile wired up, everything aimed at Maps and local search.",
  },
  {
    step: "03",
    icon: ClipboardList,
    title: "I keep you climbing",
    desc: "Weekly reports, rank tracking, monthly tune-ups. You stay visible where the jobs search — I do the nerdy stuff.",
  },
];

export function ProcessSection() {
  return (
    <SectionShell id="process" band="paper">
      <DiagonalAccent />
      <div className="mkt-container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow index="04" label="Process" />
          <h2 className="mkt-headline mt-5">Three steps. No runaround.</h2>
          <p className="mkt-lead mx-auto mt-5">
            You&apos;re on a jobsite, not a Zoom call. Simple process — always know
            what&apos;s next. When you call, you get Amy.
          </p>
        </div>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3">
          {STEPS.map(({ step, icon, title, desc }) => (
            <article key={step} className="relative">
              <span
                className="pointer-events-none absolute -left-1 -top-6 font-display text-7xl font-bold tabular-nums leading-none text-[var(--mkt-stone)] select-none sm:text-8xl"
                aria-hidden
                style={{ color: "rgba(12, 14, 18, 0.06)" }}
              >
                {step}
              </span>
              <div className="relative">
                <IconFeature icon={icon} title={title} description={desc} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
