import { DashboardShell } from "@/components/layout/dashboard-shell";
import { FREE_TOOL_STACK } from "@/lib/blueprint/free-tools";

export default function FreeToolsPage() {
  const byCategory = FREE_TOOL_STACK.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) acc[tool.category] = [];
      acc[tool.category]!.push(tool);
      return acc;
    },
    {} as Record<string, typeof FREE_TOOL_STACK>
  );

  return (
    <DashboardShell
      title="Free Tool Stack"
      description="Blueprint §16 — every tool is free, no monthly subscriptions"
    >
      <div className="space-y-8">
        {Object.entries(byCategory).map(([category, tools]) => (
          <section key={category}>
            <h3 className="text-sm font-medium mb-3">{category}</h3>
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li
                  key={tool.name}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-lg border border-border-bright bg-surface-raised p-4 text-sm"
                >
                  <div>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-accent-bright hover:underline"
                    >
                      {tool.name}
                    </a>
                    <p className="text-xs text-muted mt-0.5">{tool.useCase}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </DashboardShell>
  );
}
