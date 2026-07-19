import { prisma } from "@/lib/prisma";
import { emitSystemEvent } from "@/lib/events/emit";

export async function emitKeywordChanged(
  clientId: string,
  keywordId: string,
  action: "created" | "updated" | "deleted",
  term?: string
) {
  await emitSystemEvent({
    type: "RANK_UPDATED",
    clientId,
    payload: { keywordId, action, term, eventSubType: "KEYWORD_CHANGED" },
  });

  await prisma.brandProfile.updateMany({
    where: { clientId },
    data: { lastKeywordSyncAt: new Date() },
  });
}
