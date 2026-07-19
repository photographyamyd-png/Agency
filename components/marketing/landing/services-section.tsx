import { FileSpreadsheet, Globe, MapPin, Search, Wrench } from "lucide-react";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";
import { SectionShell } from "@/components/marketing/primitives/section-shell";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";
import { IconFeature } from "@/components/marketing/primitives/icon-feature";
import { FloatingStatCard } from "@/components/marketing/primitives/floating-stat-card";
import { GoogleSerpMock } from "@/components/marketing/primitives/google-serp-mock";
import { SeoToolkitMock } from "@/components/marketing/primitives/seo-toolkit-mock";
import { cn } from "@/lib/utils";

const SERVICE_ICONS = {
  WEBSITE: Globe,
  SEO: MapPin,
  REPORTING: FileSpreadsheet,
} as const;

function ServiceVisual({ serviceKey }: { serviceKey: "WEBSITE" | "SEO" | "REPORTING" }) {
  if (serviceKey === "SEO") {
    return (
      <GoogleSerpMock
        compact
        query="concrete driveway near me"
        businessName="Your Shop"
        rankBadge="Maps · #1"
        className="border-0 shadow-none"
      />
    );
  }
  if (serviceKey === "WEBSITE") {
    return <SeoToolkitMock variant="website" className="border-0 shadow-none" />;
  }
  return <SeoToolkitMock variant="reporting" className="border-0 shadow-none" />;
}

export function ServicesSection() {
  return (
    <SectionShell id="services" band="stone" diagonalTop className="pb-0 lg:pb-0">
      {/* Intro — light stone */}
      <div className="mkt-container pb-16 lg:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative pb-10 lg:col-span-5 sm:pb-14">
            <div className="relative mx-auto max-w-md lg:mx-0">
              <div className="mkt-corner-frame" aria-hidden />
              <div className="relative z-[1]">
                <GoogleSerpMock
                  query="general contractor near me"
                  businessName="Your Shop on Maps"
                  rankBadge="Maps · Top 3"
                />
              </div>

              <div className="absolute -bottom-8 -left-4 z-[2] hidden w-[62%] border-4 border-[var(--mkt-stone)] shadow-xl sm:block lg:-left-8">
                <SeoToolkitMock variant="website" className="shadow-none" />
              </div>

              <FloatingStatCard
                label="Maps pack"
                value="Top 3"
                hint="Local SEO · call leads"
                className="absolute -right-2 top-6 z-20 hidden max-w-[10.5rem] sm:block lg:-right-4"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <Eyebrow index="02" label="Services" />
            <h2 className="mkt-headline mt-5">
              Three things that get the phone ringing.
            </h2>
            <p className="mkt-lead mt-5">
              Sites and local SEO for construction crews and trade shops — aimed at
              Maps, money keywords, and booked jobs.
            </p>
            <div className="mt-10 space-y-8">
              <IconFeature
                icon={Wrench}
                title="Built for the trades"
                description="No jargon, no fluff packages — sites and SEO aimed at local search and phone calls."
              />
              <IconFeature
                icon={Search}
                title="Own your local presence"
                description="Google Maps and money keywords so locals call you first when they need a contractor."
              />
            </div>
          </div>
        </div>
      </div>

      {/* High-contrast card band — separated from intro like Results KPIs */}
      <div className="relative bg-[var(--mkt-ink)] py-16 lg:py-20">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[var(--mkt-orange)]"
          aria-hidden
        />
        <div className="mkt-container">
          <p className="mkt-eyebrow mkt-eyebrow-light mb-10">
            What you get
          </p>

          <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-8">
            {MARKETING_COPY.services.map(({ key, title, line }, i) => {
              const Icon = SERVICE_ICONS[key];
              const featured = i === 1;
              const span =
                i === 0 ? "lg:col-span-3" : featured ? "lg:col-span-5" : "lg:col-span-4";

              return (
                <article
                  key={key}
                  className={cn(
                    "flex flex-col overflow-hidden border border-white/10 bg-white shadow-[0_28px_56px_-20px_rgba(0,0,0,0.55)]",
                    span,
                    featured && "lg:-translate-y-6"
                  )}
                >
                  {featured && (
                    <div className="bg-[var(--mkt-orange)] px-4 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-white">
                      Most shops start here
                    </div>
                  )}

                  <div
                    className={cn(
                      "overflow-hidden border-b border-[var(--mkt-border)] bg-[var(--mkt-paper)]",
                      featured ? "max-h-[280px]" : "max-h-[180px]"
                    )}
                  >
                    <ServiceVisual serviceKey={key} />
                  </div>

                  <div className={cn("flex flex-1 flex-col p-6", featured && "p-7 sm:p-8")}>
                    <div
                      className={cn(
                        "mkt-icon-box mb-4",
                        featured && "h-14 w-14 [&_svg]:h-6 [&_svg]:w-6"
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <h3
                      className={cn(
                        "font-display font-bold text-[var(--mkt-text)]",
                        featured ? "text-2xl" : "text-lg"
                      )}
                    >
                      {title}
                    </h3>
                    <p
                      className={cn(
                        "mt-3 flex-1 leading-relaxed text-[var(--mkt-muted)]",
                        featured ? "text-sm" : "text-xs sm:text-sm"
                      )}
                    >
                      {line}
                    </p>
                    <a
                      href="#pricing"
                      className="mt-5 inline-flex text-sm font-semibold text-[var(--mkt-orange)] underline-offset-4 hover:underline"
                    >
                      View pricing →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
