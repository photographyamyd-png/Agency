"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, Mail, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccentButton } from "@/components/marketing/primitives/accent-button";

const anchors = [
  { href: "#services", label: "Services" },
  { href: "#results", label: "Results" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

interface MarketingNavProps {
  businessName: string;
  logoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
}

export function MarketingNav({
  businessName,
  logoUrl,
  email,
  phone,
}: MarketingNavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b bg-white transition-shadow",
        scrolled ? "border-[var(--mkt-border)] shadow-sm" : "border-transparent"
      )}
    >
      <div className="mkt-container flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-[var(--mkt-accent)] px-3 py-2">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={businessName}
                width={32}
                height={32}
                className="rounded-sm object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/20 font-display text-sm font-bold text-white">
                {businessName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="hidden font-display text-sm font-bold uppercase tracking-wide text-white sm:inline">
              {businessName}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {anchors.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-[var(--mkt-muted)] transition-colors hover:text-[var(--mkt-text)]"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-5 text-sm text-[var(--mkt-muted)] lg:flex">
            {phone && (
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="flex items-center gap-1.5 hover:text-[var(--mkt-text)]"
              >
                <Phone className="h-3.5 w-3.5" />
                {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-1.5 hover:text-[var(--mkt-text)]"
              >
                <Mail className="h-3.5 w-3.5" />
                {email}
              </a>
            )}
          </div>
          <Link
            href="/client/login"
            className="hidden text-sm font-medium text-[var(--mkt-muted)] hover:text-[var(--mkt-text)] sm:inline"
          >
            Client login
          </Link>
          <AccentButton href="#contact" className="hidden sm:inline-flex">
            Get a free quote
          </AccentButton>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-[var(--mkt-border)] md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[var(--mkt-border)] bg-white px-6 py-6 md:hidden">
          <ul className="space-y-1">
            {anchors.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block px-2 py-3 text-base text-[var(--mkt-muted)] hover:text-[var(--mkt-text)]"
                >
                  {label}
                </a>
              </li>
            ))}
            {(phone || email) && (
              <li className="mt-4 space-y-2 border-t border-[var(--mkt-border)] pt-4 text-sm text-[var(--mkt-muted)]">
                {phone && (
                  <a href={`tel:${phone.replace(/\D/g, "")}`} className="block px-2 py-2">
                    {phone}
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="block px-2 py-2">
                    {email}
                  </a>
                )}
              </li>
            )}
            <li className="mt-4 border-t border-[var(--mkt-border)] pt-4">
              <Link href="/client/login" onClick={() => setOpen(false)} className="block px-2 py-3">
                Client login
              </Link>
            </li>
            <li className="mt-2">
              <AccentButton href="#contact" className="w-full" onClick={() => setOpen(false)}>
                Get a free quote
              </AccentButton>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
