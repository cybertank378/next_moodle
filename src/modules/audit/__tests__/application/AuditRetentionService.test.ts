import { describe, expect, it } from "vitest";
import {
  auditRetentionCutoff,
  requireAuditCleanupAdmin,
} from "@/modules/audit/application/services/AuditRetentionService";

describe("audit retention", () => {
  it("applies three calendar months", () => {
    expect(
      auditRetentionCutoff(new Date("2026-10-09T00:00:00Z")).toISOString(),
    ).toBe("2026-07-09T00:00:00.000Z");
  });
  it("allows admin", () => {
    expect(() =>
      requireAuditCleanupAdmin({
        userId: "a",
        username: "a",
        role: "ADMIN",
        tenantId: null,
      }),
    ).not.toThrow();
  });
  it.each(["TENANT", "TEACHER", "STUDENT", "PROCTOR"])("denies %s", (role) => {
    expect(() =>
      requireAuditCleanupAdmin({
        userId: "a",
        username: "a",
        role,
        tenantId: "t",
      }),
    ).toThrow();
  });
});
