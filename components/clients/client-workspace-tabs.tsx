import Link from "next/link";
import type {
  AccessChecklistItem,
  BrandProfile,
  Client,
  ClientIntegration,
  ClientPortalUser,
  Keyword,
  LaunchChecklistItem,
  Lead,
  RankSnapshot,
  SystemEvent,
  WeeklyReport,
} from "@prisma/client";
import { ClientPortalInviteForm } from "@/components/clients/portal-invite-form";
import { Badge } from "@/components/ui/badge";
import { StatHighlight } from "@/components/ui/stat-highlight";
import { cn } from "@/lib/utils";

type ClientWithRelations = Client & {
  lead: Pick<Lead, "id" | "businessName"> | null;
  brandProfile: BrandProfile | null;
  portalUser: Pick<ClientPortalUser, "email" | "lastLoginAt"> | null;
  accessItems: AccessChecklistItem[];
  launchChecklist: LaunchChecklistItem[];
  weeklyReports: WeeklyReport[];
  integrations: ClientIntegration[];
  keywords: (Keyword & { rankSnapshots: RankSnapshot[] })[];
  systemEvents: SystemEvent[];
};

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "profile", label: "Profile" },
  { id: "checklists", label: "Checklists" },
  { id: "reports", label: "Reports" },
  { id: "portal", label: "Portal" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface ClientWorkspaceTabsProps {
  client: ClientWithRelations;
  activeTab: string;
}

export function ClientWorkspaceTabs({
  client,
  activeTab,
}: ClientWorkspaceTabsProps) {
  const tab = (TABS.some((t) => t.id === activeTab) ? activeTab : "overview") as TabId;

  const rankWin = client.keywords.find((kw) => {
    const [cur, prev] = kw.rankSnapshots;
    return cur?.rank != null && prev?.rank != null && prev.rank > cur.rank;
  });

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-1 border-b border-border-bright pb-px">
        {TABS.map(({ id, label }) => (
          <Link
            key={id}
            href={`/clients/${client.id}?tab=${id}`}
            className={cn(
              "rounded-t-md px-4 py-2 text-sm font-medium transition-colors",
              tab === id
                ? "bg-surface-raised text-accent-bright border border-border-bright border-b-transparent -mb-px"
                : "text-muted hover:text-foreground"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border-bright bg-surface-raised p-6 shadow-lg shadow-black/20 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">Status</span>
              <Badge variant="muted">{client.status}</Badge>
            </div>
            {client.billingEmail && (
              <p className="text-sm">
                <span className="text-muted">Billing email:</span> {client.billingEmail}
              </p>
            )}
            {client.lead && (
              <p className="text-sm">
                <span className="text-muted">Converted from lead:</span>{" "}
                <Link
                  href={`/leads/${client.lead.id}`}
                  className="text-accent-bright hover:underline"
                >
                  {client.lead.businessName}
                </Link>
              </p>
            )}
            <p className="text-sm text-muted">
              {client.integrations.filter((i) => i.status === "CONNECTED").length} integrations
              connected · {client.keywords.length} keywords tracked
            </p>
          </div>
          {rankWin && (
            <StatHighlight
              stat={`#${rankWin.rankSnapshots[1]!.rank} → #${rankWin.rankSnapshots[0]!.rank}`}
              label={`${rankWin.term} rank improvement`}
            />
          )}
          {client.systemEvents.length > 0 && (
            <div className="lg:col-span-2 rounded-xl border border-border-bright bg-surface-raised p-6">
              <h3 className="text-sm font-medium mb-4">Recent activity</h3>
              <ul className="space-y-2">
                {client.systemEvents.map((e) => (
                  <li key={e.id} className="flex justify-between text-sm text-muted">
                    <span>{e.type.replace(/_/g, " ").toLowerCase()}</span>
                    <span>{new Date(e.createdAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {tab === "profile" && (
        <div className="rounded-xl border border-border-bright bg-surface-raised p-6 space-y-3 text-sm">
          {client.brandProfile ? (
            <>
              {client.brandProfile.domain && (
                <p>
                  <span className="text-muted">Domain:</span> {client.brandProfile.domain}
                </p>
              )}
              {client.brandProfile.industry && (
                <p>
                  <span className="text-muted">Industry:</span> {client.brandProfile.industry}
                </p>
              )}
              <p>
                <span className="text-muted">GA4:</span>{" "}
                {client.brandProfile.ga4Connected ? "Connected" : "Not connected"}
              </p>
              <p>
                <span className="text-muted">GSC:</span>{" "}
                {client.brandProfile.gscConnected ? "Connected" : "Not connected"}
              </p>
            </>
          ) : (
            <p className="text-muted">No brand profile yet — complete onboarding to populate.</p>
          )}
        </div>
      )}

      {tab === "checklists" && (
        <ul className="space-y-2">
          {[...client.accessItems, ...client.launchChecklist].map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-border-bright bg-surface-raised px-4 py-3 text-sm"
            >
              <span>{"label" in item ? item.label : ""}</span>
              <Badge variant="muted">{String(item.status)}</Badge>
            </li>
          ))}
          {client.accessItems.length === 0 &&
            client.launchChecklist.length === 0 && (
              <p className="text-sm text-muted py-8 text-center">No checklist items yet.</p>
            )}
        </ul>
      )}

      {tab === "reports" && (
        <ul className="space-y-3">
          {client.weeklyReports.map((r) => {
            const highlights = (r.highlights as string[] | null) ?? [];
            return (
              <li
                key={r.id}
                className="rounded-xl border border-border-bright bg-surface-raised p-4 text-sm"
              >
                <p className="font-medium">
                  Week of {new Date(r.periodStart).toLocaleDateString()}
                </p>
                {highlights[0] && (
                  <p className="mt-1 text-muted">{highlights[0]}</p>
                )}
              </li>
            );
          })}
          {client.weeklyReports.length === 0 && (
            <p className="text-sm text-muted py-8 text-center">No reports yet.</p>
          )}
        </ul>
      )}

      {tab === "portal" && (
        <div className="rounded-xl border border-border-bright bg-surface-raised p-6 max-w-lg">
          {client.portalUser ? (
            <p className="text-sm text-muted mb-4">
              Portal user: <span className="text-foreground">{client.portalUser.email}</span>
              {client.portalUser.lastLoginAt && (
                <> · Last login {new Date(client.portalUser.lastLoginAt).toLocaleDateString()}</>
              )}
            </p>
          ) : (
            <p className="text-sm text-muted mb-4">No portal account yet.</p>
          )}
          <ClientPortalInviteForm clientId={client.id} />
        </div>
      )}
    </div>
  );
}
