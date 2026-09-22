import { describe, expect, it } from "vitest";
import { ValidationError } from "@/core/errors/ValidationError";
import {
  type TenantContext,
  validateTenantContext,
} from "@/core/tenant/TenantContext";

describe("TenantContext", () => {
  it("should validate and return a valid TenantContext", () => {
    const validContext: TenantContext = {
      tenantId: "tenant-abc",
      tenantSlug: "acme-school",
      status: "ACTIVE",
      customDomain: "cbt.acme.edu",
    };

    const validated = validateTenantContext(validContext);
    expect(validated).toEqual(validContext);
  });

  it("should throw ValidationError if tenant context is null or undefined", () => {
    expect(() => validateTenantContext(null)).toThrowError(ValidationError);
    expect(() => validateTenantContext(undefined)).toThrowError(
      ValidationError,
    );
  });

  it("should throw ValidationError if tenantId is missing or empty", () => {
    expect(() =>
      validateTenantContext({
        tenantId: "",
        tenantSlug: "acme",
        status: "ACTIVE",
      }),
    ).toThrowError(ValidationError);
  });

  it("should throw ValidationError if tenantSlug is missing or empty", () => {
    expect(() =>
      validateTenantContext({
        tenantId: "t-1",
        tenantSlug: "",
        status: "ACTIVE",
      }),
    ).toThrowError(ValidationError);
  });

  it("should throw ValidationError if status is invalid", () => {
    expect(() =>
      validateTenantContext({
        tenantId: "t-1",
        tenantSlug: "acme",
        status: "INVALID_STATUS",
      }),
    ).toThrowError(ValidationError);
  });
});
