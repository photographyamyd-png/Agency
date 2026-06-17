import Image from "next/image";
import { FileSpreadsheet, Globe, MapPin } from "lucide-react";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";
import { SectionShell } from "@/components/marketing/primitives/section-shell";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";

const SERVICE_ICONS = {
  WEBSITE: Globe,
  SEO: MapPin,
  REPORTING: FileSpreadsheet,
} as const;

interface ServicesSectionProps {
  resolveImage: (key: "WEBSITE" | "SEO" | "REPORTING") => string;
}

export function ServicesSection({ resolveImage }: ServicesSectionProps) {
  return (
    <SectionShell id="services" tone="light" className="py-20 lg:py-28">
      <div className="mkt-container">
        <div className="max-w-3xl">
          <Eyebrow label="What I do" />
          <h2 className="mkt-headline mt-4 text-[#0c0c12]">
            Three things. No subscription theater.
          </h2>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {MARKETING_COPY.services.map(({ key, title, line }) => {
            const Icon = SERVICE_ICONS[key];
            return (
              <article key={key} className="mkt-service-panel">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={resolveImage(key)}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/95 text-indigo-600 shadow-lg">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-[#0c0c12]">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600">{line}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
