import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { resolveCurrentTenant } from "@/core/tenant/resolveCurrentTenant";
import type { TenantContext } from "@/core/tenant/TenantContext";
import type { TenantResolver } from "@/core/tenant/TenantResolver";

describe("resolveCurrentTenant", () => {
  const activeTenant: TenantContext = {
    tenantId: "t-1",
    slug: "sekolah-a",
    name: "Sekolah A",
    status: "ACTIVE",
  };

  const inactiveTenant: TenantContext = {
    tenantId: "t-2",
    slug: "sekolah-b",
    name: "Sekolah B",
    status: "INACTIVE",
  };

  const suspendedTenant: TenantContext = {
    tenantId: "t-3",
    slug: "sekolah-c",
    name: "Sekolah C",
    status: "SUSPENDED",
  };

  const mockResolver: TenantResolver = {
    resolve: async (input) => {
      if (input.identifier === "sekolah-a") return activeTenant;
      if (input.identifier === "sekolah-b") return inactiveTenant;
      if (input.identifier === "sekolah-c") return suspendedTenant;
      if (input.identifier === "smpn29") {
        return {
          tenantId: "t-29",
          slug: "smpn29",
          name: "SMPN 29",
          status: "ACTIVE",
        };
      }
      return null;
    },
  };

  it("should return TenantContext for active tenant", async () => {
    const request = new Request("http://sekolah-a.exam.test/courses");
    const tenant = await resolveCurrentTenant(request, mockResolver);

    expect(tenant).toEqual(activeTenant);
  });

  it("should strip port from host (e.g. :3000)", async () => {
    const request = new Request(
      "http://smpn29.exam.example.com:3000/api/courses",
    );
    const tenant = await resolveCurrentTenant(request, mockResolver);

    expect(tenant.slug).toBe("smpn29");
  });

  it("should normalize uppercase hostname to lowercase", async () => {
    const request = new Request("http://SMPN29.EXAM.EXAMPLE.COM/api/courses");
    const tenant = await resolveCurrentTenant(request, mockResolver);

    expect(tenant.slug).toBe("smpn29");
  });

  it("should resolve localhost subdomain (e.g. smpn29.localhost:3000)", async () => {
    const request = new Request("http://smpn29.localhost:3000/");
    const tenant = await resolveCurrentTenant(request, mockResolver);

    expect(tenant.slug).toBe("smpn29");
  });

  it("should respect x-forwarded-host header", async () => {
    const request = new Request("http://internal-gateway:8080/", {
      headers: {
        "x-forwarded-host": "smpn29.exam.example.com",
      },
    });
    const tenant = await resolveCurrentTenant(request, mockResolver);

    expect(tenant.slug).toBe("smpn29");
  });

  it("should throw NotFoundError if accessed on root domain without tenant", async () => {
    const request = new Request("http://exam.example.com/");
    await expect(resolveCurrentTenant(request, mockResolver)).rejects.toThrow(
      NotFoundError,
    );
  });

  it("should throw NotFoundError if tenant is not found in resolver", async () => {
    const request = new Request("http://unknown.exam.example.com/courses");
    await expect(resolveCurrentTenant(request, mockResolver)).rejects.toThrow(
      NotFoundError,
    );
  });

  it("should throw ForbiddenError with TENANT_INACTIVE if tenant is inactive", async () => {
    const request = new Request("http://sekolah-b.exam.test/courses");
    await expect(resolveCurrentTenant(request, mockResolver)).rejects.toThrow(
      ForbiddenError,
    );
  });

  it("should throw ForbiddenError with TENANT_SUSPENDED if tenant is suspended", async () => {
    const request = new Request("http://sekolah-c.exam.test/courses");
    await expect(resolveCurrentTenant(request, mockResolver)).rejects.toThrow(
      ForbiddenError,
    );
  });
});
