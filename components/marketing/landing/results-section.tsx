import { SectionShell } from "@/components/marketing/primitives/section-shell";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";
import { FloatingStatCard } from "@/components/marketing/primitives/floating-stat-card";
import { GoogleSerpMock } from "@/components/marketing/primitives/google-serp-mock";
import { SeoToolkitMock } from "@/components/marketing/primitives/seo-toolkit-mock";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";

export function ResultsSection() {
  const outcomes = MARKETING_COPY.outcomes;
  const hero = outcomes[0];

  return (
    <SectionShell id="results" band="ink" diagonalTop diagonalBottom>
      <div className="mkt-container">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow index="03" label="Results" light />
            <h2 className="mkt-headline mt-5 text-white">
              More calls. Better rankings.{" "}
              <span className="text-[var(--mkt-orange-bright)]">Receipts included.</span>
            </h2>
            <p className="mkt-lead mt-5 text-white/70">
              Big numbers tied to real trade shops — not vague &ldquo;results.&rdquo; Rankings
              go up, the phone rings more, and you get a weekly report that shows what moved.
            </p>

            <p className="mt-12 font-display text-5xl font-bold tabular-nums tracking-tight text-[var(--mkt-orange-bright)] sm:text-6xl">
              {hero.value}
            </p>
            <p className="mt-2 text-sm text-white/50">
              {hero.client} · {hero.channel}
            </p>

            <ul className="mt-10 space-y-0">
              {outcomes.map((stat) => (
                <li key={stat.title} className="mkt-stat-row">
                  <p className="font-display text-2xl font-bold tabular-nums text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white/90">{stat.title}</p>
                  <p className="mt-0.5 text-xs text-white/45">
                    {stat.client} · {stat.channel}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative lg:col-span-7">
            <div className="relative mx-auto max-w-lg lg:ml-auto lg:mr-8">
              <div className="mkt-corner-frame" aria-hidden />
              <div className="relative z-[1]">
                <GoogleSerpMock
                  query="general contractor near me"
                  businessName="Local GC"
                  rankBadge="#41 → #5"
                />
              </div>

              <div className="absolute -bottom-8 -left-4 z-[2] hidden w-[58%] border-4 border-[var(--mkt-ink)] shadow-xl sm:block lg:-left-10">
                <SeoToolkitMock variant="seo" className="shadow-none" />
              </div>

              <FloatingStatCard
                label={outcomes[1].client}
                value={outcomes[1].value}
                hint={outcomes[1].channel}
                className="absolute -right-2 top-8 z-20 hidden max-w-[11rem] sm:block lg:-right-6"
              />
            </div>

            <div className="mt-20 grid gap-3 sm:grid-cols-2">
              {outcomes.slice(0, 4).map((outcome) => (
                <div
                  key={outcome.title}
                  className="border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm"
                >
                  <p className="font-display text-3xl font-bold tabular-nums text-[var(--mkt-orange-bright)]">
                    {outcome.value}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-snug text-white">
                    {outcome.title}
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    {outcome.client} · {outcome.channel}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
