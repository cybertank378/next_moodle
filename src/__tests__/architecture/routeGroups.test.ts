import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function exists(relativePath: string): boolean {
  return fs.existsSync(path.resolve(process.cwd(), relativePath));
}

describe("Architecture Guard: consolidated App Router structure", () => {
  it("keeps the required architectural roots", () => {
    for (const dir of [
      "src/core",
      "src/modules",
      "src/sections",
      "src/shared-ui",
      "src/shared-ui/component",
    ]) {
      expect(exists(dir), `Required directory missing: ${dir}`).toBe(true);
    }
  });

  it("keeps the required App Router root files", () => {
    expect(exists("src/app/layout.tsx")).toBe(true);
    expect(exists("src/app/page.tsx")).toBe(true);
    expect(exists("src/app/favicon.ico")).toBe(true);
  });

  it("has one public and one protected UI route group", () => {
    expect(exists("src/app/(public)/layout.tsx")).toBe(true);
    expect(exists("src/app/(protected)/layout.tsx")).toBe(true);
  });

  it("contains the required public pages", () => {
    for (const page of [
      "src/app/(public)/login/page.tsx",
      "src/app/(public)/register/page.tsx",
      "src/app/(public)/forgot-password/page.tsx",
      "src/app/(public)/change-password/page.tsx",
    ]) {
      expect(exists(page), `Required public page missing: ${page}`).toBe(true);
    }
  });

  it("contains the unified dashboard and role dashboard components", () => {
    for (const file of [
      "src/app/(protected)/dashboard/page.tsx",
      "src/app/(protected)/dashboard/component/AdminDashboard.tsx",
      "src/app/(protected)/dashboard/component/TenantDashboard.tsx",
      "src/app/(protected)/dashboard/component/StudentDashboard.tsx",
    ]) {
      expect(exists(file), `Dashboard file missing: ${file}`).toBe(true);
    }
  });

  it("contains all required protected dashboard route pages", () => {
    const pages = [
      "src/app/(protected)/dashboard/tenants/page.tsx",
      "src/app/(protected)/dashboard/tenants/create/page.tsx",
      "src/app/(protected)/dashboard/tenants/[id]/page.tsx",
      "src/app/(protected)/dashboard/tenants/[id]/edit/page.tsx",
      "src/app/(protected)/dashboard/users/page.tsx",
      "src/app/(protected)/dashboard/users/create/page.tsx",
      "src/app/(protected)/dashboard/users/[id]/page.tsx",
      "src/app/(protected)/dashboard/users/[id]/edit/page.tsx",
      "src/app/(protected)/dashboard/enrolments/page.tsx",
      "src/app/(protected)/dashboard/enrolments/create/page.tsx",
      "src/app/(protected)/dashboard/enrolments/[id]/page.tsx",
      "src/app/(protected)/dashboard/enrolments/[id]/edit/page.tsx",
      "src/app/(protected)/dashboard/groups/page.tsx",
      "src/app/(protected)/dashboard/groups/create/page.tsx",
      "src/app/(protected)/dashboard/groups/[id]/page.tsx",
      "src/app/(protected)/dashboard/groups/[id]/edit/page.tsx",
      "src/app/(protected)/dashboard/courses/page.tsx",
      "src/app/(protected)/dashboard/courses/[id]/page.tsx",
      "src/app/(protected)/dashboard/questions/page.tsx",
      "src/app/(protected)/dashboard/questions/create/page.tsx",
      "src/app/(protected)/dashboard/questions/[id]/page.tsx",
      "src/app/(protected)/dashboard/questions/[id]/edit/page.tsx",
      "src/app/(protected)/dashboard/exams/page.tsx",
      "src/app/(protected)/dashboard/exams/create/page.tsx",
      "src/app/(protected)/dashboard/exams/[id]/page.tsx",
      "src/app/(protected)/dashboard/exams/[id]/edit/page.tsx",
      "src/app/(protected)/dashboard/exams/[id]/monitor/page.tsx",
      "src/app/(protected)/dashboard/exams/[id]/attempt/[attemptId]/page.tsx",
      "src/app/(protected)/dashboard/results/page.tsx",
      "src/app/(protected)/dashboard/results/[id]/page.tsx",
      "src/app/(protected)/dashboard/branding/page.tsx",
      "src/app/(protected)/dashboard/audit/page.tsx",
      "src/app/(protected)/dashboard/settings/page.tsx",
    ];

    for (const page of pages) {
      expect(exists(page), `Required dashboard page missing: ${page}`).toBe(
        true,
      );
    }
  });

  it("removes every legacy role/auth/forbidden route folder", () => {
    const legacyDirs = [
      // Legacy role route groups.
      "src/app/(admin)",
      "src/app/(tenant)",
      "src/app/(student)",
      "src/app/(auth)",

      // Legacy ungrouped role routes must not reappear.
      "src/app/admin",
      "src/app/tenant",
      "src/app/student",
      "src/app/auth",

      // Dashboard UI must live only below (protected).
      "src/app/dashboard",

      // Legacy standalone forbidden page.
      "src/app/403",
    ];

    for (const legacyDir of legacyDirs) {
      expect(
        exists(legacyDir),
        `Legacy App Router folder must not exist: ${legacyDir}. Protected UI belongs under src/app/(protected)/dashboard.`,
      ).toBe(false);
    }
  });

  it("keeps internal API routes outside the UI route consolidation", () => {
    expect(exists("src/app/api")).toBe(true);
    expect(exists("src/app/api/tenants/route.ts")).toBe(true);
  });

  it("removes obsolete route-group gitkeep placeholders", () => {
    expect(exists("src/app/(public)/.gitkeep")).toBe(false);
    expect(exists("src/app/(protected)/.gitkeep")).toBe(false);
  });
});
