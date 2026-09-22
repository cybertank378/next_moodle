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
      "src/components/ui",
    ];

    for (const dir of requiredDirs) {
      const dirPath = path.resolve(process.cwd(), dir);
      expect(
        fs.existsSync(dirPath),
        `Required root directory missing: ${dir}`,
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
