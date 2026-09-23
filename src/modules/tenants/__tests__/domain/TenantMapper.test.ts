import { describe, expect, it } from "vitest";
import { Tenant } from "@/modules/tenants/domain/entities/Tenant";
import { TenantMapper } from "@/modules/tenants/domain/mappers/TenantMapper";

describe("TenantMapper", () => {
  it("serializes only credential metadata and never a secret field", () => {
    const now = new Date("2026-09-23T04:00:00.000Z");
    const tenant = new Tenant({
      id: "tenant-1",
      slug: "acme-school",
      name: "ACME School",
      status: "ACTIVE",
      customDomain: null,
      credential: {
        moodleUrl: "https://moodle.acme.sch.id",
        timeoutBudgetMs: 10000,
        sslVerify: true,
        hasAdminToken: true,
        hasProctorToken: true,
        configuredAt: now,
      },
      branding: null,
      createdAt: now,
      updatedAt: now,
    });

    const dto = TenantMapper.toDetailResponse(tenant);
    const serialized = JSON.stringify(dto);

    expect(dto.credential?.hasAdminToken).toBe(true);
    expect(serialized).not.toContain("token-value");
    expect(serialized).not.toContain("encryptedAdminToken");
    expect(serialized).not.toContain("encryptedProctorToken");
    expect(serialized).not.toContain("adminToken");
    expect(serialized).not.toContain("proctorToken");
  });
});
