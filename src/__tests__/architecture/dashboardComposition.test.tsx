import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import { redirect } from "next/navigation";

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

import AdminDashboard from "@/app/(protected)/dashboard/component/AdminDashboard";
import StudentDashboard from "@/app/(protected)/dashboard/component/StudentDashboard";
import TenantDashboard from "@/app/(protected)/dashboard/component/TenantDashboard";
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
    expect(result?.type).toBe(AdminDashboard);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("selects TenantDashboard for TENANT", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      userId: "tenant-1",
      username: "tenant",
      role: AppRole.TENANT,
      tenantId: "tenant-1",
    });

    const result = await DashboardPage();
    expect(result?.type).toBe(TenantDashboard);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("selects TenantDashboard for TEACHER (mapped to TENANT)", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      userId: "teacher-1",
      username: "teacher01",
      role: "TEACHER" as unknown as AppRole,
      tenantId: "tenant-1",
    });

    const result = await DashboardPage();
    expect(result?.type).toBe(TenantDashboard);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("selects StudentDashboard for STUDENT", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      userId: "student-1",
      username: "student",
      role: AppRole.STUDENT,
      tenantId: "tenant-1",
    });

    const result = await DashboardPage();
    expect(result?.type).toBe(StudentDashboard);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to login when actor is not authenticated", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce(null);

    const result = await DashboardPage();
    expect(redirect).toHaveBeenCalledWith("/login");
    expect(result).toBeNull();
  });

  it("redirects to login when actor role cannot be resolved", async () => {
    vi.mocked(getCurrentUser).mockResolvedValueOnce({
      userId: "unknown-1",
      username: "unknown",
      role: "UNKNOWN_ROLE" as unknown as AppRole,
      tenantId: "tenant-1",
    });

    const result = await DashboardPage();
    expect(redirect).toHaveBeenCalledWith("/login");
    expect(result).toBeNull();
  });
});