import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("auth module structure", () => {
  it("uses the repository boundary", () => {
    const root = resolve(process.cwd(), "src/modules/auth/infrastructure");
    expect(existsSync(resolve(root, "repo/AuthRepository.ts"))).toBe(true);
  });
});
