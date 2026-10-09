import "server-only";
import { prisma } from "@/libs/prisma";
import { auditRetentionCutoff } from "@/modules/audit/application/services/AuditRetentionService";
export async function purgeExpiredAuditLogs(
  now = new Date(),
  batchSize = 500,
): Promise<{ deleted: number; cutoff: string }> {
  const cutoff = auditRetentionCutoff(now);
  const candidates = await prisma.saasAuditLog.findMany({
    where: { createdAt: { lte: cutoff } },
    select: { id: true },
    take: batchSize,
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });
  if (!candidates.length) return { deleted: 0, cutoff: cutoff.toISOString() };
  const result = await prisma.saasAuditLog.deleteMany({
    where: {
      id: { in: candidates.map((x) => x.id) },
      createdAt: { lte: cutoff },
    },
  });
  return { deleted: result.count, cutoff: cutoff.toISOString() };
}
