import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { validateServerEnvironment } from "../../../scripts/validate-env.mjs";

function environmentKeys(content: string): readonly string[] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line) => line.split("=", 1)[0]);
}

describe("Environment configuration contract", () => {
  it("documents every required secret for the Next.js and Moodle boundary", () => {
    const examplePath = path.resolve(process.cwd(), ".env.example");
    const keys = environmentKeys(fs.readFileSync(examplePath, "utf8"));

    expect(keys).toEqual(
      expect.arrayContaining([
        "DATABASE_URL",
        "AUTH_SESSION_SECRET",
        "TENANT_ENCRYPTION_MASTER_KEY",
      ]),
    );
    expect(keys).not.toContain("NEXTAUTH_SECRET");
    expect(keys).not.toContain("APP_SECRET");
  });

  it("fails preflight when a required server variable is absent or a placeholder", () => {
    expect(
      validateServerEnvironment({
        DATABASE_URL: "postgresql://localhost:5432/next_moodle",
        AUTH_SESSION_SECRET: "a".repeat(32),
        TENANT_ENCRYPTION_MASTER_KEY: "replace_with_64_hexadecimal_characters",
      }),
    ).toContain(
      "TENANT_ENCRYPTION_MASTER_KEY wajib berisi tepat 64 karakter heksadesimal.",
    );
  });
});
