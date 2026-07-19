import {
  CRO_CHECKLIST,
  EAT_TRUST_CHECKLIST,
  type SeoChecklistKeyDef,
} from "./seo-checklist-keys";

export type SiteChecklistGroup = "eat" | "cro";

export interface SiteChecklistItemDef extends SeoChecklistKeyDef {
  group: SiteChecklistGroup;
}

export const SITE_WIDE_CHECKLIST: SiteChecklistItemDef[] = [
  ...EAT_TRUST_CHECKLIST.map((item) => ({ ...item, group: "eat" as const })),
  ...CRO_CHECKLIST.map((item) => ({ ...item, group: "cro" as const })),
];

export type SiteChecklistItemKey =
  (typeof SITE_WIDE_CHECKLIST)[number]["itemKey"];

export type SiteChecklistItemStatus = "pending" | "done" | "na";

export interface SiteChecklistItemValue {
  status: SiteChecklistItemStatus;
  notes?: string;
  completedAt?: string;
}

export type SiteChecklistData = Record<
  SiteChecklistItemKey,
  SiteChecklistItemValue
>;

export function emptySiteChecklist(): SiteChecklistData {
  return Object.fromEntries(
    SITE_WIDE_CHECKLIST.map((item) => [
      item.itemKey,
      { status: "pending" as const },
    ])
  ) as SiteChecklistData;
}
