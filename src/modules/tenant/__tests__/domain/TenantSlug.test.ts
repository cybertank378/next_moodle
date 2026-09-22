import { describe, expect, it } from "vitest";
import { TenantSlug } from "@/modules/tenant/domain/TenantSlug";

describe("TenantSlug Value Object", () => {
  describe("valid slugs", () => {
    it("should accept a valid simple slug", () => {
      const result = TenantSlug.create("acme");
      expect(result.ok).toBe(true);
    });

    it("should accept a valid slug with hyphens", () => {
      const result = TenantSlug.create("acme-corp");
      expect(result.ok).toBe(true);
    });

    it("should accept a slug with numbers", () => {
      const result = TenantSlug.create("university-2024");
      expect(result.ok).toBe(true);
    });

    it("should normalize to lowercase", () => {
      const result = TenantSlug.create("ACME-Corp");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.slug.toString()).toBe("acme-corp");
      }
    });

    it("should trim whitespace before validating", () => {
      const result = TenantSlug.create("  acme  ");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.slug.toString()).toBe("acme");
      }
    });

    it("should accept slug with exactly 3 characters", () => {
      const result = TenantSlug.create("abc");
      expect(result.ok).toBe(true);
    });

    it("should accept slug with exactly 63 characters", () => {
      const slug = "a".repeat(63);
      const result = TenantSlug.create(slug);
      expect(result.ok).toBe(true);
    });
  });

  describe("invalid slugs", () => {
    it("should reject slug shorter than 3 characters", () => {
      const result = TenantSlug.create("ab");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain("minimal 3 karakter");
      }
    });

    it("should reject slug longer than 63 characters", () => {
      const slug = "a".repeat(64);
      const result = TenantSlug.create(slug);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain("maksimal 63 karakter");
      }
    });

    it("should reject slug with leading hyphen", () => {
      const result = TenantSlug.create("-acme");
      expect(result.ok).toBe(false);
    });

    it("should reject slug with trailing hyphen", () => {
      const result = TenantSlug.create("acme-");
      expect(result.ok).toBe(false);
    });

    it("should reject slug with consecutive hyphens", () => {
      const result = TenantSlug.create("acme--corp");
      expect(result.ok).toBe(false);
    });

    it("should reject slug with spaces", () => {
      const result = TenantSlug.create("acme corp");
      expect(result.ok).toBe(false);
    });

    it("should reject slug with uppercase after normalization fails pattern", () => {
      // Underscores are invalid
      const result = TenantSlug.create("acme_corp");
      expect(result.ok).toBe(false);
    });

    it("should reject slug with special characters", () => {
      const result = TenantSlug.create("acme@corp");
      expect(result.ok).toBe(false);
    });
  });

  describe("isValid static helper", () => {
    it("should return true for valid slug", () => {
      expect(TenantSlug.isValid("acme-corp")).toBe(true);
    });

    it("should return false for invalid slug", () => {
      expect(TenantSlug.isValid("-invalid")).toBe(false);
    });
  });

  describe("equality", () => {
    it("should consider two slugs with same value as equal", () => {
      const a = TenantSlug.create("acme");
      const b = TenantSlug.create("acme");
      if (a.ok && b.ok) {
        expect(a.slug.equals(b.slug)).toBe(true);
      }
    });

    it("should consider two different slugs as not equal", () => {
      const a = TenantSlug.create("acme");
      const b = TenantSlug.create("beta");
      if (a.ok && b.ok) {
        expect(a.slug.equals(b.slug)).toBe(false);
      }
    });
  });
});
