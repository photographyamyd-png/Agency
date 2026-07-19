import { MARKETING_COPY } from "@/lib/agency/marketing-copy";
import { SectionShell } from "@/components/marketing/primitives/section-shell";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";
import { PopSurface } from "@/components/marketing/primitives/pop-surface";

function WeakSiteMock() {
  return (
    <div className="min-h-[15rem] bg-[#fafafa] p-5 text-[#52525b] saturate-[0.35] contrast-[0.92]">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <span className="text-xs font-semibold text-zinc-600">Joe&apos;s Plumbing</span>
        <span className="text-[10px] text-zinc-400">Home · About · Contact</span>
      </div>
      <p className="mt-6 text-center text-lg font-semibold text-zinc-500">Welcome to our website</p>
      <p className="mx-auto mt-2 max-w-[14rem] text-center text-[11px] leading-relaxed text-zinc-400">
        Family owned since 1987. We do all kinds of plumbing work. Call for a quote.
      </p>
      <div className="mx-auto mt-6 h-16 max-w-[12rem] rounded bg-zinc-200" />
      <p className="mt-4 text-center text-[10px] text-zinc-400">Last updated 2014</p>
    </div>
  );
}

function StrongSiteMock() {
  return (
    <div className="min-h-[15rem] bg-[var(--mkt-ink)] p-5 text-white">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="font-display text-sm font-semibold">Smith &amp; Sons HVAC</span>
        <span className="bg-[var(--mkt-orange)] px-3 py-1 text-[10px] font-semibold text-white">
          Call now
        </span>
      </div>
      <p className="mt-5 font-display text-xl font-bold leading-tight">
        Emergency repair. Same-day service.
      </p>
      <p className="mt-2 text-xs text-white/60">Licensed · Insured · 4.9 on Google</p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="rounded border border-white/10 bg-white/5 p-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--mkt-accent-bright)]">
            Services
          </p>
          <p className="mt-1 text-xs text-white/80">Furnace · AC · Ductwork</p>
        </div>
        <div className="rounded border border-white/10 bg-white/5 p-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--mkt-accent-bright)]">
            Coverage
          </p>
          <p className="mt-1 text-xs text-white/80">Your town + 30 miles</p>
        </div>
      </div>
    </div>
  );
}

/** Optional section — kept for reuse; landing page uses services/results flow */
export function RealityCheckSection() {
  const { realityCheck } = MARKETING_COPY;

  return (
    <SectionShell id="reality" band="paper" className="py-20 lg:py-28">
      <div className="mkt-container">
        <div className="max-w-3xl">
          <Eyebrow label="Reality check" />
          <h2 className="mkt-headline mt-5 text-[var(--mkt-text)]">
            What homeowners see online vs. the work you actually do
          </h2>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <article className="overflow-hidden rounded-xl border border-[var(--mkt-border)] bg-white opacity-90 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[var(--mkt-border)] bg-[var(--mkt-stone)] px-3 py-2.5">
              <span className="h-2 w-2 rounded-full bg-zinc-300" />
              <span className="h-2 w-2 rounded-full bg-zinc-300" />
              <span className="h-2 w-2 rounded-full bg-zinc-300" />
              <span className="ml-2 truncate text-[10px] text-zinc-500">
                joes-plumbing-1987.weebly.com
              </span>
            </div>
            <div className="relative">
              <WeakSiteMock />
              <div className="absolute right-3 top-3">
                <span className="rounded bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700">
                  Outdated
                </span>
              </div>
            </div>
            <p className="border-t border-[var(--mkt-border)] px-4 py-4 text-sm text-[var(--mkt-muted)]">
              {realityCheck.leftCaption}
            </p>
          </article>

          <PopSurface lift accent="gold" className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-[var(--mkt-border)] bg-[var(--mkt-stone)] px-3 py-2.5">
              <span className="h-2 w-2 rounded-full bg-zinc-300" />
              <span className="h-2 w-2 rounded-full bg-zinc-300" />
              <span className="h-2 w-2 rounded-full bg-zinc-300" />
              <span className="ml-2 truncate text-[10px] text-zinc-500">smithandsonshvac.com</span>
            </div>
            <div className="relative">
              <StrongSiteMock />
              <div className="absolute right-3 top-3">
                <span className="bg-[var(--mkt-orange-muted)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--mkt-orange-deep)]">
                  Professional
                </span>
              </div>
            </div>
            <p className="border-t border-[var(--mkt-border)] px-4 py-4 text-sm font-medium text-[var(--mkt-text)]">
              {realityCheck.rightCaption}
            </p>
          </PopSurface>
        </div>

        <PopSurface accent="orange" className="mt-16 max-w-4xl p-10 lg:p-12">
          <p className="font-display text-xl font-semibold leading-snug text-[var(--mkt-text)] lg:text-2xl">
            {realityCheck.punchline}
          </p>
        </PopSurface>
      </div>
    </SectionShell>
  );
}
