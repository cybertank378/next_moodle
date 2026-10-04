import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { AppRole } from "@/core/rbac/AppRole";
import { NotificationScope } from "@/modules/notification/domain/value-object/NotificationScope";

describe("NotificationScope", () => {
  it("creates a platform scope (tenantId=null) for ADMIN", () => {
    const scope = NotificationScope.forRecipient({
      recipientId: "admin-1",
      role: AppRole.ADMIN,
      tenantId: null,
    });

    expect(scope.tenantId).toBeNull();
    expect(scope.recipientId).toBe("admin-1");
    expect(scope.recipientRole).toBe(AppRole.ADMIN);
    expect(scope.isPlatformScope).toBe(true);
  });

  it("ignores any tenantId supplied for ADMIN to keep platform scope", () => {
    const scope = NotificationScope.forRecipient({
      recipientId: "admin-1",
      role: AppRole.ADMIN,
      tenantId: "tenant-1",
    });

    expect(scope.tenantId).toBeNull();
  });

  it.each([AppRole.TENANT, AppRole.TEACHER, AppRole.STUDENT])(
    "creates a tenant scope for %s",
    (role) => {
      const scope = NotificationScope.forRecipient({
        recipientId: "u-1",
        role,
        tenantId: "tenant-1",
      });

      expect(scope.tenantId).toBe("tenant-1");
      expect(scope.recipientRole).toBe(role);
      expect(scope.isPlatformScope).toBe(false);
    },
  );

  it.each([AppRole.TENANT, AppRole.TEACHER, AppRole.STUDENT])(
    "rejects %s without a tenantId",
    (role) => {
      for (const tenantId of [null, undefined, "", "   "]) {
        expect(() =>
          NotificationScope.forRecipient({ recipientId: "u-1", role, tenantId }),
        ).toThrow(ForbiddenError);
      }
    },
  );

  it("rejects an unknown role", () => {
    expect(() =>
      NotificationScope.forRecipient({
        recipientId: "u-1",
        role: "PROCTOR",
        tenantId: "tenant-1",
      }),
    ).toThrow(ForbiddenError);
  });

  it("rejects an empty recipientId", () => {
    expect(() =>
      NotificationScope.forRecipient({
        recipientId: " ",
        role: AppRole.STUDENT,
        tenantId: "tenant-1",
      }),
    ).toThrow(ForbiddenError);
  });

  describe("owns", () => {
    const scope = NotificationScope.forRecipient({
      recipientId: "u-1",
      role: AppRole.STUDENT,
      tenantId: "tenant-1",
    });

    it("returns true for a notification in the same tenant, recipient and role", () => {
      expect(
        scope.owns({
          tenantId: "tenant-1",
          recipientId: "u-1",
          recipientRole: AppRole.STUDENT,
        }),
      ).toBe(true);
    });

    it("returns false on tenant mismatch", () => {
      expect(
        scope.owns({
          tenantId: "tenant-2",
          recipientId: "u-1",
          recipientRole: AppRole.STUDENT,
        }),
      ).toBe(false);
    });

    it("returns false on recipient mismatch", () => {
      expect(
        scope.owns({
          tenantId: "tenant-1",
          recipientId: "u-2",
          recipientRole: AppRole.STUDENT,
        }),
      ).toBe(false);
    });

    it("returns false on role mismatch", () => {
      expect(
        scope.owns({
          tenantId: "tenant-1",
          recipientId: "u-1",
          recipientRole: AppRole.TEACHER,
        }),
      ).toBe(false);
    });

    it("does not let a platform scope own a tenant notification", () => {
      const admin = NotificationScope.forRecipient({
        recipientId: "u-1",
        role: AppRole.ADMIN,
        tenantId: null,
      });
      expect(
        admin.owns({
          tenantId: "tenant-1",
          recipientId: "u-1",
          recipientRole: AppRole.ADMIN,
        }),
      ).toBe(false);
    });
  });
});
