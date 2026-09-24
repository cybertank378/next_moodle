import { describe, expect, it } from "vitest";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { withApiHandler } from "@/core/http/withApiHandler";

describe("withApiHandler", () => {
  it("should return JSON success response and propagate x-request-id header", async () => {
    const handler = withApiHandler(async (_req, context) => {
      return {
        message: "hello world",
        resolvedRequestId: context.requestId,
      };
    });

    const request = new Request("http://localhost:3000/api/v1/test", {
      headers: {
        "x-request-id": "custom-req-id-789",
      },
    });

    const response = await handler(request);
    expect(response.status).toBe(200);
    expect(response.headers.get("x-request-id")).toBe("custom-req-id-789");

    const json = await response.json();
    expect(json).toEqual({
      success: true,
      data: {
        message: "hello world",
        resolvedRequestId: "custom-req-id-789",
      },
      meta: {
        requestId: "custom-req-id-789",
      },
    });
  });

  it("should handle thrown AppError and format error response with status code", async () => {
    const handler = withApiHandler(async () => {
      throw new NotFoundError("Quiz not found");
    });

    const request = new Request("http://localhost:3000/api/v1/quizzes/999", {
      headers: {
        "x-request-id": "err-req-123",
      },
    });

    const response = await handler(request);
    expect(response.status).toBe(404);
    expect(response.headers.get("x-request-id")).toBe("err-req-123");

    const json = await response.json();
    expect(json).toEqual({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Quiz not found",
      },
      meta: {
        requestId: "err-req-123",
      },
    });
  });

  it("should catch unexpected errors and return safe 500 without leaking stack traces", async () => {
    const handler = withApiHandler(async () => {
      throw new Error("Secret database credentials leak attempt");
    });

    const request = new Request("http://localhost:3000/api/v1/crash");
    const response = await handler(request);

    expect(response.status).toBe(500);
    expect(response.headers.get("x-request-id")).toMatch(/^req_/);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("INTERNAL_ERROR");
    expect(json.error.message).toBe("Internal server error");
    expect(json.error.stack).toBeUndefined();
    expect(json.meta.requestId).toBeDefined();
  });
});
