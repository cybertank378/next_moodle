import { describe, expect, it } from "vitest";
import { cn, redirectByRole, resolveUserRole } from "@/libs/utils";

describe("libs/utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("px-2", "py-1")).toBe("px-2 py-1");
      expect(cn("px-2", false && "hidden", "py-1")).toBe("px-2 py-1");
      expect(cn("px-2", "px-4")).toBe("px-4");
    });
  });

  describe("resolveUserRole", () => {
    it("normalizes platform and tenant aliases", () => {
      expect(resolveUserRole("ADMIN")).toBe("ADMIN");
      expect(resolveUserRole("SUPERADMIN")).toBe("ADMIN");
      expect(resolveUserRole("TENANT")).toBe("TENANT");
      expect(resolveUserRole("TENANT_ADMIN")).toBe("TENANT");
      expect(resolveUserRole("TEACHER")).toBe("TENANT");
      expect(resolveUserRole("STUDENT")).toBe("STUDENT");
    });

    it("returns null for unsupported roles", () => {
      expect(resolveUserRole(null)).toBeNull();
      expect(resolveUserRole(undefined)).toBeNull();
      expect(resolveUserRole("GUEST")).toBeNull();
    });
  });

  describe("redirectByRole", () => {
    it.each([
      "ADMIN",
      "SUPERADMIN",
      "TENANT",
      "TENANT_ADMIN",
      "TEACHER",
      "STUDENT",
    ])("redirects authenticated role %s to /dashboard", (role) => {
      expect(redirectByRole(role)).toBe("/dashboard");
    });

    it("redirects unknown or null role to /login", () => {
      expect(redirectByRole(null)).toBe("/login");
      expect(redirectByRole(undefined)).toBe("/login");
      expect(redirectByRole("GUEST")).toBe("/login");
    });
  });
});
