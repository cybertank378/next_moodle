import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import { ROUTES } from "@/libs/routes";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/modules/auth/server/getCurrentUser", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/shared-ui/layout/AppLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

import { redirect } from "next/navigation";
import ProtectedLayout from "@/app/(protected)/layout";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

describe("ProtectedLayout — unified authenticated application shell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated actors to login", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce(null);

    await ProtectedLayout({ children: "content" });

    expect(redirect).toHaveBeenCalledWith(ROUTES.AUTH.LOGIN);
  });

  it.each([
    [AppRole.ADMIN, "", "admin"],
    [AppRole.TENANT, "tenant-1", "tenant"],
    [AppRole.STUDENT, "tenant-1", "student"],
  ])("renders AppLayout for %s", async (role, tenantId, username) => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      userId: `${role.toLowerCase()}-1`,
      username,
      role,
      tenantId,
    });

    const result = await ProtectedLayout({ children: "content" });

    expect(redirect).not.toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result?.props).toMatchObject({
      children: "content",
      userRole: role,
      username,
    });
  });
});
