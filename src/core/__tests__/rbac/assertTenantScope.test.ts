import { describe, expect, it } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { assertTenantScope } from "@/core/rbac/assertTenantScope";

describe("assertTenantScope", () => {
  const adminActor: AuthorizationActor = {
    id: "admin-1",
    role: AppRole.ADMIN,
    tenantId: null,
  };

  const tenantActor: AuthorizationActor = {
    id: "tenant-user-1",
    role: AppRole.TENANT,
    tenantId: "tenant-alpha",
  };

  const studentActor: AuthorizationActor = {
    id: "student-user-1",
    role: AppRole.STUDENT,
    tenantId: "tenant-alpha",
  };

  it("should allow ADMIN cross-tenant operation", () => {
    expect(() => assertTenantScope(adminActor, "tenant-alpha")).not.toThrow();
    expect(() => assertTenantScope(adminActor, "tenant-beta")).not.toThrow();
  });

  it("should allow TENANT actor when targetTenantId matches", () => {
    expect(() => assertTenantScope(tenantActor, "tenant-alpha")).not.toThrow();
  });

  it("should throw AuthorizationError when TENANT actor accesses different tenant", () => {
    expect(() => assertTenantScope(tenantActor, "tenant-beta")).toThrowError(
      AuthorizationError,
    );
  });

  it("should allow STUDENT actor when targetTenantId matches", () => {
    expect(() => assertTenantScope(studentActor, "tenant-alpha")).not.toThrow();
  });

  it("should throw AuthorizationError when STUDENT actor accesses different tenant", () => {
    expect(() => assertTenantScope(studentActor, "tenant-beta")).toThrowError(
      AuthorizationError,
    );
  });

  it("should throw AuthorizationError when TENANT actor has empty tenantId", () => {
    const invalidTenant: AuthorizationActor = {
      id: "t-invalid",
      role: AppRole.TENANT,
      tenantId: "",
    };
    expect(() => assertTenantScope(invalidTenant, "tenant-alpha")).toThrowError(
      AuthorizationError,
    );
  });
});
