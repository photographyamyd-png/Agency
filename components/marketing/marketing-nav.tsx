"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, Mail, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccentButton } from "@/components/marketing/primitives/accent-button";

const anchors = [
  { href: "#reality", label: "Reality check" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-border-bright bg-background/80 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mkt-container flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={businessName}
              width={36}
              height={36}
              className="rounded-lg object-cover shadow-accent-glow"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground shadow-accent-glow">
              A
            </span>
          )}
          <div className="leading-tight">
            <span className="block text-sm font-semibold text-foreground">{businessName}</span>
            <span className="hidden text-[11px] text-muted sm:block">Sites for the trades</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {anchors.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-muted transition-colors hover:text-accent-bright"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-4 text-sm text-muted xl:flex">
            {phone && (
              <a href={`tel:${phone.replace(/\D/g, "")}`} className="flex items-center gap-1.5 hover:text-foreground">
                <Phone className="h-3.5 w-3.5" />
                {phone}
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-foreground">
                <Mail className="h-3.5 w-3.5" />
                {email}
              </a>
            )}
          </div>
          <Link
            href="/client/login"
            className="hidden text-sm font-medium text-muted hover:text-foreground sm:inline"
          >
            Client login
          </Link>
          <AccentButton href="#contact" className="hidden h-10 px-5 text-sm sm:inline-flex">
            Fix my site
          </AccentButton>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-bright bg-surface-raised/50 text-foreground lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border-bright bg-background/95 px-6 py-6 backdrop-blur-xl lg:hidden">
          <ul className="space-y-1">
            {anchors.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block px-2 py-3 text-base text-muted hover:text-foreground"
                >
                  {label}
                </a>
              </li>
            ))}
            {(phone || email) && (
              <li className="mt-4 space-y-2 border-t border-border pt-4 text-sm text-muted">
                {phone && <a href={`tel:${phone.replace(/\D/g, "")}`} className="block px-2 py-2">{phone}</a>}
                {email && <a href={`mailto:${email}`} className="block px-2 py-2">{email}</a>}
              </li>
            )}
            <li className="mt-4 border-t border-border pt-4">
              <Link href="/client/login" onClick={() => setOpen(false)} className="block px-2 py-3 text-muted">
                Client login
              </Link>
            </li>
            <li className="mt-2">
              <AccentButton href="#contact" className="w-full" onClick={() => setOpen(false)}>
                Fix my site
              </AccentButton>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
