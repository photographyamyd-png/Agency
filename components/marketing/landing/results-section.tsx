import Image from "next/image";
import { SectionShell } from "@/components/marketing/primitives/section-shell";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";

interface ResultsSectionProps {
  images: string[];
}

const STATS = [
  {
    value: "#58 → #7",
    label: "Google ranking jump",
    sub: "Local HVAC company — page one for a money keyword",
  },
  {
    value: "+23%",
    label: "More website visits",
    sub: "Average lift in 90 days",
  },
  {
    value: "Weekly",
    label: "Reports you can read",
    sub: "Rankings and traffic in plain English",
  },
];

export function ResultsSection({ images }: ResultsSectionProps) {
  const image = images[0];

  return (
    <SectionShell id="results" band="ink">
      <div className="mkt-container">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="mkt-content">
            <Eyebrow label="Real results" light />
            <h2 className="mkt-headline mt-4">
              More calls. Better rankings. Numbers you can track.
            </h2>
            <p className="mkt-lead mt-4 text-[var(--mkt-muted-on-dark)]">
              Rankings go up, the phone rings more, and you get a weekly report that
              shows exactly what changed.
            </p>

            <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="mkt-card-ink border-white/10 p-5"
                >
                  <dt className="font-display text-xl font-extrabold tabular-nums text-[var(--mkt-accent)]">
                    {stat.value}
                  </dt>
                  <dd className="mt-2">
                    <p className="text-sm font-semibold">{stat.label}</p>
                    <p className="mt-1 text-xs text-[var(--mkt-muted-on-dark)]">
                      {stat.sub}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {image && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src={image}
                alt="Completed commercial construction project"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
