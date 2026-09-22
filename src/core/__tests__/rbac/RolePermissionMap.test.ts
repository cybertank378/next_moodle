import { describe, expect, it } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import { hasPermission } from "@/core/rbac/hasPermission";
import { Permission } from "@/core/rbac/Permission";
import { RolePermissionMap } from "@/core/rbac/RolePermissionMap";

describe("RolePermissionMap & hasPermission", () => {
  describe("ADMIN permissions", () => {
    it("should allow platform administration permissions", () => {
      expect(
        hasPermission(AppRole.ADMIN, Permission.ADMIN_DASHBOARD_READ),
      ).toBe(true);
      expect(hasPermission(AppRole.ADMIN, Permission.TENANT_CREATE)).toBe(true);
      expect(hasPermission(AppRole.ADMIN, Permission.TENANT_READ)).toBe(true);
      expect(hasPermission(AppRole.ADMIN, Permission.TENANT_UPDATE)).toBe(true);
      expect(
        hasPermission(AppRole.ADMIN, Permission.TENANT_STATUS_UPDATE),
      ).toBe(true);
      expect(
        hasPermission(AppRole.ADMIN, Permission.TENANT_CONNECTION_TEST),
      ).toBe(true);
      expect(hasPermission(AppRole.ADMIN, Permission.PLATFORM_AUDIT_READ)).toBe(
        true,
      );
    });

    it("should deny student exam attempt permissions", () => {
      expect(hasPermission(AppRole.ADMIN, Permission.ATTEMPT_START)).toBe(
        false,
      );
      expect(hasPermission(AppRole.ADMIN, Permission.ATTEMPT_SUBMIT_OWN)).toBe(
        false,
      );
    });
  });

  describe("TENANT permissions", () => {
    it("should allow tenant management, user management, and exam administration", () => {
      expect(
        hasPermission(AppRole.TENANT, Permission.TENANT_DASHBOARD_READ),
      ).toBe(true);
      expect(hasPermission(AppRole.TENANT, Permission.USER_READ)).toBe(true);
      expect(hasPermission(AppRole.TENANT, Permission.USER_CREATE)).toBe(true);
      expect(hasPermission(AppRole.TENANT, Permission.ENROLMENT_READ)).toBe(
        true,
      );
      expect(hasPermission(AppRole.TENANT, Permission.COURSE_READ)).toBe(true);
      expect(hasPermission(AppRole.TENANT, Permission.QUIZ_READ)).toBe(true);
      expect(hasPermission(AppRole.TENANT, Permission.QUESTION_READ)).toBe(
        true,
      );
      expect(hasPermission(AppRole.TENANT, Permission.EXAM_CREATE)).toBe(true);
      expect(hasPermission(AppRole.TENANT, Permission.EXAM_MONITOR_READ)).toBe(
        true,
      );
      expect(hasPermission(AppRole.TENANT, Permission.GRADE_READ)).toBe(true);
    });

    it("should deny platform-level tenant creation and audit", () => {
      expect(hasPermission(AppRole.TENANT, Permission.TENANT_CREATE)).toBe(
        false,
      );
      expect(
        hasPermission(AppRole.TENANT, Permission.PLATFORM_AUDIT_READ),
      ).toBe(false);
    });
  });

  describe("STUDENT permissions", () => {
    it("should allow student courses, quizzes, and own attempt operations", () => {
      expect(
        hasPermission(AppRole.STUDENT, Permission.STUDENT_DASHBOARD_READ),
      ).toBe(true);
      expect(
        hasPermission(AppRole.STUDENT, Permission.STUDENT_COURSE_READ),
      ).toBe(true);
      expect(hasPermission(AppRole.STUDENT, Permission.STUDENT_QUIZ_READ)).toBe(
        true,
      );
      expect(hasPermission(AppRole.STUDENT, Permission.ATTEMPT_START)).toBe(
        true,
      );
      expect(hasPermission(AppRole.STUDENT, Permission.ATTEMPT_READ_OWN)).toBe(
        true,
      );
      expect(hasPermission(AppRole.STUDENT, Permission.ATTEMPT_SAVE_OWN)).toBe(
        true,
      );
      expect(
        hasPermission(AppRole.STUDENT, Permission.ATTEMPT_SUBMIT_OWN),
      ).toBe(true);
      expect(
        hasPermission(AppRole.STUDENT, Permission.ATTEMPT_REVIEW_OWN),
      ).toBe(true);
      expect(hasPermission(AppRole.STUDENT, Permission.GRADE_READ_OWN)).toBe(
        true,
      );
    });

    it("should deny tenant management and exam composition", () => {
      expect(hasPermission(AppRole.STUDENT, Permission.USER_CREATE)).toBe(
        false,
      );
      expect(hasPermission(AppRole.STUDENT, Permission.EXAM_CREATE)).toBe(
        false,
      );
      expect(
        hasPermission(AppRole.STUDENT, Permission.EXAM_MONITOR_ACTION),
      ).toBe(false);
      expect(hasPermission(AppRole.STUDENT, Permission.TENANT_CREATE)).toBe(
        false,
      );
    });
  });

  describe("RolePermissionMap structure", () => {
    it("should define permission arrays for all roles", () => {
      expect(Array.isArray(RolePermissionMap[AppRole.ADMIN])).toBe(true);
      expect(Array.isArray(RolePermissionMap[AppRole.TENANT])).toBe(true);
      expect(Array.isArray(RolePermissionMap[AppRole.STUDENT])).toBe(true);
    });
  });
});
