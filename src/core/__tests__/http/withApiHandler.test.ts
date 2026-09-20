import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { withApiHandler } from "@/core/http/withApiHandler";

describe("withApiHandler", () => {
  it("should return standard success response and attach x-request-id", async () => {
    const handler = withApiHandler(async () => {
      return { message: "Hello World" };
    });

    const request = new NextRequest("http://localhost/api/test");
    const response = await handler(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("x-request-id")).toBeTruthy();

    const data = await response.json();
    expect(data).toEqual({
      success: true,
      data: { message: "Hello World" },
    });
  });

  it("should catch AppError and format mapped error response", async () => {
    const handler = withApiHandler(async () => {
      throw new NotFoundError("Resource not found");
    });

    const request = new NextRequest("http://localhost/api/test");
    const response = await handler(request);

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("NOT_FOUND");
    expect(data.error.message).toBe("Resource not found");
    expect(data.requestId).toBeTruthy();
  });

  it("should catch unexpected error, sanitize it to 500, and include requestId", async () => {
    const handler = withApiHandler(async () => {
      throw new Error("Secret DB crash");
    });

    const request = new NextRequest("http://localhost/api/test");
    const response = await handler(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("INTERNAL_SERVER_ERROR");
    expect(data.error.message).toBe("Terjadi kesalahan pada server.");
    expect(data.requestId).toBeTruthy();
  });

  it("should preserve incoming x-request-id when valid", async () => {
    const customReqId = "custom-req-uuid-999";
    const handler = withApiHandler(async () => ({ ok: true }));

    const request = new NextRequest("http://localhost/api/test", {
      headers: { "x-request-id": customReqId },
    });
    const response = await handler(request);

    expect(response.headers.get("x-request-id")).toBe(customReqId);
  });
});
