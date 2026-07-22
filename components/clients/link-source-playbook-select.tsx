"use client";

import { useState } from "react";
import {
  LINK_SOURCE_PLAYBOOKS,
  type LinkSourceType,
} from "@/lib/blueprint/checklist-playbooks";
import { ChecklistPlaybookDetails } from "@/components/clients/checklist-playbook";

const SOURCE_TYPES: LinkSourceType[] = [
  "CHAMBER",
  "SPONSORSHIP",
  "SUPPLIER",
  "PARTNER",
  "MEDIA",
  "OTHER",
];

export function LinkSourcePlaybookSelect() {
  const [sourceType, setSourceType] = useState<LinkSourceType>("CHAMBER");
  const playbook = LINK_SOURCE_PLAYBOOKS[sourceType];

  return (
    <div className="space-y-2 sm:col-span-2">
      <select
        name="sourceType"
        value={sourceType}
        onChange={(e) => setSourceType(e.target.value as LinkSourceType)}
        className="h-9 w-full rounded-md border border-border px-3 text-sm"
      >
        {SOURCE_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      {playbook && (
        <ChecklistPlaybookDetails playbook={playbook} className="pt-1" />
      )}
    </div>
  );
}
