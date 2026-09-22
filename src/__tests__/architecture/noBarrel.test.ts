import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Architecture Guard: Mandatory No-Barrel Policy", () => {
  function getFilesRecursively(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...getFilesRecursively(fullPath));
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }

    return files;
  }

  it("should not contain any project-authored index.ts or index.tsx barrel files in src/", () => {
    const srcDir = path.resolve(process.cwd(), "src");
    const allFiles = getFilesRecursively(srcDir);

    const barrelFiles = allFiles
      .filter((file) => {
        const base = path.basename(file);
        return base === "index.ts" || base === "index.tsx";
      })
      .map((file) => path.relative(process.cwd(), file).replace(/\\/g, "/"));

    expect(
      barrelFiles,
      `Project-authored barrel files detected in src/:\n${barrelFiles.join("\n")}\n\nPer AGENTS.md and planning-nextjs-fe-rbac.md, barrel index.ts/index.tsx files are strictly forbidden. Use concrete file path imports instead.`,
    ).toEqual([]);
  });

  it("should not contain wildcard re-exports (export * from) in any source file", () => {
    const srcDir = path.resolve(process.cwd(), "src");
    const allFiles = getFilesRecursively(srcDir).filter((file) =>
      /\.(ts|tsx)$/.test(file),
    );

    const wildcardFiles: string[] = [];

    for (const file of allFiles) {
      const content = fs.readFileSync(file, "utf-8");
      if (/export\s+\*\s+from\s+["']/.test(content)) {
        wildcardFiles.push(
          path.relative(process.cwd(), file).replace(/\\/g, "/"),
        );
      }
    }

    expect(
      wildcardFiles,
      `Wildcard re-exports (export * from) found in:\n${wildcardFiles.join("\n")}\n\nUse explicit concrete imports/exports instead.`,
    ).toEqual([]);
  });
});
