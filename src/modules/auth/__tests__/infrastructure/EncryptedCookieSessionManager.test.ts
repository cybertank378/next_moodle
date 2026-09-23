import { describe, expect, it } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import { EncryptedCookieSessionManager } from "@/modules/auth/infrastructure/providers/EncryptedCookieSessionManager";

describe("EncryptedCookieSessionManager", () => {
  const manager = new EncryptedCookieSessionManager({
    secret: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    now: () => new Date("2026-09-23T07:00:00.000Z"),
  });

  const actor = {
    id: "moodle:tenant-1:42",
    userId: "moodle:tenant-1:42",
    username: "student01",
    role: AppRole.STUDENT,
    tenantId: "tenant-1",
    moodleUserId: 42,
    permissions: ["student.dashboard.read"],
  };

  it("encrypts the raw Moodle token inside a non-readable session cookie", async () => {
    const session = await manager.createSession({
      actor,
      moodleToken: "raw-moodle-token",
    });

    expect(session.cookieValue).not.toContain("raw-moodle-token");
    expect(session.cookieValue).not.toContain("student01");

    const resolved = await manager.resolveSession(session.cookieValue);
    expect(resolved.actor).toEqual(actor);
    expect(resolved.moodleToken).toBe("raw-moodle-token");
  });

  it("rejects expired sessions", async () => {
    const shortLived = new EncryptedCookieSessionManager({
      secret:
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      now: () => new Date("2026-09-23T07:00:00.000Z"),
      ttlSeconds: 1,
    });
    const session = await shortLived.createSession({
      actor,
      moodleToken: "raw-moodle-token",
    });

    const expiredReader = new EncryptedCookieSessionManager({
      secret:
        "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      now: () => new Date("2026-09-23T07:00:02.000Z"),
      ttlSeconds: 1,
    });

    await expect(
      expiredReader.resolveSession(session.cookieValue),
    ).rejects.toThrow("Session has expired");
  });
});
