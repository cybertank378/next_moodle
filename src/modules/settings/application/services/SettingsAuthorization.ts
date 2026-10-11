import type { CurrentActor } from "@/core/auth/CurrentActor";
import { AppRole } from "@/core/rbac/AppRole";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { authorize } from "@/core/rbac/authorize";
import { Permission } from "@/core/rbac/Permission";

export function authorizeSettings(actor: CurrentActor | null, operation: "read" | "update"): void {
  if (!actor || actor.role !== AppRole.ADMIN) {
    throw new AuthorizationError("Hanya administrator platform yang dapat mengelola pengaturan.");
  }
  authorize({
    id: actor.userId,
    role: AppRole.ADMIN,
    tenantId: null,
  }, operation === "read" ? Permission.PLATFORM_SETTINGS_READ : Permission.PLATFORM_SETTINGS_UPDATE);
}
