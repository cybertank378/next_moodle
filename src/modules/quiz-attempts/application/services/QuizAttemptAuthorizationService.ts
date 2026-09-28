import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { authorize } from "@/core/rbac/authorize";
import type { PermissionType } from "@/core/rbac/Permission";

export function authorizeAttemptOperation(
  actor: AuthorizationActor | null | undefined,
  requiredPermission: PermissionType,
  options?: {
    resourceOwnerId?: string;
  },
): string {
  if (!actor) {
    throw new UnauthorizedError("Sesi tidak valid atau telah berakhir.");
  }

  // ADMIN has platform wide access
  if (actor.role === AppRole.ADMIN) {
    return actor.tenantId ?? "";
  }

  // STUDENT role requires valid tenantId and permission check
  if (actor.role === AppRole.STUDENT) {
    if (!actor.tenantId) {
      throw new AuthorizationError(
        "Akses ditolak: tenant ID diperlukan untuk operasi attempt.",
      );
    }

    authorize(actor, requiredPermission, {
      requestedTenantId: actor.tenantId,
      resourceOwnerId: options?.resourceOwnerId,
    });
    return actor.tenantId;
  }

  throw new AuthorizationError(
    "Akses ditolak: role tidak memiliki wewenang untuk aktivitas attempt ujian.",
  );
}
