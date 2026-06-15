import { requireClient } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function ClientReportsPage() {
  const session = await requireClient();
  const reports = await prisma.weeklyReport.findMany({
    where: { clientId: session.user.clientId! },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const monthly = await prisma.monthlyReport.findMany({
    where: { clientId: session.user.clientId! },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-muted">
          Weekly and monthly SEO progress reports
        </p>
      </div>

      <section>
        <h2 className="text-sm font-medium mb-4">Weekly reports</h2>
        {reports.length === 0 ? (
          <p className="text-sm text-muted rounded-xl border border-dashed border-border p-8 text-center">
            No weekly reports yet — they appear here after your first sync.
          </p>
        ) : (
          <ul className="space-y-3">
            {reports.map((r) => (
              <li key={r.id} className="rounded-lg border border-border p-4">
                <p className="text-sm font-medium">
                  {new Date(r.periodStart).toLocaleDateString()} –{" "}
                  {new Date(r.periodEnd).toLocaleDateString()}
                </p>
                {r.summary && (
                  <p className="mt-2 text-sm text-muted">{r.summary}</p>
                )}
                {Array.isArray(r.highlights) && (r.highlights as string[]).length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {(r.highlights as string[]).map((h, i) => (
                      <li key={i} className="text-sm text-accent">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium mb-4">Monthly reports</h2>
        {monthly.length === 0 ? (
          <p className="text-sm text-muted">No monthly reports yet.</p>
        ) : (
          <ul className="space-y-3">
            {monthly.map((r) => (
              <li key={r.id} className="rounded-lg border border-border p-4">
                <p className="text-sm font-medium">
                  {new Date(r.periodStart).toLocaleDateString()} –{" "}
                  {new Date(r.periodEnd).toLocaleDateString()}
                </p>
                {r.summary && (
                  <p className="mt-2 text-sm text-muted">{r.summary}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
