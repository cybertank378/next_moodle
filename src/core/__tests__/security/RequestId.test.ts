import { describe, expect, it } from "vitest";
import { generateRequestId, resolveRequestId } from "@/core/security/RequestId";

describe("RequestId", () => {
  it("should generate a valid request ID starting with req_", () => {
    const id = generateRequestId();
    expect(id).toMatch(/^req_[a-zA-Z0-9_-]+$/);
  });

  it("should resolve existing x-request-id from Request headers", () => {
    const request = new Request("http://localhost:3000/api/v1/health", {
      headers: {
        "x-request-id": "client-provided-req-id-123",
      },
    });

    const id = resolveRequestId(request);
    expect(id).toBe("client-provided-req-id-123");
  });

  it("should generate new request ID if header is missing", () => {
    const request = new Request("http://localhost:3000/api/v1/health");
    const id = resolveRequestId(request);

    expect(id).toMatch(/^req_[a-zA-Z0-9_-]+$/);
  });
});
