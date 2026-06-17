import Link from "next/link";
import Image from "next/image";

interface MarketingFooterProps {
  businessName: string;
  logoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
}

export function MarketingFooter({
  businessName,
  logoUrl,
  email,
  phone,
}: MarketingFooterProps) {
  return (
    <footer className="mkt-band-ink border-t border-white/10">
      <div className="mkt-container py-20 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={businessName}
                  width={40}
                  height={40}
                  className="rounded-sm object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[var(--mkt-accent)] font-display text-sm font-bold text-white">
                  {businessName.charAt(0)}
                </div>
              )}
              <span className="font-display text-lg font-bold uppercase tracking-wide text-[var(--mkt-on-dark)]">
                {businessName}
              </span>
            </div>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-[var(--mkt-muted-on-dark)]">
              Websites and local SEO for HVAC, plumbing, roofing, and contractors — built
              to get the phone ringing and keep you on Google&apos;s map.
            </p>
            {(email || phone) && (
              <p className="mt-6 text-sm text-[var(--mkt-muted-on-dark)]">
                {email}
                {email && phone ? " · " : ""}
                {phone}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="mkt-eyebrow mkt-eyebrow-light">Navigate</p>
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
                      className="text-[var(--mkt-muted-on-dark)] transition-colors hover:text-[var(--mkt-on-dark)]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mkt-eyebrow mkt-eyebrow-light">Portal</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>
                  <Link
                    href="/client/login"
                    className="text-[var(--mkt-muted-on-dark)] hover:text-[var(--mkt-on-dark)]"
                  >
                    Client login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/login"
                    className="text-[var(--mkt-muted-on-dark)] hover:text-[var(--mkt-on-dark)]"
                  >
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="mkt-eyebrow mkt-eyebrow-light">Ready?</p>
              <a
                href="#contact"
                className="mt-6 inline-block font-display text-lg font-bold uppercase tracking-wide text-[var(--mkt-accent-bright)] hover:underline"
              >
                Get a free quote →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--mkt-muted-on-dark)]">
            © {new Date().getFullYear()} {businessName}
          </p>
          <p className="text-sm text-[var(--mkt-muted-on-dark)]">
            More calls from Google. Less guesswork.
          </p>
        </div>
      </div>
    </footer>
  );
}
