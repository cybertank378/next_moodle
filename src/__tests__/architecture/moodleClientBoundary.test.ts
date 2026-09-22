import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Architecture Guard: Moodle Client & UI Boundary", () => {
  function getFilesRecursively(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
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

  it("MoodleRestClient must enforce server-only boundary", () => {
    const clientPath = path.resolve(
      process.cwd(),
      "src/core/moodle/MoodleRestClient.ts",
    );
    expect(fs.existsSync(clientPath)).toBe(true);

    const content = fs.readFileSync(clientPath, "utf-8");
    expect(content).toMatch(/import\s+["']server-only["']/);
  });

  it("Client components (with 'use client') must never import MoodleRestClient or MoodleClientFactory", () => {
    const srcDir = path.resolve(process.cwd(), "src");
    const allFiles = getFilesRecursively(srcDir).filter(
      (file) =>
        /\.(ts|tsx)$/.test(file) &&
        !file.includes("__tests__") &&
        !file.includes(".test.") &&
        !file.includes(".spec."),
    );

    const violatingFiles: string[] = [];

    for (const file of allFiles) {
      const content = fs.readFileSync(file, "utf-8");
      const isClientComponent = /["']use client["']/.test(content);
      if (isClientComponent) {
        if (
          content.includes("MoodleRestClient") ||
          content.includes("MoodleClientFactory")
        ) {
          violatingFiles.push(
            path.relative(process.cwd(), file).replace(/\\/g, "/"),
          );
        }
      }
    }

    expect(
      violatingFiles,
      `Client component imported server-only Moodle adapter:\n${violatingFiles.join("\n")}`,
    ).toEqual([]);
  });

  it("UI layer (src/sections and src/components) must not call Moodle URLs or Moodle wsfunctions directly", () => {
    const sectionsDir = path.resolve(process.cwd(), "src/sections");
    const componentsDir = path.resolve(process.cwd(), "src/components");

    const uiFiles = [
      ...getFilesRecursively(sectionsDir),
      ...getFilesRecursively(componentsDir),
    ].filter((file) => /\.(ts|tsx)$/.test(file));

    const violatingFiles: string[] = [];

    for (const file of uiFiles) {
      const content = fs.readFileSync(file, "utf-8");
      // Direct moodle calls or direct wsfunction names in UI
      if (
        content.includes("/webservice/rest/server.php") ||
        /["'](core_|mod_quiz_|local_examapi_)/.test(content)
      ) {
        violatingFiles.push(
          path.relative(process.cwd(), file).replace(/\\/g, "/"),
        );
      }
    }

    expect(
      violatingFiles,
      `UI files must not reference Moodle endpoints or wsfunctions directly:\n${violatingFiles.join("\n")}`,
    ).toEqual([]);
  });
});
