import { describe, expect, it } from "vitest";
import { Tenant, type TenantProps } from "@/modules/tenant/domain/Tenant";

describe("Tenant Domain Entity", () => {
  const baseProps: TenantProps = {
    id: "tenant-123",
    slug: "acme-corp",
    name: "ACME Corporation",
    status: "ACTIVE",
    customDomain: "lms.acme.edu",
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-02T00:00:00Z"),
  };

  it("should create tenant instance and expose properties accurately", () => {
    const tenant = new Tenant(baseProps);

    expect(tenant.id).toBe("tenant-123");
    expect(tenant.slug).toBe("acme-corp");
    expect(tenant.name).toBe("ACME Corporation");
    expect(tenant.status).toBe("ACTIVE");
    expect(tenant.customDomain).toBe("lms.acme.edu");
    expect(tenant.isActive).toBe(true);
    expect(tenant.isSuspended).toBe(false);
  });

  it("should report isActive correctly according to status", () => {
    const maintenance = new Tenant({ ...baseProps, status: "MAINTENANCE" });
    expect(maintenance.isActive).toBe(false);

    const suspended = new Tenant({ ...baseProps, status: "SUSPENDED" });
    expect(suspended.isActive).toBe(false);
    expect(suspended.isSuspended).toBe(true);
  });

  it("should support credential and branding associations", () => {
    const tenant = new Tenant({
      ...baseProps,
      credential: {
        id: "cred-1",
        tenantId: "tenant-123",
        moodleUrl: "https://moodle.acme.edu",
        encryptedAdminToken: "enc_token_123",
        timeoutBudgetMs: 15000,
        sslVerify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      branding: {
        id: "brand-1",
        tenantId: "tenant-123",
        logoUrl: "https://cdn.acme.edu/logo.png",
        primaryColor: "#0066cc",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    expect(tenant.credential).toBeDefined();
    expect(tenant.credential?.moodleUrl).toBe("https://moodle.acme.edu");
    expect(tenant.branding).toBeDefined();
    expect(tenant.branding?.primaryColor).toBe("#0066cc");
  });
});
