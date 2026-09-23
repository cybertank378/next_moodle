import { describe, expect, it } from "vitest";
import {
  type CurrentActor,
  validateCurrentActor,
} from "@/core/auth/CurrentActor";
import { ValidationError } from "@/core/errors/ValidationError";
import { AppRole } from "@/core/rbac/AppRole";

describe("CurrentActor", () => {
  it("should validate and return a valid CurrentActor", () => {
    const validActor: CurrentActor = {
      userId: "usr-1",
      username: "john_doe",
      role: AppRole.STUDENT,
      tenantId: "tenant-123",
      moodleUserId: null,
      permissions: [],
      email: "john@example.com",
    };

    const validated = validateCurrentActor(validActor);
    expect(validated).toEqual({
      ...validActor,
      id: "usr-1",
      displayName: undefined,
    });
  });

  it("should throw ValidationError if actor is null or undefined", () => {
    expect(() => validateCurrentActor(null)).toThrowError(ValidationError);
    expect(() => validateCurrentActor(undefined)).toThrowError(ValidationError);
  });

  it("should throw ValidationError if userId is missing or empty", () => {
    expect(() =>
      validateCurrentActor({
        userId: "",
        username: "john",
        role: "STUDENT",
        tenantId: "tenant-1",
      }),
    ).toThrowError(ValidationError);
  });

  it("should throw ValidationError if role is missing or empty", () => {
    expect(() =>
      validateCurrentActor({
        userId: "usr-1",
        username: "john",
        role: "",
        tenantId: "tenant-1",
      }),
    ).toThrowError(ValidationError);
  });

  it("should throw ValidationError if tenantId is missing or empty for non-superadmin", () => {
    expect(() =>
      validateCurrentActor({
        userId: "usr-1",
        username: "john",
        role: "STUDENT",
        tenantId: "",
      }),
    ).toThrowError(ValidationError);
  });
});
