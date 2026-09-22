import type {
  AuthorizationActor,
  AuthorizationOptions,
} from "./AuthorizationContext";
import { authorize } from "./authorize";
import type { PermissionType } from "./Permission";

export function requirePermission(
  actor: AuthorizationActor | null | undefined,
  permission: PermissionType,
  options?: AuthorizationOptions,
): AuthorizationActor {
  return authorize(actor, permission, options);
}
