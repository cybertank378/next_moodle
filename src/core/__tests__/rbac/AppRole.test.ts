import { describe, expect, it } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";

describe("AppRole", () => {
  it("should define exactly ADMIN, TENANT, and STUDENT roles", () => {
    expect(AppRole.ADMIN).toBe("ADMIN");
    expect(AppRole.TENANT).toBe("TENANT");
    expect(AppRole.STUDENT).toBe("STUDENT");
  });

  it("should contain exactly 3 roles", () => {
    const roles = Object.values(AppRole);
    expect(roles).toEqual(["ADMIN", "TENANT", "STUDENT"]);
  });
});
