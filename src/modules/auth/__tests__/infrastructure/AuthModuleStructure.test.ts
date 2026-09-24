import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("auth module structure", () => {
  it("uses the repository boundary and no longer contains legacy auth providers", () => {
    const root = resolve(process.cwd(), "src/modules/auth/infrastructure");
    expect(existsSync(resolve(root, "repo/AuthRepository.ts"))).toBe(true);
    expect(existsSync(resolve(root, "providers"))).toBe(false);
  });
});
