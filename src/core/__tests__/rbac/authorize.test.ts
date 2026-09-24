import { describe, expect, it } from "vitest";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { authorize } from "@/core/rbac/authorize";
import { Permission } from "@/core/rbac/Permission";

describe("authorize", () => {
  const adminActor: AuthorizationActor = {
    id: "admin-1",
    role: AppRole.ADMIN,
    tenantId: null,
  };

  const tenantActor: AuthorizationActor = {
    id: "tenant-user-1",
    role: AppRole.TENANT,
    tenantId: "tenant-123",
  };

  const studentActor: AuthorizationActor = {
    id: "student-user-1",
    role: AppRole.STUDENT,
    tenantId: "tenant-123",
    moodleUserId: 42,
  };

  describe("Authentication Check", () => {
    it("should throw UnauthorizedError when actor is null", () => {
      expect(() =>
        authorize(null, Permission.ADMIN_DASHBOARD_READ),
      ).toThrowError(UnauthorizedError);
    });

    it("should throw UnauthorizedError when actor is undefined", () => {
      expect(() =>
        authorize(undefined, Permission.TENANT_DASHBOARD_READ),
      ).toThrowError(UnauthorizedError);
    });
  });

  describe("Permission Check", () => {
    it("should succeed when actor has the requested permission", () => {
      expect(() =>
        authorize(adminActor, Permission.ADMIN_DASHBOARD_READ),
      ).not.toThrow();
      expect(() =>
        authorize(tenantActor, Permission.TENANT_DASHBOARD_READ),
      ).not.toThrow();
      expect(() =>
        authorize(studentActor, Permission.STUDENT_DASHBOARD_READ),
      ).not.toThrow();
    });

    it("should throw AuthorizationError with 403 when actor lacks permission", () => {
      expect(() =>
        authorize(studentActor, Permission.USER_CREATE),
      ).toThrowError(AuthorizationError);
      expect(() =>
        authorize(tenantActor, Permission.TENANT_CREATE),
      ).toThrowError(AuthorizationError);
      expect(() =>
        authorize(adminActor, Permission.ATTEMPT_START),
      ).toThrowError(AuthorizationError);
    });
  });

  describe("Tenant Isolation Rules", () => {
    it("should throw AuthorizationError when TENANT actor has no tenantId", () => {
      const invalidTenantActor: AuthorizationActor = {
        id: "tenant-user-2",
        role: AppRole.TENANT,
        tenantId: null,
      };

      expect(() =>
        authorize(invalidTenantActor, Permission.TENANT_DASHBOARD_READ),
      ).toThrowError(AuthorizationError);
    });

    it("should throw AuthorizationError when STUDENT actor has no tenantId", () => {
      const invalidStudentActor: AuthorizationActor = {
        id: "student-user-2",
        role: AppRole.STUDENT,
        tenantId: null,
      };

      expect(() =>
        authorize(invalidStudentActor, Permission.STUDENT_DASHBOARD_READ),
      ).toThrowError(AuthorizationError);
    });

    it("should allow ADMIN with null tenantId", () => {
      expect(() =>
        authorize(adminActor, Permission.PLATFORM_AUDIT_READ),
      ).not.toThrow();
    });

    it("should reject spoofed requestedTenantId if different from actor tenantId", () => {
      expect(() =>
        authorize(tenantActor, Permission.TENANT_DASHBOARD_READ, {
          requestedTenantId: "spoofed-other-tenant",
        }),
      ).toThrowError(AuthorizationError);

      expect(() =>
        authorize(studentActor, Permission.STUDENT_DASHBOARD_READ, {
          requestedTenantId: "spoofed-other-tenant",
        }),
      ).toThrowError(AuthorizationError);
    });

    it("should allow matching requestedTenantId", () => {
      expect(() =>
        authorize(tenantActor, Permission.TENANT_DASHBOARD_READ, {
          requestedTenantId: "tenant-123",
        }),
      ).not.toThrow();
    });
  });

  describe("Ownership Rules", () => {
    it("should throw AuthorizationError when student accesses resource owned by someone else", () => {
      expect(() =>
        authorize(studentActor, Permission.ATTEMPT_READ_OWN, {
          resourceOwnerId: "other-student-id",
        }),
      ).toThrowError(AuthorizationError);
    });

    it("should succeed when student accesses own resource", () => {
      expect(() =>
        authorize(studentActor, Permission.ATTEMPT_READ_OWN, {
          resourceOwnerId: "student-user-1",
        }),
      ).not.toThrow();
    });
  });
});
