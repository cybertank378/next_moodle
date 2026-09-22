import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Architecture Guard: Route Groups & Directory Layout", () => {
  it("should have required architectural root directories", () => {
    const requiredDirs = [
      "src/core",
      "src/modules",
      "src/sections",
      "src/shared-ui",
      "src/shared-ui/component",
    ];

    for (const dir of requiredDirs) {
      const dirPath = path.resolve(process.cwd(), dir);
      expect(
        fs.existsSync(dirPath),
        `Required root directory missing: ${dir}`,
      ).toBe(true);
    }
  });

  it("should have bootstrap placeholder route groups (public) and (protected)", () => {
    // Issue 01 mandates (public) and (protected) as the initial bootstrap
    // route-group boundary. Issue 03 (RBAC) further splits (protected) into
    // (admin)/(tenant)/(student) but the bootstrap placeholders must remain.
    const requiredBootstrapDirs = ["src/app/(public)", "src/app/(protected)"];

    for (const dir of requiredBootstrapDirs) {
      const dirPath = path.resolve(process.cwd(), dir);
      expect(
        fs.existsSync(dirPath),
        `Bootstrap placeholder route group missing: ${dir} — Issue 01 requires both (public) and (protected) to exist as the foundation boundary.`,
      ).toBe(true);
    }
  });

  it("should have required App Router role route groups with layout files", () => {
    const requiredLayouts = [
      "src/app/(auth)/layout.tsx",
      "src/app/(admin)/admin/layout.tsx",
      "src/app/(tenant)/tenant/layout.tsx",
      "src/app/(student)/student/layout.tsx",
    ];

    for (const layout of requiredLayouts) {
      const layoutPath = path.resolve(process.cwd(), layout);
      expect(
        fs.existsSync(layoutPath),
        `Required route group layout missing: ${layout}`,
      ).toBe(true);
    }
  });
});
