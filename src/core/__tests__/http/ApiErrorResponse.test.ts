import { describe, expect, it } from "vitest";
import type {
  ApiErrorResponse,
  ApiErrorResponseBody,
} from "@/core/http/ApiErrorResponse";
import { HttpStatus } from "@/core/http/HttpStatus";

describe("ApiErrorResponse", () => {
  it("should conform to ApiErrorResponseBody structure", () => {
    const errorBody: ApiErrorResponseBody = {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
        details: { field: "password" },
      },
      meta: { requestId: "req-123" },
    };

    expect(errorBody.success).toBe(false);
    expect(errorBody.error.code).toBe("UNAUTHORIZED");
    expect(errorBody.error.message).toBe("Invalid credentials");
    expect(errorBody.meta?.requestId).toBe("req-123");
  });

  it("should structure ApiErrorResponse with status code and body", () => {
    const errorResponse: ApiErrorResponse = {
      status: HttpStatus.FORBIDDEN,
      body: {
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Access denied",
        },
      },
    };

    expect(errorResponse.status).toBe(403);
    expect(errorResponse.body.success).toBe(false);
    expect(errorResponse.body.error.code).toBe("FORBIDDEN");
  });
});
