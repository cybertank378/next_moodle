import type { CurrentActor } from "@/core/auth/CurrentActor";
import { AppRole } from "@/core/rbac/AppRole";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
export function auditRetentionCutoff(now: Date): Date {
  const date = new Date(now);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() - 3);
  const last = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  ).getUTCDate();
  date.setUTCDate(Math.min(day, last));
  return date;
}
export function requireAuditCleanupAdmin(actor: CurrentActor): void {
  if (actor.role !== AppRole.ADMIN)
    throw new AuthorizationError(
      "Hanya ADMIN yang diizinkan membersihkan audit log.",
    );
}
