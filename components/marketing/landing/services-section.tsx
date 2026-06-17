import Image from "next/image";
import { Globe, LineChart, Search } from "lucide-react";
import { SectionShell } from "@/components/marketing/primitives/section-shell";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    key: "WEBSITE" as const,
    icon: Globe,
    title: "A website that gets calls",
    desc: "Fast on mobile, easy to read, with your phone number front and center. Built for homeowners ready to hire.",
  },
  {
    key: "SEO" as const,
    icon: Search,
    title: "Show up on Google Maps",
    desc: "Google Business Profile, local keywords, and citations so you rank in your service area — not just downtown.",
    featured: true,
  },
  {
    key: "REPORTING" as const,
    icon: LineChart,
    title: "Proof in your inbox",
    desc: "Weekly updates on rankings, traffic, and leads. No guessing — you see what's working.",
  },
];

interface ServicesSectionProps {
  resolveImage: (key: "WEBSITE" | "SEO" | "REPORTING") => string;
}

export function ServicesSection({ resolveImage }: ServicesSectionProps) {
  return (
    <SectionShell id="services" band="paper">
      <div className="mkt-container">
        <div className="mkt-content max-w-3xl">
          <Eyebrow label="What we do" />
          <h2 className="mkt-headline mt-4">
            Websites &amp; SEO for crews who run jobs
          </h2>
          <p className="mkt-lead mt-4">
            You run a trade business. We handle the website and Google so when someone
            searches &ldquo;plumber near me&rdquo; or &ldquo;AC repair,&rdquo; your name
            shows up and the phone rings.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {SERVICES.map(({ key, icon: Icon, title, desc, featured }) => (
            <article
              key={key}
              className={cn(
                "overflow-hidden",
                featured ? "mkt-card-ink" : "mkt-card-stone"
              )}
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={resolveImage(key)}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
                {featured && (
                  <div className="absolute inset-0 bg-[var(--mkt-ink)]/30" />
                )}
              </div>
              <div className="p-6">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-sm",
                    featured
                      ? "bg-white/10 text-[var(--mkt-accent-bright)]"
                      : "mkt-icon-box"
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold uppercase tracking-tight">
                  {title}
                </h3>
                <p
                  className={cn(
                    "mt-2 text-sm leading-relaxed",
                    featured ? "text-[var(--mkt-muted-on-dark)]" : "text-[var(--mkt-muted)]"
                  )}
                >
                  {desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
