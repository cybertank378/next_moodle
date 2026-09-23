import { describe, expect, it } from "vitest";
import { validateLoginRequest } from "@/modules/auth/domain/validators/AuthValidator";

describe("validateLoginRequest", () => {
  it("normalizes identifiers and rejects incomplete credentials", () => {
    expect(
      validateLoginRequest({
        tenant: " acme ",
        username: " student01 ",
        password: "secret",
      }),
    ).toEqual({ tenant: "acme", username: "student01", password: "secret" });
    expect(() =>
      validateLoginRequest({
        tenant: "",
        username: "student01",
        password: "secret",
      }),
    ).toThrow("Tenant wajib diisi");
  });
});
