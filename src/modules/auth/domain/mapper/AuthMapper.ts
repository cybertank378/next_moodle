import type { CurrentActor } from "@/core/auth/CurrentActor";
import { AppRole } from "@/core/rbac/AppRole";
import { RolePermissionMap } from "@/core/rbac/RolePermissionMap";
import type {
  LoginTenant,
  MoodleSiteInfo,
} from "@/modules/auth/domain/interfaces/AuthInterfaces";

export function mapMoodleUserToActor(
  tenant: LoginTenant,
  siteInfo: MoodleSiteInfo,
  serviceUsed: string,
): CurrentActor {
  const id = `moodle:${tenant.tenantId}:${siteInfo.userId}`;

  let role = AppRole.STUDENT;
  if (serviceUsed === "nextjs_admin") {
    role = AppRole.ADMIN;
  } else if (serviceUsed === "nextjs_tenant") {
    role = AppRole.TENANT;
  } else if (serviceUsed === "nextjs_proctor") {
    role = AppRole.TENANT; // Assume proctors use TENANT interface with restricted permissions, or add PROCTOR if it exists
  }

  return {
    id,
    userId: id,
    username: siteInfo.username,
    role,
    tenantId: tenant.tenantId,
    moodleUserId: siteInfo.userId,
    permissions: RolePermissionMap[role] || RolePermissionMap[AppRole.STUDENT],
    email: siteInfo.email,
    displayName: siteInfo.fullName,
  };
}
