import { describe, expect, it } from "vitest";
import { AppError } from "@/core/errors/AppError";
import { ConflictError } from "@/core/errors/ConflictError";
import { DomainError } from "@/core/errors/DomainError";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { InfrastructureError } from "@/core/errors/InfrastructureError";
import { MoodleError } from "@/core/errors/MoodleError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { ValidationError } from "@/core/errors/ValidationError";

describe("AppError Hierarchy", () => {
  it("should instantiate DomainError with 400 status code", () => {
    const error = new DomainError("Invalid domain state");
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe("DOMAIN_ERROR");
    expect(error.message).toBe("Invalid domain state");
  });

  it("should instantiate ValidationError with 400 status code and details", () => {
    const details = [{ field: "email", message: "Invalid format" }];
    const error = new ValidationError("Validation failed", details);
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.details).toEqual(details);
  });

  it("should instantiate UnauthorizedError with 401 status code", () => {
    const error = new UnauthorizedError();
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe("UNAUTHORIZED");
  });

  it("should instantiate ForbiddenError with 403 status code", () => {
    const error = new ForbiddenError("Cross-tenant access forbidden");
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe("FORBIDDEN");
  });

  it("should instantiate NotFoundError with 404 status code", () => {
    const error = new NotFoundError("Quiz not found");
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
  });

  it("should instantiate ConflictError with 409 status code", () => {
    const error = new ConflictError("Domain already registered");
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(409);
    expect(error.code).toBe("CONFLICT");
  });

  it("should instantiate InfrastructureError with 500 status code", () => {
    const error = new InfrastructureError("Database connection lost");
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe("INFRASTRUCTURE_ERROR");
  });

  it("should instantiate MoodleError with 502 status code and errorcode", () => {
    const error = new MoodleError("invalidtoken", "Invalid token supplied");
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(502);
    expect(error.code).toBe("MOODLE_ERROR");
    expect(error.moodleErrorCode).toBe("invalidtoken");
  });
});
