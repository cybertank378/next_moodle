import { describe, expect, it } from "vitest";
import {
  generateRequestId,
  getOrGenerateRequestId,
} from "../../security/RequestId";

describe("RequestId", () => {
  it("generateRequestId should return valid UUIDv4 string", () => {
    const id = generateRequestId();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });

  it("getOrGenerateRequestId should use incoming x-request-id if present", () => {
    const req = new Request("http://localhost/test", {
      headers: { "x-request-id": "custom-uuid-1234" },
    });
    const id = getOrGenerateRequestId(req);
    expect(id).toBe("custom-uuid-1234");
  });

  it("getOrGenerateRequestId should generate new UUID if header missing", () => {
    const req = new Request("http://localhost/test");
    const id = getOrGenerateRequestId(req);
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });
});
