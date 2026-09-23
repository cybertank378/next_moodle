import { beforeEach, describe, expect, it, vi } from "vitest";
import { ROUTES } from "@/libs/routes";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/modules/auth/server/getCurrentUser", () => ({
  getCurrentUser: vi.fn(),
}));

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";
import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";

describe("requireDashboardRoles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated actor to login", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce(null);

    await requireDashboardRoles(["TENANT"]);

    expect(redirect).toHaveBeenCalledWith(ROUTES.AUTH.LOGIN);
  });

  it("allows an actor whose normalized role is permitted", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      userId: "tenant-1",
      username: "tenant",
      role: "TENANT",
      tenantId: "t-1",
    });

    const actor = await requireDashboardRoles(["TENANT"]);

    expect(redirect).not.toHaveBeenCalled();
    expect(actor?.userId).toBe("tenant-1");
  });

  it("normalizes TENANT_ADMIN to TENANT", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      userId: "tenant-admin-1",
      username: "tenant-admin",
      role: "TENANT_ADMIN",
      tenantId: "t-1",
    });

    const actor = await requireDashboardRoles(["TENANT"]);

    expect(redirect).not.toHaveBeenCalled();
    expect(actor?.userId).toBe("tenant-admin-1");
  });

  it("redirects authenticated actors without route access to dashboard", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      userId: "student-1",
      username: "student",
      role: "STUDENT",
      tenantId: "t-1",
    });

    await requireDashboardRoles(["ADMIN"]);

    expect(redirect).toHaveBeenCalledWith(ROUTES.DASHBOARD.ROOT);
  });
});
