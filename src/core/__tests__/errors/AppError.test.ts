import { describe, expect, it } from "vitest";
import {
  AppError,
  ConflictError,
  DomainError,
  ForbiddenError,
  InfrastructureError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/core/errors";

describe("Application Error Hierarchy", () => {
  it("ValidationError should have status 422 and default code VALIDATION_ERROR", () => {
    const error = new ValidationError("Invalid payload", { field: "username" });
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(422);
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.message).toBe("Invalid payload");
    expect(error.details).toEqual({ field: "username" });
  });

  it("UnauthorizedError should have status 401 and default code UNAUTHORIZED", () => {
    const error = new UnauthorizedError("Session expired");
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe("UNAUTHORIZED");
  });

  it("ForbiddenError should have status 403 and default code FORBIDDEN", () => {
    const error = new ForbiddenError("Permission denied");
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe("FORBIDDEN");
  });

  it("NotFoundError should have status 404 and default code NOT_FOUND", () => {
    const error = new NotFoundError("Resource missing");
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
  });

  it("ConflictError should have status 409 and default code CONFLICT", () => {
    const error = new ConflictError("Resource already exists");
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(409);
    expect(error.code).toBe("CONFLICT");
  });

  it("InfrastructureError should have status 502 and default code INFRASTRUCTURE_ERROR", () => {
    const error = new InfrastructureError("Upstream timeout");
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(502);
    expect(error.code).toBe("INFRASTRUCTURE_ERROR");
  });

  it("DomainError should have status 400 and default code DOMAIN_ERROR", () => {
    const error = new DomainError("Domain rule violated", "QUIZ_RULE_FAILED");
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe("QUIZ_RULE_FAILED");
  });

  it("should preserve error cause when provided", () => {
    const originalError = new Error("Database timeout");
    const error = new InfrastructureError("Gateway failure", {
      cause: originalError,
    });
    expect(error.cause).toBe(originalError);
  });
});
