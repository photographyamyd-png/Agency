"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const anchors = [
  { href: "#services", label: "Services" },
  { href: "#results", label: "Results" },
  { href: "#how", label: "How it works" },
  { href: "#contact", label: "Get Started" },
];

interface MarketingNavProps {
  businessName: string;
  logoUrl?: string | null;
}

export function MarketingNav({ businessName, logoUrl }: MarketingNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border-bright bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={businessName}
              width={32}
              height={32}
              className="rounded-md object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-xs font-bold text-accent-foreground shadow-accent-glow">
              {businessName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-semibold tracking-tight">{businessName}</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          {anchors.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="hover:text-accent-bright transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/client/login">Client Login</Link>
          </Button>
          <Button variant="glow" size="sm" asChild className="hidden sm:inline-flex">
            <a href="#contact">Get Started</a>
          </Button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-bright md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border-bright bg-surface px-4 py-4 md:hidden">
          <ul className="space-y-1">
            {anchors.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm text-muted hover:bg-surface-raised hover:text-foreground"
                  )}
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="border-t border-border-bright pt-2 mt-2">
              <Link
                href="/client/login"
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-accent-bright"
              >
                Client Login
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
