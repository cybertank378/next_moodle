import { describe, expect, it } from "vitest";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { Permission } from "@/core/rbac/Permission";
import { requirePermission } from "@/core/rbac/requirePermission";
import { requireRole } from "@/core/rbac/requireRole";

describe("requireRole & requirePermission", () => {
  const adminActor: AuthorizationActor = {
    id: "admin-1",
    role: AppRole.ADMIN,
    tenantId: null,
  };

  const tenantActor: AuthorizationActor = {
    id: "tenant-1",
    role: AppRole.TENANT,
    tenantId: "tenant-123",
  };

  const studentActor: AuthorizationActor = {
    id: "student-1",
    role: AppRole.STUDENT,
    tenantId: "tenant-123",
  };

  describe("requireRole", () => {
    it("should throw UnauthorizedError when actor is not provided", () => {
      expect(() => requireRole(null, AppRole.ADMIN)).toThrowError(
        UnauthorizedError,
      );
      expect(() => requireRole(undefined, AppRole.TENANT)).toThrowError(
        UnauthorizedError,
      );
    });

    it("should throw AuthorizationError when role does not match", () => {
      expect(() => requireRole(studentActor, AppRole.ADMIN)).toThrowError(
        AuthorizationError,
      );
      expect(() => requireRole(tenantActor, AppRole.ADMIN)).toThrowError(
        AuthorizationError,
      );
      expect(() => requireRole(studentActor, AppRole.TENANT)).toThrowError(
        AuthorizationError,
      );
    });

    it("should succeed and return actor when role matches", () => {
      expect(requireRole(adminActor, AppRole.ADMIN)).toEqual(adminActor);
      expect(requireRole(tenantActor, AppRole.TENANT)).toEqual(tenantActor);
      expect(requireRole(studentActor, AppRole.STUDENT)).toEqual(studentActor);
    });

    it("should throw AuthorizationError if TENANT or STUDENT has no tenantId", () => {
      const invalidTenant: AuthorizationActor = {
        id: "t-2",
        role: AppRole.TENANT,
        tenantId: null,
      };
      expect(() => requireRole(invalidTenant, AppRole.TENANT)).toThrowError(
        AuthorizationError,
      );
    });
  });

  describe("requirePermission", () => {
    it("should succeed and return actor when permission matches", () => {
      expect(
        requirePermission(adminActor, Permission.ADMIN_DASHBOARD_READ),
      ).toEqual(adminActor);
      expect(
        requirePermission(tenantActor, Permission.TENANT_DASHBOARD_READ),
      ).toEqual(tenantActor);
      expect(requirePermission(studentActor, Permission.ATTEMPT_START)).toEqual(
        studentActor,
      );
    });

    it("should throw AuthorizationError when permission is missing", () => {
      expect(() =>
        requirePermission(studentActor, Permission.EXAM_CREATE),
      ).toThrowError(AuthorizationError);
    });
  });
});
