import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { resolveCurrentTenant } from "@/core/tenant/resolveCurrentTenant";
import type { TenantContext } from "@/core/tenant/TenantContext";
import type { TenantResolver } from "@/core/tenant/TenantResolver";

describe("resolveCurrentTenant", () => {
  const mockResolver: TenantResolver = {
    async resolveFromIdentifier(
      identifier: string,
    ): Promise<TenantContext | null> {
      if (identifier === "acme") {
        return {
          tenantId: "tenant_acme_123",
          tenantSlug: "acme",
          status: "ACTIVE",
          customDomain: "lms.acme.edu",
        };
      }
      if (identifier === "suspended-corp") {
        return {
          tenantId: "tenant_susp_456",
          tenantSlug: "suspended-corp",
          status: "SUSPENDED",
        };
      }
      if (identifier === "maintenance-school") {
        return {
          tenantId: "tenant_maint_789",
          tenantSlug: "maintenance-school",
          status: "MAINTENANCE",
        };
      }
      return null;
    },
  };

  it("should resolve active tenant successfully from header or domain", async () => {
    const request = new Request("https://lms.acme.edu/api/v1/courses", {
      headers: {
        "x-tenant-slug": "acme",
      },
    });

    const tenant = await resolveCurrentTenant(request, mockResolver);

    expect(tenant).toBeDefined();
    expect(tenant.tenantId).toBe("tenant_acme_123");
    expect(tenant.tenantSlug).toBe("acme");
    expect(tenant.status).toBe("ACTIVE");
    expect(tenant.customDomain).toBe("lms.acme.edu");
  });

  it("should resolve tenant from Host header when x-tenant-slug header is missing", async () => {
    const request = new Request("https://lms.acme.edu/api/v1/courses", {
      headers: {
        host: "acme",
      },
    });

    const tenant = await resolveCurrentTenant(request, mockResolver);

    expect(tenant).toBeDefined();
    expect(tenant.tenantId).toBe("tenant_acme_123");
  });

  it("should throw NotFoundError if tenant is not found", async () => {
    const request = new Request("https://unknown.example.com/api/v1/courses", {
      headers: {
        "x-tenant-slug": "unknown-slug",
      },
    });

    await expect(resolveCurrentTenant(request, mockResolver)).rejects.toThrow(
      NotFoundError,
    );
  });

  it("should throw ForbiddenError if tenant is SUSPENDED", async () => {
    const request = new Request(
      "https://suspended.example.com/api/v1/courses",
      {
        headers: {
          "x-tenant-slug": "suspended-corp",
        },
      },
    );

    await expect(resolveCurrentTenant(request, mockResolver)).rejects.toThrow(
      ForbiddenError,
    );
  });

  it("should throw ForbiddenError if tenant is in MAINTENANCE", async () => {
    const request = new Request(
      "https://maintenance.example.com/api/v1/courses",
      {
        headers: {
          "x-tenant-slug": "maintenance-school",
        },
      },
    );

    await expect(resolveCurrentTenant(request, mockResolver)).rejects.toThrow(
      ForbiddenError,
    );
  });
});
