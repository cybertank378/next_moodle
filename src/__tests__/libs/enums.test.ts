import { TenantStatus } from "@libs/enums";
import { describe, expect, it } from "vitest";

describe("libs/enums", () => {
  it("should define TenantStatus with expected values", () => {
    expect(TenantStatus.ACTIVE).toBe("ACTIVE");
    expect(TenantStatus.MAINTENANCE).toBe("MAINTENANCE");
    expect(TenantStatus.SUSPENDED).toBe("SUSPENDED");
  });

  it("should contain all expected status keys", () => {
    const keys = Object.keys(TenantStatus);
    expect(keys).toContain("ACTIVE");
    expect(keys).toContain("MAINTENANCE");
    expect(keys).toContain("SUSPENDED");
  });
});
