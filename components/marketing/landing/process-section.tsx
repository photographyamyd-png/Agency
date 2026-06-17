import { ClipboardList, Hammer, Phone } from "lucide-react";
import { SectionShell } from "@/components/marketing/primitives/section-shell";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";

const STEPS = [
  {
    step: "01",
    icon: Phone,
    title: "Quick call & questionnaire",
    desc: "Tell me your trade, service area, and what bugs you about your current site. Fifteen minutes.",
    offset: "lg:mt-0",
  },
  {
    step: "02",
    icon: Hammer,
    title: "I build & launch",
    desc: "New site or SEO overhaul, Google Business Profile wired up, everything aimed at local search.",
    offset: "lg:mt-12",
  },
  {
    step: "03",
    icon: ClipboardList,
    title: "I keep you climbing",
    desc: "Weekly reports, rank tracking, monthly tune-ups. You stay on page one — I do the nerdy stuff.",
    offset: "lg:mt-6",
  },
];

export function ProcessSection() {
  return (
    <SectionShell id="process" tone="dark" overlap>
      <div className="mkt-container">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <Eyebrow label="How it works" />
            <h2 className="mkt-headline mt-4">Three steps. No runaround.</h2>
          </div>
          <p className="mkt-lead lg:text-right">
            You&apos;re on a jobsite, not a Zoom call. Simple process — always know
            what&apos;s next. (Spoiler: it&apos;s me.)
          </p>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div
            className="absolute left-[8%] right-[8%] top-16 hidden h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent md:block"
            aria-hidden
          />
          {STEPS.map(({ step, icon: Icon, title, desc, offset }) => (
            <article
              key={step}
              className={`mkt-glass mkt-glass-hover relative p-6 lg:p-8 ${offset}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-4xl font-bold tabular-nums text-accent-bright">
                  {step}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-muted text-accent-bright">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
              </div>
              <h3 className="mt-6 font-display text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
