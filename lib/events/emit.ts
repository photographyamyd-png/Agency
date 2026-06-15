import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { SystemEventType } from "./types";

export async function emitSystemEvent(input: {
  type: SystemEventType;
  clientId?: string;
  leadId?: string;
  payload?: Record<string, unknown>;
}) {
  return prisma.systemEvent.create({
    data: {
      type: input.type,
      clientId: input.clientId,
      leadId: input.leadId,
      payload: (input.payload ?? {}) as Prisma.InputJsonValue,
    },
  });
}
