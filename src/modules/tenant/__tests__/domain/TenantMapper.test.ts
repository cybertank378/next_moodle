import { describe, expect, it } from "vitest";
import { Tenant, type TenantProps } from "@/modules/tenant/domain/Tenant";
import { TenantMapper } from "@/modules/tenant/domain/TenantMapper";

describe("TenantMapper", () => {
  const now = new Date("2026-01-01T00:00:00Z");

  const baseProps: TenantProps = {
    id: "tenant-abc",
    slug: "acme-corp",
    name: "ACME Corporation",
    status: "ACTIVE",
    customDomain: "lms.acme.edu",
    createdAt: now,
    updatedAt: now,
  };

  describe("toResponseDTO", () => {
    it("should map tenant fields correctly", () => {
      const tenant = new Tenant(baseProps);
      const dto = TenantMapper.toResponseDTO(tenant);

      expect(dto.id).toBe("tenant-abc");
      expect(dto.slug).toBe("acme-corp");
      expect(dto.name).toBe("ACME Corporation");
      expect(dto.status).toBe("ACTIVE");
      expect(dto.customDomain).toBe("lms.acme.edu");
      expect(dto.createdAt).toBe(now.toISOString());
    });

    it("should return null credential when tenant has no credential", () => {
      const tenant = new Tenant({ ...baseProps, credential: null });
      const dto = TenantMapper.toResponseDTO(tenant);
      expect(dto.credential).toBeNull();
    });

    it("should NOT expose encryptedAdminToken in credential DTO", () => {
      const tenant = new Tenant({
        ...baseProps,
        credential: {
          id: "cred-1",
          tenantId: "tenant-abc",
          moodleUrl: "https://moodle.acme.edu",
          encryptedAdminToken: "SUPER_SECRET_CIPHER",
          encryptedProctorToken: null,
          timeoutBudgetMs: 10000,
          sslVerify: true,
          createdAt: now,
          updatedAt: now,
        },
      });
      const dto = TenantMapper.toResponseDTO(tenant);

      expect(dto.credential).not.toBeNull();
      // The credential DTO must NOT have any token/ciphertext fields
      const credKeys = Object.keys(dto.credential ?? {});
      expect(credKeys).not.toContain("encryptedAdminToken");
      expect(credKeys).not.toContain("encryptedProctorToken");
      expect(credKeys).not.toContain("adminToken");
      expect(credKeys).not.toContain("proctorToken");
      // Safe fields should be present
      expect(dto.credential?.moodleUrl).toBe("https://moodle.acme.edu");
      expect(dto.credential?.timeoutBudgetMs).toBe(10000);
    });

    it("should set hasProctorToken=false when no proctor token", () => {
      const tenant = new Tenant({
        ...baseProps,
        credential: {
          id: "cred-1",
          tenantId: "tenant-abc",
          moodleUrl: "https://moodle.acme.edu",
          encryptedAdminToken: "cipher",
          encryptedProctorToken: null,
          timeoutBudgetMs: 10000,
          sslVerify: true,
          createdAt: now,
          updatedAt: now,
        },
      });
      const dto = TenantMapper.toResponseDTO(tenant);
      expect(dto.credential?.hasProctorToken).toBe(false);
    });

    it("should set hasProctorToken=true when proctor token exists", () => {
      const tenant = new Tenant({
        ...baseProps,
        credential: {
          id: "cred-1",
          tenantId: "tenant-abc",
          moodleUrl: "https://moodle.acme.edu",
          encryptedAdminToken: "cipher",
          encryptedProctorToken: "proctor_cipher",
          timeoutBudgetMs: 10000,
          sslVerify: true,
          createdAt: now,
          updatedAt: now,
        },
      });
      const dto = TenantMapper.toResponseDTO(tenant);
      expect(dto.credential?.hasProctorToken).toBe(true);
    });

    it("should return null branding when tenant has no branding", () => {
      const tenant = new Tenant({ ...baseProps, branding: null });
      const dto = TenantMapper.toResponseDTO(tenant);
      expect(dto.branding).toBeNull();
    });

    it("should NOT expose customCss in branding DTO", () => {
      const tenant = new Tenant({
        ...baseProps,
        branding: {
          id: "brand-1",
          tenantId: "tenant-abc",
          logoUrl: "https://cdn.acme.edu/logo.png",
          primaryColor: "#0066cc",
          accentColor: null,
          faviconUrl: null,
          customCss: "body { color: red }",
          createdAt: now,
          updatedAt: now,
        },
      });
      const dto = TenantMapper.toResponseDTO(tenant);
      // customCss is internal-only; do not expose
      expect(Object.keys(dto.branding ?? {})).not.toContain("customCss");
    });
  });

  describe("toSummaryDTO", () => {
    it("should report hasMoodleCredential=true when credential exists", () => {
      const tenant = new Tenant({
        ...baseProps,
        credential: {
          id: "cred-1",
          tenantId: "tenant-abc",
          moodleUrl: "https://moodle.acme.edu",
          encryptedAdminToken: "cipher",
          encryptedProctorToken: null,
          timeoutBudgetMs: 10000,
          sslVerify: true,
          createdAt: now,
          updatedAt: now,
        },
      });
      const dto = TenantMapper.toSummaryDTO(tenant);
      expect(dto.hasMoodleCredential).toBe(true);
    });

    it("should report hasMoodleCredential=false when no credential", () => {
      const tenant = new Tenant({ ...baseProps, credential: null });
      const dto = TenantMapper.toSummaryDTO(tenant);
      expect(dto.hasMoodleCredential).toBe(false);
    });

    it("should report hasBranding=true when branding exists", () => {
      const tenant = new Tenant({
        ...baseProps,
        branding: {
          id: "brand-1",
          tenantId: "tenant-abc",
          logoUrl: null,
          primaryColor: null,
          accentColor: null,
          faviconUrl: null,
          customCss: null,
          createdAt: now,
          updatedAt: now,
        },
      });
      const dto = TenantMapper.toSummaryDTO(tenant);
      expect(dto.hasBranding).toBe(true);
    });

    it("should not expose any token/cipher in summary", () => {
      const tenant = new Tenant({
        ...baseProps,
        credential: {
          id: "cred-1",
          tenantId: "tenant-abc",
          moodleUrl: "https://moodle.acme.edu",
          encryptedAdminToken: "CIPHER_SECRET",
          encryptedProctorToken: null,
          timeoutBudgetMs: 10000,
          sslVerify: true,
          createdAt: now,
          updatedAt: now,
        },
      });
      const dto = TenantMapper.toSummaryDTO(tenant);
      const dtoStr = JSON.stringify(dto);
      expect(dtoStr).not.toContain("CIPHER_SECRET");
      expect(dtoStr).not.toContain("encryptedAdminToken");
    });
  });
});
