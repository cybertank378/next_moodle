import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import { ROUTES } from "@/libs/routes";

// Mocks
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  usePathname: () => "/test",
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/modules/auth/server/getCurrentUser", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/shared-ui/layout/AppLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

import { redirect } from "next/navigation";
import AdminLayout from "@/app/(admin)/admin/layout";
import StudentLayout from "@/app/(student)/student/layout";
import TenantLayout from "@/app/(tenant)/tenant/layout";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

describe("Server Layout Guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("AdminLayout", () => {
    it("should redirect to login if actor is unauthenticated", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce(null);

      await AdminLayout({ children: "content" });

      expect(redirect).toHaveBeenCalledWith(ROUTES.AUTH.LOGIN);
    });

    it("should redirect to 403 if actor role is not ADMIN", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        userId: "u-1",
        username: "student",
        role: AppRole.STUDENT,
        tenantId: "t-1",
      });

      await AdminLayout({ children: "content" });

      expect(redirect).toHaveBeenCalledWith(ROUTES.FORBIDDEN);
    });

    it("should render layout if actor role is ADMIN", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        userId: "admin-1",
        username: "admin",
        role: AppRole.ADMIN,
        tenantId: "",
      });

      const res = await AdminLayout({ children: "content" });
      expect(redirect).not.toHaveBeenCalled();
      expect(res).toBeDefined();
    });
  });

  describe("TenantLayout", () => {
    it("should redirect to login if actor is unauthenticated", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce(null);

      await TenantLayout({ children: "content" });

      expect(redirect).toHaveBeenCalledWith(ROUTES.AUTH.LOGIN);
    });

    it("should redirect to 403 if actor role is not TENANT", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        userId: "s-1",
        username: "student",
        role: AppRole.STUDENT,
        tenantId: "t-1",
      });

      await TenantLayout({ children: "content" });

      expect(redirect).toHaveBeenCalledWith(ROUTES.FORBIDDEN);
    });

    it("should redirect to 403 if TENANT actor has no tenantId", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        userId: "t-1",
        username: "tenant",
        role: AppRole.TENANT,
        tenantId: "",
      });

      await TenantLayout({ children: "content" });

      expect(redirect).toHaveBeenCalledWith(ROUTES.FORBIDDEN);
    });

    it("should render layout if actor is TENANT with valid tenantId", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        userId: "t-1",
        username: "tenant",
        role: AppRole.TENANT,
        tenantId: "tenant-123",
      });

      const res = await TenantLayout({ children: "content" });
      expect(redirect).not.toHaveBeenCalled();
      expect(res).toBeDefined();
    });
  });

  describe("StudentLayout", () => {
    it("should redirect to login if actor is unauthenticated", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce(null);

      await StudentLayout({ children: "content" });

      expect(redirect).toHaveBeenCalledWith(ROUTES.AUTH.LOGIN);
    });

    it("should redirect to 403 if actor role is not STUDENT", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        userId: "t-1",
        username: "tenant",
        role: AppRole.TENANT,
        tenantId: "tenant-123",
      });

      await StudentLayout({ children: "content" });

      expect(redirect).toHaveBeenCalledWith(ROUTES.FORBIDDEN);
    });

    it("should redirect to 403 if STUDENT actor has no tenantId", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        userId: "s-1",
        username: "student",
        role: AppRole.STUDENT,
        tenantId: "",
      });

      await StudentLayout({ children: "content" });

      expect(redirect).toHaveBeenCalledWith(ROUTES.FORBIDDEN);
    });

    it("should render layout if actor is STUDENT with valid tenantId", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        userId: "s-1",
        username: "student",
        role: AppRole.STUDENT,
        tenantId: "tenant-123",
      });

      const res = await StudentLayout({ children: "content" });
      expect(redirect).not.toHaveBeenCalled();
      expect(res).toBeDefined();
    });
  });
});
