import { describe, expect, it } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";

describe("AppRole", () => {
  it("should define ADMIN, TENANT, STUDENT, and TEACHER roles", () => {
    expect(AppRole.ADMIN).toBe("ADMIN");
    expect(AppRole.TENANT).toBe("TENANT");
    expect(AppRole.STUDENT).toBe("STUDENT");
    expect(AppRole.TEACHER).toBe("TEACHER");
  });

  it("should contain exactly 4 roles", () => {
    const roles = Object.values(AppRole);
    expect(roles).toEqual(["ADMIN", "TENANT", "STUDENT", "TEACHER"]);
  });
});
