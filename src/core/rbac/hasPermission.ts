import type { AppRole } from "@/core/rbac/AppRole";
import type { PermissionType } from "@/core/rbac/Permission";
import { RolePermissionMap } from "@/core/rbac/RolePermissionMap";

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
