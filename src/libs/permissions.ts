import type { UserRole } from "@/libs/enums";

export type Permission = string;

export const PERMISSIONS = {
  ALL: "*",
  TENANT_MANAGE: "tenant.manage",
  USER_MANAGE: "user.manage",
  EXAM_MANAGE: "exam.manage",
  EXAM_MONITOR: "exam.monitor",
  EXAM_TAKE: "exam.take",
  RESULT_VIEW_ALL: "result.view.all",
  RESULT_VIEW_OWN: "result.view.own",
} as const;

export function canAccess(
  role?: UserRole | null,
  permission?: Permission,
): boolean {
  if (!permission) return true;
  if (!role) return false;
  if (role === "ADMIN") return true;

  switch (permission) {
    case PERMISSIONS.USER_MANAGE:
    case PERMISSIONS.EXAM_MANAGE:
    case PERMISSIONS.EXAM_MONITOR:
    case PERMISSIONS.RESULT_VIEW_ALL:
      return role === "TENANT";
    case PERMISSIONS.EXAM_TAKE:
    case PERMISSIONS.RESULT_VIEW_OWN:
      return role === "STUDENT";
    default:
      return true;
  }
}
