import { AppRole } from "./AppRole";
import { Permission, type PermissionType } from "./Permission";

export const RolePermissionMap: Record<AppRole, readonly PermissionType[]> = {
  [AppRole.ADMIN]: [
    Permission.ADMIN_DASHBOARD_READ,
    Permission.TENANT_CREATE,
    Permission.TENANT_READ,
    Permission.TENANT_UPDATE,
    Permission.TENANT_STATUS_UPDATE,
    Permission.TENANT_CONNECTION_TEST,
    Permission.PLATFORM_AUDIT_READ,
  ],

  [AppRole.TENANT]: [
    Permission.TENANT_DASHBOARD_READ,
    Permission.TENANT_BRANDING_READ,
    Permission.TENANT_BRANDING_UPDATE,
    Permission.USER_READ,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DEACTIVATE,
    Permission.USER_IMPORT,
    Permission.ENROLMENT_READ,
    Permission.ENROLMENT_MANAGE,
    Permission.GROUP_READ,
    Permission.GROUP_MANAGE,
    Permission.COURSE_READ,
    Permission.QUIZ_READ,
    Permission.QUESTION_READ,
    Permission.QUESTION_CREATE,
    Permission.QUESTION_UPDATE,
    Permission.QUESTION_DELETE,
    Permission.EXAM_CREATE,
    Permission.EXAM_UPDATE,
    Permission.EXAM_DELETE,
    Permission.EXAM_MONITOR_READ,
    Permission.EXAM_MONITOR_ACTION,
    Permission.GRADE_READ,
    Permission.TENANT_AUDIT_READ,
  ],

  [AppRole.STUDENT]: [
    Permission.STUDENT_DASHBOARD_READ,
    Permission.STUDENT_COURSE_READ,
    Permission.STUDENT_QUIZ_READ,
    Permission.ATTEMPT_START,
    Permission.ATTEMPT_READ_OWN,
    Permission.ATTEMPT_SAVE_OWN,
    Permission.ATTEMPT_SUBMIT_OWN,
    Permission.ATTEMPT_REVIEW_OWN,
    Permission.GRADE_READ_OWN,
  ],
};
