import { describe, expect, it } from "vitest";
import {
  ConflictError,
  ForbiddenError,
  InfrastructureError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../../errors";
import { mapErrorToHttpResponse } from "../../http/mapErrorToHttpResponse";

describe("mapErrorToHttpResponse", () => {
  const requestId = "test-req-id";

  it("should map ValidationError to 422 with original message and details", () => {
    const error = new ValidationError("Email tidak valid", { field: "email" });
    const { status, body } = mapErrorToHttpResponse(error, requestId);

    expect(status).toBe(422);
    expect(body).toEqual({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Email tidak valid",
        details: { field: "email" },
      },
      requestId,
    });
  });

  it("should map UnauthorizedError to 401", () => {
    const error = new UnauthorizedError("Sesi tidak valid");
    const { status, body } = mapErrorToHttpResponse(error, requestId);

    expect(status).toBe(401);
    expect(body.error.code).toBe("UNAUTHORIZED");
    expect(body.error.message).toBe("Sesi tidak valid");
  });

  it("should map ForbiddenError to 403", () => {
    const error = new ForbiddenError("Akses ditolak");
    const { status, body } = mapErrorToHttpResponse(error, requestId);

    expect(status).toBe(403);
    expect(body.error.code).toBe("FORBIDDEN");
  });

  it("should map NotFoundError to 404", () => {
    const error = new NotFoundError("Data tidak ditemukan");
    const { status, body } = mapErrorToHttpResponse(error, requestId);

    expect(status).toBe(404);
    expect(body.error.code).toBe("NOT_FOUND");
  });

  it("should map ConflictError to 409", () => {
    const error = new ConflictError("Data sudah ada");
    const { status, body } = mapErrorToHttpResponse(error, requestId);

    expect(status).toBe(409);
    expect(body.error.code).toBe("CONFLICT");
  });

  it("should map InfrastructureError to 502", () => {
    const error = new InfrastructureError("Koneksi gagal");
    const { status, body } = mapErrorToHttpResponse(error, requestId);

    expect(status).toBe(502);
    expect(body.error.code).toBe("INFRASTRUCTURE_ERROR");
  });

  it("should sanitize unknown errors to 500 with generic message", () => {
    const error = new Error("Database password leaked in raw message!");
    const { status, body } = mapErrorToHttpResponse(error, requestId);

    expect(status).toBe(500);
    expect(body).toEqual({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan pada server.",
      },
      requestId,
    });
    // Ensure raw message is NOT leaked
    expect(JSON.stringify(body)).not.toContain("password leaked");
  });
});
