import { describe, expect, it } from "vitest";
import { cn, redirectByRole } from "@/libs/utils";

describe("libs/utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("px-2", "py-1")).toBe("px-2 py-1");
      expect(cn("px-2", false && "hidden", "py-1")).toBe("px-2 py-1");
      expect(cn("px-2", "px-4")).toBe("px-4");
    });
  });

  describe("redirectByRole", () => {
    it("should redirect ADMIN to /admin/dashboard", () => {
      expect(redirectByRole("ADMIN")).toBe("/admin/dashboard");
      expect(redirectByRole("SUPERADMIN")).toBe("/admin/dashboard");
    });

    it("should redirect TENANT to /tenant/dashboard", () => {
      expect(redirectByRole("TENANT")).toBe("/tenant/dashboard");
      expect(redirectByRole("TENANT_ADMIN")).toBe("/tenant/dashboard");
      expect(redirectByRole("TEACHER")).toBe("/tenant/dashboard");
    });

    it("should redirect STUDENT to /student/dashboard", () => {
      expect(redirectByRole("STUDENT")).toBe("/student/dashboard");
    });

    it("should redirect unknown or null role to /login", () => {
      expect(redirectByRole(null)).toBe("/login");
      expect(redirectByRole(undefined)).toBe("/login");
      expect(redirectByRole("GUEST")).toBe("/login");
    });
  });
});
