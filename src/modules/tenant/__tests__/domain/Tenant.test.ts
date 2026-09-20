import { describe, expect, it } from "vitest";
import { Tenant } from "@/modules/tenant/domain/entities/Tenant";
import { TenantRules } from "@/modules/tenant/domain/rules/TenantRules";

describe("Tenant Domain Entity & Rules", () => {
  describe("Tenant Entity", () => {
    it("should instantiate with required properties and without exposing token", () => {
      const tenant = new Tenant({
        id: "tenant-1",
        slug: "smpn29",
        name: "SMPN 29 Jakarta",
        status: "ACTIVE",
        moodleBaseUrl: "https://moodle.smpn29.sch.id",
        moodleServiceShortname: "exam_service",
      });

      expect(tenant.id).toBe("tenant-1");
      expect(tenant.slug).toBe("smpn29");
      expect(tenant.name).toBe("SMPN 29 Jakarta");
      expect(tenant.status).toBe("ACTIVE");
      expect(tenant.moodleBaseUrl).toBe("https://moodle.smpn29.sch.id");
      expect(tenant.moodleServiceShortname).toBe("exam_service");
      expect(tenant.isActive()).toBe(true);
      expect(tenant.isSuspended()).toBe(false);
      expect(tenant.canAccess()).toBe(true);

      // Verify token is not a property of Tenant entity
      // @ts-expect-error - token should not exist on Tenant entity
      expect(tenant.moodleToken).toBeUndefined();
    });

    it("should normalize trailing slash on moodleBaseUrl", () => {
      const tenant = new Tenant({
        id: "tenant-2",
        slug: "school-b",
        name: "School B",
        status: "INACTIVE",
        moodleBaseUrl: "https://moodle.schoolb.test/",
        moodleServiceShortname: null,
      });

      expect(tenant.moodleBaseUrl).toBe("https://moodle.schoolb.test");
      expect(tenant.isActive()).toBe(false);
      expect(tenant.canAccess()).toBe(false);
    });

    it("should handle SUSPENDED status correctly", () => {
      const tenant = new Tenant({
        id: "tenant-3",
        slug: "school-c",
        name: "School C",
        status: "SUSPENDED",
        moodleBaseUrl: "https://moodle.schoolc.test",
        moodleServiceShortname: null,
      });

      expect(tenant.isSuspended()).toBe(true);
      expect(tenant.isActive()).toBe(false);
      expect(tenant.canAccess()).toBe(false);
    });
  });

  describe("TenantRules", () => {
    it("should allow ACTIVE tenant to access application", () => {
      expect(() =>
        TenantRules.assertCanAccess("ACTIVE", "smpn29"),
      ).not.toThrow();
    });

    it("should throw ForbiddenError for INACTIVE tenant with TENANT_INACTIVE code", () => {
      expect(() =>
        TenantRules.assertCanAccess("INACTIVE", "smpn29"),
      ).toThrowError(/tidak aktif/i);
    });

    it("should throw ForbiddenError for SUSPENDED tenant with TENANT_SUSPENDED code", () => {
      expect(() =>
        TenantRules.assertCanAccess("SUSPENDED", "smpn29"),
      ).toThrowError(/ditangguhkan/i);
    });
  });
});
