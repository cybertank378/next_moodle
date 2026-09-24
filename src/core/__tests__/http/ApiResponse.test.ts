import { describe, expect, it } from "vitest";
import { ApiResponse } from "@/core/http/ApiResponse";
import { HttpStatus } from "@/core/http/HttpStatus";

describe("ApiResponse", () => {
  it("should create a formatted success response", () => {
    const data = { id: "user_123", name: "John Doe" };
    const meta = { requestId: "req_test123" };
    const response = ApiResponse.success(data, meta, HttpStatus.OK);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data,
      meta,
    });
  });

  it("should create a formatted error response without raw stack trace", () => {
    const meta = { requestId: "req_err456" };
    const response = ApiResponse.error(
      "RESOURCE_NOT_FOUND",
      "Item does not exist",
      HttpStatus.NOT_FOUND,
      { entity: "quiz", id: "10" },
      meta,
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      error: {
        code: "RESOURCE_NOT_FOUND",
        message: "Item does not exist",
        details: { entity: "quiz", id: "10" },
      },
      meta,
    });
  });
});
