import { describe, expect, it } from "vitest";
import { ValidationError } from "@/core/errors/ValidationError";
import { TenantSlug } from "../../domain/value-objects/TenantSlug";

describe("TenantSlug Value Object", () => {
  describe("Validation & Normalization", () => {
    it("should accept valid alphanumeric slugs", () => {
      const slug = TenantSlug.create("smpn29");
      expect(slug.value).toBe("smpn29");
      expect(slug.toString()).toBe("smpn29");
    });

    it("should accept valid slugs with hyphens", () => {
      const slug = TenantSlug.create("school-a");
      expect(slug.value).toBe("school-a");
    });

    it("should accept valid slugs with numbers and hyphens", () => {
      const slug = TenantSlug.create("school-2026");
      expect(slug.value).toBe("school-2026");
    });

    it("should normalize uppercase letters to lowercase", () => {
      const slug = TenantSlug.create("SMPN29");
      expect(slug.value).toBe("smpn29");
    });

    it("should trim surrounding whitespace before validating", () => {
      const slug = TenantSlug.create("  hangtuah2  ");
      expect(slug.value).toBe("hangtuah2");
    });

    it("should reject slugs with underscores", () => {
      expect(() => TenantSlug.create("school_a")).toThrow(ValidationError);
    });

    it("should reject slugs with spaces in between", () => {
      expect(() => TenantSlug.create("school a")).toThrow(ValidationError);
    });

    it("should reject slugs starting with dot or hyphen", () => {
      expect(() => TenantSlug.create(".school")).toThrow(ValidationError);
      expect(() => TenantSlug.create("-school")).toThrow(ValidationError);
    });

    it("should reject slugs ending with dot or hyphen", () => {
      expect(() => TenantSlug.create("school.")).toThrow(ValidationError);
      expect(() => TenantSlug.create("school-")).toThrow(ValidationError);
    });

    it("should reject empty or whitespace-only slug", () => {
      expect(() => TenantSlug.create("")).toThrow(ValidationError);
      expect(() => TenantSlug.create("   ")).toThrow(ValidationError);
    });

    it("isValid should return boolean correctly", () => {
      expect(TenantSlug.isValid("smpn29")).toBe(true);
      expect(TenantSlug.isValid("school-a")).toBe(true);
      expect(TenantSlug.isValid("school_a")).toBe(false);
      expect(TenantSlug.isValid("")).toBe(false);
    });
  });
});
