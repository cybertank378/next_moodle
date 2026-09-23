import type { CurrentActor } from "@/core/auth/CurrentActor";
import { AppRole } from "@/core/rbac/AppRole";
import { RolePermissionMap } from "@/core/rbac/RolePermissionMap";
import type {
  LoginTenant,
  MoodleSiteInfo,
} from "@/modules/auth/domain/interfaces/AuthInterfaces";

export function mapMoodleStudentToActor(
  tenant: LoginTenant,
  siteInfo: MoodleSiteInfo,
): CurrentActor {
  const id = `moodle:${tenant.tenantId}:${siteInfo.userId}`;
  return {
    id,
    userId: id,
    username: siteInfo.username,
    role: AppRole.STUDENT,
    tenantId: tenant.tenantId,
    moodleUserId: siteInfo.userId,
    permissions: RolePermissionMap[AppRole.STUDENT],
    email: siteInfo.email,
    displayName: siteInfo.fullName,
  };
}
