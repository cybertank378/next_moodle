import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const authSectionsDirectory = path.resolve(process.cwd(), "src/sections/auth");

function readAuthSection(relativePath: string): string {
  return fs.readFileSync(
    path.join(authSectionsDirectory, relativePath),
    "utf-8",
  );
}

describe("Architecture Guard: auth section and module boundary", () => {
  it("keeps the API-backed login form in an organism", () => {
    const loginForm = readAuthSection("organisms/LoginForm.tsx");

    expect(loginForm).toContain("@/modules/auth/presentation/hooks/useAuthApi");
    expect(
      fs.existsSync(
        path.join(authSectionsDirectory, "molecules/LoginForm.tsx"),
      ),
    ).toBe(false);
  });

  it("does not present unsupported auth operations as completed", () => {
    const unsupportedForms = [
      "organisms/RegisterForm.tsx",
      "organisms/ForgetPasswordForm.tsx",
      "organisms/ChangePasswordForm.tsx",
      "organisms/ResetPasswordForm.tsx",
      "organisms/VerifyEmailForm.tsx",
    ];

    for (const form of unsupportedForms) {
      expect(readAuthSection(form)).toContain(
        "@/sections/auth/organisms/AuthFeatureUnavailable",
      );
    }
  });
});
