"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, Mail, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccentButton } from "@/components/marketing/primitives/accent-button";
import { MARKETING_COPY } from "@/lib/agency/marketing-copy";

const anchors = [
  { href: "#strategy", label: "Strategy" },
  { href: "#services", label: "Services" },
  { href: "#results", label: "Results" },
  { href: "#pricing", label: "Pricing" },
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
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Utility bar — BuildStitch */}
      <div className="bg-[var(--mkt-ink)] text-white/80">
        <div className="mkt-container flex items-center justify-between gap-4 py-2 text-xs sm:text-[13px]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {phone && (
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Phone className="h-3 w-3 text-[var(--mkt-accent-bright)]" />
                {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="hidden items-center gap-1.5 transition-colors hover:text-white sm:inline-flex"
              >
                <Mail className="h-3 w-3 text-[var(--mkt-accent-bright)]" />
                {email}
              </a>
            )}
          </div>
          <a
            href="#contact"
            className="font-semibold text-[var(--mkt-accent-bright)] transition-colors hover:text-white"
          >
            {MARKETING_COPY.ctaPrimary}
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={cn(
          "border-b bg-white transition-shadow duration-300",
          scrolled
            ? "border-[var(--mkt-border)] shadow-md"
            : "border-[var(--mkt-border)]/60 shadow-none"
        )}
      >
        <div className="mkt-container flex items-center justify-between gap-4">
          {/* Logo accent block bleeding into hero (OSTECH) */}
          <Link
            href="/"
            className="relative -mb-3 flex items-center gap-3 bg-[var(--mkt-accent)] px-4 py-3 text-white shadow-md sm:px-5 sm:py-3.5"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={businessName}
                width={36}
                height={36}
                className="rounded object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded bg-white/20 text-sm font-bold">
                A
              </span>
            )}
            <div className="leading-tight">
              <span className="block text-sm font-bold tracking-tight">{businessName}</span>
              <span className="hidden text-[10px] font-medium uppercase tracking-wider text-white/80 sm:block">
                Sites for construction &amp; the trades
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {anchors.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium text-[var(--mkt-muted)] transition-colors hover:text-[var(--mkt-accent)]"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 py-3">
            <Link
              href="/client/login"
              className="hidden text-sm font-medium text-[var(--mkt-muted)] hover:text-[var(--mkt-text)] sm:inline"
            >
              Client login
            </Link>
            <AccentButton href="#contact" className="hidden h-10 px-5 text-sm sm:inline-flex">
              {MARKETING_COPY.ctaPrimary}
            </AccentButton>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--mkt-border)] bg-white text-[var(--mkt-text)] lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-[var(--mkt-border)] bg-white px-6 py-6 lg:hidden">
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
              <li className="mt-4 border-t border-[var(--mkt-border)] pt-4">
                <Link
                  href="/client/login"
                  onClick={() => setOpen(false)}
                  className="block px-2 py-3 text-[var(--mkt-muted)]"
                >
                  Client login
                </Link>
              </li>
              <li className="mt-2">
                <AccentButton href="#contact" className="w-full" onClick={() => setOpen(false)}>
                  {MARKETING_COPY.ctaPrimary}
                </AccentButton>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
