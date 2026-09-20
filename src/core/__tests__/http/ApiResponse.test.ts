import { describe, expect, it } from "vitest";
import { ApiResponse } from "@/core/http/ApiResponse";

describe("ApiResponse", () => {
  it("should create standardized success response without meta", () => {
    const payload = { id: 1, name: "Sample" };
    const res = ApiResponse.success(payload);

    expect(res).toEqual({
      success: true,
      data: payload,
    });
  });

  it("should create standardized success response with meta", () => {
    const payload = ["item1", "item2"];
    const meta = { total: 2, page: 1 };
    const res = ApiResponse.success(payload, meta);

    expect(res).toEqual({
      success: true,
      data: payload,
      meta,
    });
  });

  it("should create standardized failure response", () => {
    const res = ApiResponse.failure(
      "NOT_FOUND",
      "Data tidak ditemukan.",
      undefined,
      "req_123",
    );

    expect(res).toEqual({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Data tidak ditemukan.",
      },
      requestId: "req_123",
    });
  });

  it("should include details in failure response when provided", () => {
    const res = ApiResponse.failure("VALIDATION_ERROR", "Invalid input", {
      field: "email",
    });

    expect(res).toEqual({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        details: { field: "email" },
      },
    });
  });
});
