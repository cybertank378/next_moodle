import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/modules/auth/server/getCurrentUser", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/app/(protected)/dashboard/component/AdminDashboard", () => ({
  default: () => "ADMIN_DASHBOARD",
}));

vi.mock("@/app/(protected)/dashboard/component/TenantDashboard", () => ({
  default: () => "TENANT_DASHBOARD",
}));

vi.mock("@/app/(protected)/dashboard/component/StudentDashboard", () => ({
  default: () => "STUDENT_DASHBOARD",
}));

import DashboardPage from "@/app/(protected)/dashboard/page";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

describe("DashboardPage role composition", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("selects AdminDashboard for ADMIN", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      userId: "admin-1",
      username: "admin",
      role: AppRole.ADMIN,
      tenantId: "",
    });

    const result = await DashboardPage();
    expect(result.type()).toBe("ADMIN_DASHBOARD");
  });

  it("selects TenantDashboard for TENANT", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      userId: "tenant-1",
      username: "tenant",
      role: AppRole.TENANT,
      tenantId: "tenant-1",
    });

    const result = await DashboardPage();
    expect(result.type()).toBe("TENANT_DASHBOARD");
  });

  it("selects StudentDashboard for STUDENT", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      userId: "student-1",
      username: "student",
      role: AppRole.STUDENT,
      tenantId: "tenant-1",
    });

    const result = await DashboardPage();
    expect(result.type()).toBe("STUDENT_DASHBOARD");
  });
});
