import { describe, expect, it } from "vitest";
import {
  resolveCurrentActor,
  type Session,
  type SessionResolver,
} from "@/core/auth";
import { ForbiddenError, UnauthorizedError } from "@/core/errors";
import type { TenantContext } from "@/core/tenant";

describe("resolveCurrentActor", () => {
  const currentTenant: TenantContext = {
    tenantId: "tenant-a",
    slug: "tenant-a-slug",
    status: "ACTIVE",
  };

  it("should return CurrentActor for valid active session", async () => {
    const validSession: Session = {
      id: "sess-1",
      userId: "usr-100",
      tenantId: "tenant-a",
      roles: ["student"],
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour ahead
    };

    const mockResolver: SessionResolver = {
      resolve: async () => validSession,
    };

    const request = new Request("http://localhost/api/test");
    const actor = await resolveCurrentActor(
      request,
      mockResolver,
      currentTenant,
    );

    expect(actor).toEqual({
      userId: "usr-100",
      tenantId: "tenant-a",
      roles: ["student"],
    });
  });

  it("should throw UnauthorizedError when session is missing", async () => {
    const mockResolver: SessionResolver = {
      resolve: async () => null,
    };

    const request = new Request("http://localhost/api/test");
    await expect(
      resolveCurrentActor(request, mockResolver, currentTenant),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("should throw UnauthorizedError when session is expired", async () => {
    const expiredSession: Session = {
      id: "sess-2",
      userId: "usr-100",
      tenantId: "tenant-a",
      roles: ["student"],
      expiresAt: new Date(Date.now() - 1000), // expired 1s ago
    };

    const mockResolver: SessionResolver = {
      resolve: async () => expiredSession,
    };

    const request = new Request("http://localhost/api/test");
    await expect(
      resolveCurrentActor(request, mockResolver, currentTenant),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("should throw ForbiddenError when session tenantId does not match current tenant", async () => {
    const foreignSession: Session = {
      id: "sess-3",
      userId: "usr-200",
      tenantId: "tenant-other",
      roles: ["student"],
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    };

    const mockResolver: SessionResolver = {
      resolve: async () => foreignSession,
    };

    const request = new Request("http://localhost/api/test");
    await expect(
      resolveCurrentActor(request, mockResolver, currentTenant),
    ).rejects.toThrow(ForbiddenError);
  });
});
