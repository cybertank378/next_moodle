// Files: src/sections/dashboard/__tests__/AdminDashboardComponents.test.tsx

import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Role, TenantStatus } from "@/libs/enums";
import { ROUTES } from "@/libs/routes";
import { getSidebarMenu } from "@/shared-ui/layout/AppSidebar";
import AdminTenantAttentionBanner, {
  calculateAttentionCount,
} from "@/sections/dashboard/molecules/AdminTenantAttentionBanner";
import RecentTenantsTable, {
  filterRecentTenants,
} from "@/sections/dashboard/molecules/RecentTenantsTable";
import type { RecentTenantResponseDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("Admin Dashboard & Sidebar Components (Issue #136)", () => {
  describe("calculateAttentionCount", () => {
    it("sums maintenance and suspended tenants", () => {
      const summary = { total: 24, active: 21, maintenance: 2, suspended: 1 };
      expect(calculateAttentionCount(summary)).toBe(3);
    });

    it("returns 0 when maintenance and suspended are zero", () => {
      const summary = { total: 24, active: 24, maintenance: 0, suspended: 0 };
      expect(calculateAttentionCount(summary)).toBe(0);
    });
  });

  describe("AdminTenantAttentionBanner", () => {
    it("renders attention alert with count and review link when count > 0", () => {
      const html = renderToStaticMarkup(
        <AdminTenantAttentionBanner
          summary={{ total: 24, active: 21, maintenance: 2, suspended: 1 }}
        />,
      );
      expect(html).toContain("3 tenant memerlukan perhatian");
      expect(html).toContain("Tinjau tenant dalam pemeliharaan atau ditangguhkan");
      expect(html).toContain("Tinjau tenant");
    });

    it("returns null when count is 0", () => {
      const html = renderToStaticMarkup(
        <AdminTenantAttentionBanner
          summary={{ total: 20, active: 20, maintenance: 0, suspended: 0 }}
        />,
      );
      expect(html).toBe("");
    });
  });

  describe("filterRecentTenants", () => {
    const sampleTenants: RecentTenantResponseDto[] = [
      {
        id: "t-1",
        name: "SMP Hangtuah 2 Jakarta",
        slug: "hangtuah2-jkt",
        status: TenantStatus.ACTIVE,
        createdAt: "2026-10-05T08:00:00Z",
      },
      {
        id: "t-2",
        name: "SMA Nusantara",
        slug: "sma-nusantara",
        status: TenantStatus.ACTIVE,
        createdAt: "2026-10-04T08:00:00Z",
      },
      {
        id: "t-3",
        name: "SMP Cendekia",
        slug: "smp-cendekia",
        status: TenantStatus.MAINTENANCE,
        createdAt: "2026-10-03T08:00:00Z",
      },
      {
        id: "t-4",
        name: "Sekolah Harapan",
        slug: "sekolah-harapan",
        status: TenantStatus.SUSPENDED,
        createdAt: "2026-10-02T08:00:00Z",
      },
    ];

    it("returns all items when search is empty and status is all", () => {
      const result = filterRecentTenants(sampleTenants, "", "all");
      expect(result).toHaveLength(4);
    });

    it("filters items by name or slug match", () => {
      const result = filterRecentTenants(sampleTenants, "hangtuah", "all");
      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("hangtuah2-jkt");
    });

    it("filters items by status", () => {
      const result = filterRecentTenants(sampleTenants, "", "MAINTENANCE");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("SMP Cendekia");
    });

    it("combines search query and status filter", () => {
      const result = filterRecentTenants(sampleTenants, "nusantara", "ACTIVE");
      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("sma-nusantara");

      const noMatch = filterRecentTenants(sampleTenants, "nusantara", "MAINTENANCE");
      expect(noMatch).toHaveLength(0);
    });
  });

  describe("RecentTenantsTable Component", () => {
    const sampleTenants: RecentTenantResponseDto[] = [
      {
        id: "t-1",
        name: "SMP Hangtuah 2 Jakarta",
        slug: "hangtuah2-jkt",
        status: TenantStatus.ACTIVE,
        createdAt: "2026-10-05T08:00:00Z",
      },
      {
        id: "t-2",
        name: "SMA Nusantara",
        slug: "sma-nusantara",
        status: TenantStatus.ACTIVE,
        createdAt: "2026-10-04T08:00:00Z",
      },
    ];

    it("renders table with headers, search input, status filter, and tenant rows", () => {
      const html = renderToStaticMarkup(
        <RecentTenantsTable tenants={sampleTenants} loading={false} />,
      );
      expect(html).toContain("Tenant Terbaru");
      expect(html).toContain("Sekolah dan organisasi yang baru bergabung");
      expect(html).toContain("Cari nama atau slug tenant");
      expect(html).toContain("SMP Hangtuah 2 Jakarta");
      expect(html).toContain("hangtuah2-jkt");
      expect(html).toContain("SMA Nusantara");
      expect(html).toContain("Detail");
    });
  });

  describe("Sidebar Navigation Menu for Role.ADMIN", () => {
    it("returns expected admin menus categorized into 2 groups", () => {
      const menu = getSidebarMenu(Role.ADMIN);
      expect(menu).toHaveLength(2);

      const [mainGroup, systemGroup] = menu;
      expect(mainGroup.label).toBe("Menu Utama");
      expect(mainGroup.items).toHaveLength(3);
      expect(mainGroup.items[0].label).toBe("Dashboard");
      expect(mainGroup.items[0].path).toBe(ROUTES.ADMIN.ROOT);
      expect(mainGroup.items[1].label).toBe("Manajemen Tenant");
      expect(mainGroup.items[1].path).toBe(ROUTES.ADMIN.TENANTS);
      expect(mainGroup.items[2].label).toBe("Pengelolaan Notifikasi");
      expect(mainGroup.items[2].path).toBe(ROUTES.ADMIN.NOTIFICATIONS);

      expect(systemGroup.label).toBe("Sistem & Audit");
      expect(systemGroup.items).toHaveLength(2);
      expect(systemGroup.items[0].label).toBe("Log Audit");
      expect(systemGroup.items[0].path).toBe(ROUTES.ADMIN.AUDIT);
      expect(systemGroup.items[1].label).toBe("Pengaturan");
      expect(systemGroup.items[1].path).toBe(ROUTES.ADMIN.SETTINGS);
    });

    it("preserves other roles without regression", () => {
      const tenantMenu = getSidebarMenu(Role.TENANT);
      expect(tenantMenu.length).toBeGreaterThan(0);

      const studentMenu = getSidebarMenu(Role.STUDENT);
      expect(studentMenu.length).toBeGreaterThan(0);

      const teacherMenu = getSidebarMenu(Role.TEACHER);
      expect(teacherMenu.length).toBeGreaterThan(0);
    });
  });
});
