import Image from "next/image";
import { SectionShell, ZigZagRow } from "@/components/marketing/primitives/section-shell";
import { Eyebrow } from "@/components/marketing/primitives/eyebrow";

interface ResultsSectionProps {
  images: string[];
}

const STATS = [
  {
    value: "#58 → #7",
    label: "Google ranking jump",
    sub: "Local HVAC — page one for a money keyword",
  },
  {
    value: "+23%",
    label: "More site visits",
    sub: "Average lift in the first 90 days",
  },
  {
    value: "Weekly",
    label: "Reports you'll read",
    sub: "Rankings & traffic in plain English",
  },
];

export function ResultsSection({ images }: ResultsSectionProps) {
  const image = images[0];

  return (
    <SectionShell id="results" tone="light">
      <div className="mkt-container">
        <ZigZagRow
          image={
            image ? (
              <div className="relative">
                <div className="mkt-frame-back" aria-hidden />
                <div className="mkt-image-stack relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl lg:-mt-6">
                  <Image
                    src={image}
                    alt="Commercial construction — the kind of work my clients do"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>
                <div className="mkt-slab mkt-slab-dark absolute -bottom-8 -right-4 z-20 max-w-[14rem] p-4 lg:-right-10">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent-bright">
                    Real work
                  </p>
                  <p className="mt-1 text-sm font-medium">Sites for people who build things</p>
                </div>
              </div>
            ) : (
              <div />
            )
          }
        >
          <div className="lg:pl-4">
            <Eyebrow label="Real numbers" />
            <h2 className="mkt-headline mt-4">
              More calls. Better rankings.{" "}
              <span className="mkt-headline-gradient">Receipts included.</span>
            </h2>
            <p className="mkt-lead mt-5">
              I don&apos;t sell hope. Rankings go up, the phone rings more, and you get a
              weekly report that shows exactly what moved.
            </p>

            <dl className="relative z-10 mt-10 grid gap-4 sm:grid-cols-3 lg:-mr-12">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className="mkt-card-light mkt-card-light-hover p-5"
                  style={{ marginTop: i === 1 ? "1.5rem" : undefined }}
                >
                  <dt className="font-display text-xl font-bold tabular-nums text-indigo-600">
                    {stat.value}
                  </dt>
                  <dd className="mt-2">
                    <p className="text-sm font-semibold text-[#0c0c12]">{stat.label}</p>
                    <p className="mt-1 text-xs text-zinc-500">{stat.sub}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </ZigZagRow>
      </div>
    </SectionShell>
  );
}
