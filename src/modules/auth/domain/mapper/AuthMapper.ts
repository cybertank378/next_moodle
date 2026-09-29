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
  capabilities?: Record<string, unknown> | null,
): CurrentActor {
  const id = `moodle:${tenant.tenantId}:${siteInfo.userId}`;

  const usernameLower = siteInfo.username.toLowerCase();
  const isTeacherUsername =
    usernameLower.startsWith("teacher") ||
    usernameLower.startsWith("guru") ||
    usernameLower.startsWith("pengajar") ||
    usernameLower.includes("teacher");

  const hasStaffCapabilities = Boolean(
    capabilities &&
      (capabilities.can_manage ||
        capabilities.can_manage_questions ||
        capabilities.can_manage_quizzes ||
        capabilities.can_view_reports ||
        capabilities.can_monitor ||
        capabilities.can_manage_attempts ||
        capabilities.can_manage_incidents),
  );

  let role = AppRole.STUDENT;
  if (serviceUsed === "nextjs_admin") {
    role = AppRole.ADMIN;
  } else if (
    serviceUsed === "nextjs_tenant" ||
    serviceUsed === "nextjs_proctor" ||
    isTeacherUsername ||
    hasStaffCapabilities
  ) {
    role = AppRole.TENANT;
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
