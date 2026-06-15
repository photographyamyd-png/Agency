"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/client/dashboard", label: "Dashboard" },
  { href: "/client/reports", label: "Reports" },
  { href: "/client/integrations", label: "Integrations" },
  { href: "/client/checklist", label: "Checklist" },
  { href: "/client/account", label: "Account" },
];

interface ClientNavProps {
  businessName: string;
  logoUrl?: string | null;
}

export function ClientNav({ businessName, logoUrl }: ClientNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-border-bright bg-surface">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/client/dashboard" className="flex items-center gap-2">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={businessName}
              width={28}
              height={28}
              className="rounded object-cover"
            />
          ) : null}
          <span className="text-sm font-semibold">{businessName}</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm md:flex">
          {links.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-md px-3 py-1.5 transition-colors",
                  active
                    ? "bg-accent-muted text-accent-bright"
                    : "text-muted hover:text-foreground"
                )}
              >
                {label}
              </Link>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </Button>
        </nav>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-bright md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <nav className="border-t border-border-bright px-4 py-3 md:hidden">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm",
                  active ? "text-accent-bright" : "text-muted"
                )}
              >
                {label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-2 block w-full rounded-md px-3 py-2 text-left text-sm text-muted"
          >
            Sign out
          </button>
        </nav>
      )}
    </header>
  );
}
