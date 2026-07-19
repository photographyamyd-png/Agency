import { MASTER_QUICK_REFERENCE } from "@/lib/blueprint/quick-reference";
import { BLUEPRINT_PHASES } from "@/lib/blueprint/phases";

interface PhaseProgressProps {
  phaseCompletion: Record<string, number>;
}

export function PhaseProgress({ phaseCompletion }: PhaseProgressProps) {
  return (
    <div className="rounded-xl border border-border-bright bg-surface-raised p-6 space-y-4">
      <h3 className="text-sm font-medium">Blueprint Phase Progress</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BLUEPRINT_PHASES.map((phase) => {
          const pct = phaseCompletion[phase.id] ?? 0;
          return (
            <div key={phase.id} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted">{phase.number}. {phase.name}</span>
                <span className="tabular-nums">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function QuickReferencePanel() {
  return (
    <div className="rounded-xl border border-border-bright bg-surface-raised p-6 space-y-4">
      <h3 className="text-sm font-medium">Master Quick-Reference (§15)</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MASTER_QUICK_REFERENCE.map((pillar) => (
          <details key={pillar.pillar} className="text-sm">
            <summary className="font-medium cursor-pointer hover:text-accent-bright">
              {pillar.pillar}
            </summary>
            <ul className="mt-2 space-y-1 text-muted text-xs">
              {pillar.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
