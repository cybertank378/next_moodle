import { ForbiddenError } from "@/core/errors/ForbiddenError";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { Permission } from "@/core/rbac/Permission";
import { hasPermission } from "@/core/rbac/hasPermission";
import type { AppRole } from "@/core/rbac/AppRole";

export function authorizeExamMonitorOperation(
  actor: CurrentActor,
  tenantId: string,
  action: "read" | "action",
): void {
  // 1. Validate tenant boundaries
  if (actor.tenantId && actor.tenantId !== tenantId) {
    throw new ForbiddenError("Anda tidak memiliki akses ke data tenant ini.");
  }

  // 2. Validate permission
  const requiredPermission =
    action === "read"
      ? Permission.EXAM_MONITOR_READ
      : Permission.EXAM_MONITOR_ACTION;

  if (!hasPermission(actor.role as AppRole, requiredPermission)) {
    throw new ForbiddenError(
      "Anda tidak memiliki izin untuk melakukan aksi pengawasan ujian ini.",
    );
  }
}
