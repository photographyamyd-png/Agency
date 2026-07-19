import Link from "next/link";
import Image from "next/image";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";

interface MarketingFooterProps {
  businessName: string;
  logoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  chickenImage?: string;
}

export function MarketingFooter({
  businessName,
  logoUrl,
  email,
  phone,
  chickenImage,
}: MarketingFooterProps) {
  return (
    <footer className="relative overflow-hidden bg-[var(--mkt-ink)] text-white">
      <div className="mkt-accent-bar" aria-hidden />
      <div className="mkt-container relative z-10 py-20 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={businessName}
                  width={40}
                  height={40}
                  className="rounded-lg object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--mkt-accent)] text-sm font-bold text-white">
                  A
                </span>
              )}
              <span className="font-display text-lg font-bold">{businessName}</span>
            </div>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-white/55">
              Websites and local SEO for construction and the trades. You call, you get me.
            </p>
            {(email || phone) && (
              <p className="mt-6 text-sm text-white/45">
                {email}
                {email && phone ? " · " : ""}
                {phone}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="mkt-eyebrow" style={{ color: "var(--mkt-accent-bright)" }}>
                Navigate
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  { href: "#services", label: "Services" },
                  { href: "#results", label: "Results" },
                  { href: "#process", label: "Process" },
                  { href: "#contact", label: "Contact" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="text-white/55 transition-colors hover:text-[var(--mkt-accent-bright)]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mkt-eyebrow" style={{ color: "var(--mkt-accent-bright)" }}>
                Portal
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>
                  <Link href="/client/login" className="text-white/55 hover:text-white">
                    Client login
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="text-white/55 hover:text-white">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="mkt-eyebrow" style={{ color: "var(--mkt-accent-bright)" }}>
                Ready
              </p>
              <a
                href="#contact"
                className="mt-6 inline-block font-display text-lg font-bold text-[var(--mkt-accent-bright)] hover:underline"
              >
                {MARKETING_COPY.finalCta.button} →
              </a>
            </div>
          </div>
        </div>

        {chickenImage && (
          <div className="mkt-footnote mt-14 flex items-start gap-3">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border-2 border-[var(--mkt-accent-bright)]">
              <Image
                src={chickenImage}
                alt=""
                fill
                className="object-cover"
                sizes="36px"
                aria-hidden
              />
            </div>
            <p>{MARKETING_COPY.chickenLine}</p>
          </div>
        )}

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} {businessName}
          </p>
          <p className="text-sm text-white/40">Built by Amy — for people who build things.</p>
        </div>
      </div>
    </footer>
  );
}
