import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";

export function assertTenantScope(
  actor: AuthorizationActor,
  targetTenantId: string,
): void {
  // Admin is allowed cross-tenant operations when target is explicitly provided
  if (actor.role === AppRole.ADMIN) {
    return;
  }

  if (!actor.tenantId || actor.tenantId.trim().length === 0) {
    throw new AuthorizationError(
      `Akses ditolak: Aktor role '${actor.role}' tidak memiliki konteks tenant yang valid.`,
      { role: actor.role, targetTenantId },
    );
  }

  if (actor.tenantId !== targetTenantId) {
    throw new AuthorizationError(
      "Akses ditolak: Operasi berada di luar cakupan tenant aktor.",
      { actorTenantId: actor.tenantId, targetTenantId },
    );
  }
}
