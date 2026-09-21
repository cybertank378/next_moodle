import { describe, expect, it } from "vitest";
import { ForbiddenError, NotFoundError } from "@/core/errors";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";

describe("mapErrorToHttpResponse", () => {
  it("should map AppError instance to corresponding status and formatted body", () => {
    const error = new NotFoundError("Student attempt not found");
    const response = mapErrorToHttpResponse(error, "req_123");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Student attempt not found",
      },
      meta: {
        requestId: "req_123",
      },
    });
  });

  it("should map ForbiddenError correctly with requestId in meta", () => {
    const error = new ForbiddenError("Tenant boundary violation");
    const response = mapErrorToHttpResponse(error, "req_456");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Tenant boundary violation",
      },
      meta: {
        requestId: "req_456",
      },
    });
  });

  it("should mask unknown/native exceptions as safe 500 INTERNAL_ERROR without leaking message or stack", () => {
    const rawException = new TypeError(
      "Cannot read property 'foo' of undefined at /app/secret.ts:42",
    );
    const response = mapErrorToHttpResponse(rawException, "req_secret");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error",
      },
      meta: {
        requestId: "req_secret",
      },
    });
  });
});
