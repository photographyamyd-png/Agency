import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const settingsSections = [
  {
    title: "Agency Profile",
    description: "Business name, homepage copy, and auto-onboarding for website leads",
    href: "/settings/agency",
  },
  {
    title: "Onboarding Templates",
    description: "Welcome email copy and questionnaire configuration",
    href: "/settings/onboarding",
  },
  {
    title: "Integrations",
    description: "Google OAuth — connect GA4/GSC per client from client detail pages",
    href: "/clients",
  },
  {
    title: "Cron Jobs",
    description: "Daily sync at 6am UTC · Weekly reports Mondays 8am UTC (set CRON_SECRET on Vercel)",
    href: null,
  },
];

export default function SettingsPage() {
  return (
    <DashboardShell
      title="Settings"
      description="Configure your agency profile and integrations"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {settingsSections.map((section) =>
          section.href ? (
            <Link
              key={section.title}
              href={section.href}
              className="rounded-lg border border-border bg-surface p-5 hover:border-accent/30 transition-colors"
            >
              <h3 className="text-sm font-medium text-foreground">{section.title}</h3>
              <p className="mt-1 text-sm text-muted">{section.description}</p>
            </Link>
          ) : (
            <div
              key={section.title}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <h3 className="text-sm font-medium text-foreground">{section.title}</h3>
              <p className="mt-1 text-sm text-muted">{section.description}</p>
            </div>
          )
        )}
      </div>
    </DashboardShell>
  );
}
