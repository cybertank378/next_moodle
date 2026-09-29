import { describe, expect, it } from "vitest";
import { generateSecureMoodlePassword } from "@/core/security/PasswordGenerator";

describe("generateSecureMoodlePassword", () => {
  it("generates a password with default length of 12", () => {
    const pwd = generateSecureMoodlePassword();
    expect(pwd).toHaveLength(12);
  });

  it("enforces minimum length of 8 characters even if lower length requested", () => {
    const pwd = generateSecureMoodlePassword(4);
    expect(pwd.length).toBeGreaterThanOrEqual(8);
  });

  it("satisfies Moodle password policy requirements (lowercase, uppercase, digit, symbol)", () => {
    for (let i = 0; i < 20; i++) {
      const pwd = generateSecureMoodlePassword(12);
      expect(pwd).toMatch(/[a-z]/);
      expect(pwd).toMatch(/[A-Z]/);
      expect(pwd).toMatch(/[0-9]/);
      expect(pwd).toMatch(/[!@#$%&*?]/);
    }
  });

  it("generates distinct passwords on consecutive invocations", () => {
    const pwd1 = generateSecureMoodlePassword();
    const pwd2 = generateSecureMoodlePassword();
    expect(pwd1).not.toBe(pwd2);
  });
});
