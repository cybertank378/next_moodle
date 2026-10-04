import type {
  AuthorizationActor,
  AuthorizationOptions,
} from "@/core/rbac/AuthorizationContext";
import { authorize } from "@/core/rbac/authorize";
import type { PermissionType } from "@/core/rbac/Permission";

export function requirePermission(
  actor: AuthorizationActor | null | undefined,
  permission: PermissionType,
  options?: AuthorizationOptions,
): AuthorizationActor {
  return authorize(actor, permission, options);
}
