import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { authorize } from "@/core/rbac/authorize";
import type { PermissionType } from "@/core/rbac/Permission";

export function authorizeTenantOperation(
  actor: AuthorizationActor | null | undefined,
  permission: PermissionType,
): Error | null {
  try {
    authorize(actor, permission);
    return null;
  } catch (error) {
    if (error instanceof AuthorizationError || error instanceof UnauthorizedError) {
      return error;
    }
    throw error;
  }
}
