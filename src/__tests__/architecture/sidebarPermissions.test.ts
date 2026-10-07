import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { UserRole } from "@/libs/enums";
import { canAccess, PERMISSIONS } from "@/libs/permissions";
import AppSidebar, { getSidebarMenu } from "@/shared-ui/layout/AppSidebar";

describe("Sidebar Navigation and Permission Guards", () => {
  it("renders the on-dark horizontal Aksaventra logo on desktop and mobile drawer", () => {
    const html = renderToStaticMarkup(
      createElement(AppSidebar, {
        mobileOpen: true,
        onClose: vi.fn(),
        role: "ADMIN",
        username: "admin",
      }),
    );

    expect(html.match(/<img[^>]*aksaventra-logo-on-dark\.svg/g)).toHaveLength(
      2,
    );
    expect(html).not.toContain(">Moodle<");
  });

  it("renders the student's tenant name without a hardcoded school", () => {
    const html = renderToStaticMarkup(
      createElement(AppSidebar, {
        institutionName: "SMA Negeri 2 Bandung",
        mobileOpen: false,
        onClose: vi.fn(),
        role: "STUDENT",
        username: "siswa",
      }),
    );

    expect(html).toContain("SMA Negeri 2 Bandung");
    expect(html).not.toContain("SMP Negeri 1 Jakarta");
    expect(html).not.toContain("Jenjang Sekolah • SMP");
  });

  describe("getSidebarMenu configuration", () => {
    it("configures ADMIN sidebar with tenant management permissions", () => {
      const menu = getSidebarMenu("ADMIN");
      expect(menu).toHaveLength(2);

      const mainGroup = menu.find((g) => g.label === "Menu Utama");
      expect(mainGroup).toBeDefined();

      const tenantItem = mainGroup?.items.find(
        (item) => item.label === "Manajemen Tenant",
      );
      expect(tenantItem).toBeDefined();
      expect(tenantItem?.permission).toBe(PERMISSIONS.TENANT_MANAGE);
    });

    it("configures TENANT sidebar with user and exam management permissions", () => {
      const menu = getSidebarMenu("TENANT");
      const mainGroup = menu.find((g) => g.label === "Menu Utama");
      expect(mainGroup).toBeDefined();

      const userGroup = mainGroup?.items.find(
        (item) => item.label === "Pengguna & Grup",
      );
      expect(userGroup).toBeDefined();
      expect(userGroup?.permission).toBe(PERMISSIONS.USER_MANAGE);

      const examGroup = mainGroup?.items.find(
        (item) => item.label === "Ujian & Hasil",
      );
      expect(examGroup).toBeDefined();
      expect(examGroup?.permission).toBe(PERMISSIONS.EXAM_MANAGE);
    });

    it("configures STUDENT sidebar with exam taking and own result permissions", () => {
      const menu = getSidebarMenu("STUDENT");
      const mainGroup = menu.find((g) => g.label === "Menu Utama");
      expect(mainGroup).toBeDefined();

      const examItem = mainGroup?.items.find(
        (item) => item.label === "Jadwal Ujian",
      );
      expect(examItem).toBeDefined();
      expect(examItem?.permission).toBe(PERMISSIONS.EXAM_TAKE);

      const resultItem = mainGroup?.items.find(
        (item) => item.label === "Hasil & Nilai",
      );
      expect(resultItem).toBeDefined();
      expect(resultItem?.permission).toBe(PERMISSIONS.RESULT_VIEW_OWN);
    });

    it("returns empty array for invalid or unknown role", () => {
      const menu = getSidebarMenu("UNKNOWN" as UserRole);
      expect(menu).toEqual([]);
    });
  });

  describe("canAccess permission checks", () => {
    it("allows ADMIN access to all permissions", () => {
      expect(canAccess("ADMIN", PERMISSIONS.TENANT_MANAGE)).toBe(true);
      expect(canAccess("ADMIN", PERMISSIONS.USER_MANAGE)).toBe(true);
      expect(canAccess("ADMIN", PERMISSIONS.EXAM_MANAGE)).toBe(true);
      expect(canAccess("ADMIN", PERMISSIONS.EXAM_TAKE)).toBe(true);
    });

    it("allows TENANT access only to institution management permissions", () => {
      expect(canAccess("TENANT", PERMISSIONS.USER_MANAGE)).toBe(true);
      expect(canAccess("TENANT", PERMISSIONS.EXAM_MANAGE)).toBe(true);
      expect(canAccess("TENANT", PERMISSIONS.RESULT_VIEW_ALL)).toBe(true);

      // Denies student-only and platform-admin permissions
      expect(canAccess("TENANT", PERMISSIONS.EXAM_TAKE)).toBe(false);
      expect(canAccess("TENANT", PERMISSIONS.RESULT_VIEW_OWN)).toBe(false);
    });

    it("allows STUDENT access only to student permissions", () => {
      expect(canAccess("STUDENT", PERMISSIONS.EXAM_TAKE)).toBe(true);
      expect(canAccess("STUDENT", PERMISSIONS.RESULT_VIEW_OWN)).toBe(true);

      // Denies management permissions
      expect(canAccess("STUDENT", PERMISSIONS.TENANT_MANAGE)).toBe(false);
      expect(canAccess("STUDENT", PERMISSIONS.USER_MANAGE)).toBe(false);
      expect(canAccess("STUDENT", PERMISSIONS.EXAM_MANAGE)).toBe(false);
      expect(canAccess("STUDENT", PERMISSIONS.RESULT_VIEW_ALL)).toBe(false);
    });

    it("denies access when role is missing", () => {
      expect(canAccess(null, PERMISSIONS.EXAM_TAKE)).toBe(false);
      expect(canAccess(undefined, PERMISSIONS.EXAM_TAKE)).toBe(false);
    });

    it("allows access when item does not require permission", () => {
      expect(canAccess("STUDENT", undefined)).toBe(true);
      expect(canAccess("TENANT", undefined)).toBe(true);
      expect(canAccess("ADMIN", undefined)).toBe(true);
    });
  });
});
