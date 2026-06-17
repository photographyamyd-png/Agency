import { MARKETING_COPY } from "@/lib/agency/marketing-copy";
import { SectionShell } from "@/components/marketing/primitives/section-shell";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";

function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="mkt-browser-chrome">
      <span className="mkt-browser-dot" />
      <span className="mkt-browser-dot" />
      <span className="mkt-browser-dot" />
      <span className="ml-2 truncate text-[10px] text-zinc-500">{url}</span>
    </div>
  );
}

function WeakSiteMock() {
  return (
    <div className="mkt-site-mock-weak">
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
    <div className="mkt-site-mock-strong">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <span className="font-display text-sm font-semibold">Smith &amp; Sons HVAC</span>
        <span className="rounded-md bg-indigo-600 px-3 py-1 text-[10px] font-semibold text-white">
          Call now
        </span>
      </div>
      <p className="mt-5 font-display text-xl font-bold leading-tight">
        Emergency repair. Same-day service.
      </p>
      <p className="mt-2 text-xs text-white/60">Licensed · Insured · 4.9 on Google</p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="rounded border border-white/10 bg-white/5 p-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
            Services
          </p>
          <p className="mt-1 text-xs text-white/80">Furnace · AC · Ductwork</p>
        </div>
        <div className="rounded border border-white/10 bg-white/5 p-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
            Coverage
          </p>
          <p className="mt-1 text-xs text-white/80">Your town + 30 miles</p>
        </div>
      </div>
    </div>
  );
}

export function RealityCheckSection() {
  const { realityCheck } = MARKETING_COPY;

  return (
    <SectionShell id="reality" tone="light" className="py-20 lg:py-28">
      <div className="mkt-container">
        <div className="max-w-3xl">
          <Eyebrow label="Reality check" />
          <h2 className="mkt-headline mt-4 text-[#0c0c12]">
            What homeowners see online vs. the work you actually do
          </h2>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <article className="mkt-browser-frame">
            <BrowserChrome url="joes-plumbing-1987.weebly.com" />
            <div className="relative">
              <WeakSiteMock />
              <div className="absolute right-3 top-3">
                <span className="mkt-compare-badge mkt-compare-badge-weak">Outdated</span>
              </div>
            </div>
            <p className="border-t border-zinc-200 px-4 py-3 text-sm text-zinc-600">
              {realityCheck.leftCaption}
            </p>
          </article>

          <article className="mkt-browser-frame">
            <BrowserChrome url="smithandsonshvac.com" />
            <div className="relative">
              <StrongSiteMock />
              <div className="absolute right-3 top-3">
                <span className="mkt-compare-badge mkt-compare-badge-strong">Professional</span>
              </div>
            </div>
            <p className="border-t border-zinc-200 px-4 py-3 text-sm font-medium text-[#0c0c12]">
              {realityCheck.rightCaption}
            </p>
          </article>
        </div>

        <blockquote className="mt-12 max-w-4xl rounded-xl border border-zinc-200 bg-white p-8 shadow-[0_24px_48px_-20px_rgba(15,15,20,0.12)] lg:p-10">
          <p className="font-display text-xl font-semibold leading-snug text-[#0c0c12] lg:text-2xl">
            {realityCheck.punchline}
          </p>
        </blockquote>
      </div>
    </SectionShell>
  );
}
