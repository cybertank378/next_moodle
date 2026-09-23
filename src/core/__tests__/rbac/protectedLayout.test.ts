import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import { ROUTES } from "@/libs/routes";

// Mocks
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/modules/auth/server/getCurrentUser", () => ({
  getCurrentUser: vi.fn(),
}));

import { redirect } from "next/navigation";
import ProtectedLayout from "@/app/(protected)/layout";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

describe("ProtectedLayout — authentication shell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect unauthenticated user to login", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce(null);

    await ProtectedLayout({ children: "content" });

    expect(redirect).toHaveBeenCalledWith(ROUTES.AUTH.LOGIN);
    expect(redirect).toHaveBeenCalledTimes(1);
  });

  it("should NOT enforce role — ADMIN passes through", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      userId: "admin-1",
      username: "admin",
      role: AppRole.ADMIN,
      tenantId: "",
    });

    const result = await ProtectedLayout({ children: "content" });

    expect(redirect).not.toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it("should NOT enforce role — TENANT passes through", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      userId: "tenant-1",
      username: "tenant",
      role: AppRole.TENANT,
      tenantId: "t-123",
    });

    const result = await ProtectedLayout({ children: "content" });

    expect(redirect).not.toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it("should NOT enforce role — STUDENT passes through", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      userId: "student-1",
      username: "student",
      role: AppRole.STUDENT,
      tenantId: "t-123",
    });

    const result = await ProtectedLayout({ children: "content" });

    expect(redirect).not.toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
