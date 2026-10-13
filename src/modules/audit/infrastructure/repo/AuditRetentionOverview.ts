import "server-only";
import { prisma } from "@/libs/prisma";
import { auditRetentionCutoff } from "@/modules/audit/application/services/AuditRetentionService";
export async function getAuditRetentionOverview(now = new Date()) {
  const cutoff = auditRetentionCutoff(now);
  const [protectedCount, eligibleCount] = await Promise.all([
    prisma.saasAuditLog.count({ where: { createdAt: { gt: cutoff } } }),
    prisma.saasAuditLog.count({ where: { createdAt: { lte: cutoff } } }),
  ]);
  return {
    protectedCount,
    eligibleCount,
    cutoff: cutoff.toISOString(),
    asOf: now.toISOString(),
  };
}
