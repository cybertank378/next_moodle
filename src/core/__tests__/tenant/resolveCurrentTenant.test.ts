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
    status: "ACTIVE",
  };

  const inactiveTenant: TenantContext = {
    tenantId: "t-2",
    slug: "sekolah-b",
    status: "INACTIVE",
  };

  const mockResolver: TenantResolver = {
    resolve: async (input) => {
      if (input.identifier === "sekolah-a") return activeTenant;
      if (input.identifier === "sekolah-b") return inactiveTenant;
      return null;
    },
  };

  it("should return TenantContext for active tenant", async () => {
    const request = new Request("http://sekolah-a.exam.test/courses");
    const tenant = await resolveCurrentTenant(request, mockResolver);

    expect(tenant).toEqual(activeTenant);
  });

  it("should throw NotFoundError if tenant is not found", async () => {
    const request = new Request("http://unknown.exam.test/courses");
    await expect(resolveCurrentTenant(request, mockResolver)).rejects.toThrow(
      NotFoundError,
    );
  });

  it("should throw ForbiddenError if tenant is inactive", async () => {
    const request = new Request("http://sekolah-b.exam.test/courses");
    await expect(resolveCurrentTenant(request, mockResolver)).rejects.toThrow(
      ForbiddenError,
    );
  });
});
