import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("MoodleRestClient server-only boundary", () => {
  it("should contain server-only import at top of file", () => {
    const clientFilePath = path.resolve(
      process.cwd(),
      "src/core/moodle/MoodleRestClient.ts",
    );

    expect(fs.existsSync(clientFilePath)).toBe(true);

    const content = fs.readFileSync(clientFilePath, "utf-8");
    expect(content).toMatch(/import\s+["']server-only["']/);
  });
});
