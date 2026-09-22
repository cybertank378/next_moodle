import type { AppRole } from "./AppRole";
import type { PermissionType } from "./Permission";
import { RolePermissionMap } from "./RolePermissionMap";

export function hasPermission(
  role: AppRole,
  permission: PermissionType,
): boolean {
  const allowedPermissions = RolePermissionMap[role];
  if (!allowedPermissions) {
    return false;
  }

  return allowedPermissions.includes(permission);
}
