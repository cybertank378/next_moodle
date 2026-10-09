import type { CurrentActor } from "@/core/auth/CurrentActor";
import { AppRole } from "@/core/rbac/AppRole";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { authorize } from "@/core/rbac/authorize";
import { Permission } from "@/core/rbac/Permission";
import type { AuditScope } from "@/modules/audit/domain/interfaces/AuditRepositoryInterface";
export class AuditService {
  static resolveScope(actor: CurrentActor): AuditScope {
    if (actor.role === AppRole.ADMIN) {
      authorize(
        { id: actor.userId, role: AppRole.ADMIN, tenantId: actor.tenantId },
        Permission.PLATFORM_AUDIT_READ,
      );
      return { role: "ADMIN", tenantId: null };
    }
    if (actor.role === AppRole.TENANT) {
      if (!actor.tenantId?.trim())
        throw new AuthorizationError("Konteks tenant tidak valid.");
      authorize(
        { id: actor.userId, role: AppRole.TENANT, tenantId: actor.tenantId },
        Permission.TENANT_AUDIT_READ,
      );
      return { role: "TENANT", tenantId: actor.tenantId };
    }
    throw new AuthorizationError("Role tidak memiliki akses audit.");
  }
  static assertTenantFilter(scope: AuditScope, requested?: string) {
    if (scope.role === "TENANT" && requested && requested !== scope.tenantId)
      throw new AuthorizationError("Akses lintas tenant ditolak.");
  }
}
