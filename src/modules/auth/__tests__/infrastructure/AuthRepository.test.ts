import { describe, expect, it } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import { AuthRepository } from "@/modules/auth/infrastructure/repo/AuthRepository";

describe("AuthRepository", () => {
  const secret =
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  const actor = {
    id: "moodle:tenant-1:42",
    userId: "moodle:tenant-1:42",
    username: "student01",
    role: AppRole.STUDENT,
    tenantId: "tenant-1",
    moodleUserId: 42,
    permissions: ["student.dashboard.read"],
  };

  it("encrypts raw Moodle tokens and resolves the app session without exposing the token in its cookie", async () => {
    const repository = new AuthRepository({
      secret,
      now: () => new Date("2026-09-23T07:00:00.000Z"),
    });
    const session = await repository.createSession({
      actor,
      moodleToken: "raw-moodle-token",
    });
    expect(session.cookieValue).not.toContain("raw-moodle-token");
    expect(session.cookieValue).not.toContain("student01");
    await expect(
      repository.resolveSession(session.cookieValue),
    ).resolves.toEqual({ actor, moodleToken: "raw-moodle-token" });
  });

  it("rejects expired sessions", async () => {
    const creator = new AuthRepository({
      secret,
      now: () => new Date("2026-09-23T07:00:00.000Z"),
      ttlSeconds: 1,
    });
    const session = await creator.createSession({
      actor,
      moodleToken: "raw-moodle-token",
    });
    const reader = new AuthRepository({
      secret,
      now: () => new Date("2026-09-23T07:00:02.000Z"),
      ttlSeconds: 1,
    });
    await expect(reader.resolveSession(session.cookieValue)).rejects.toThrow(
      "Session has expired",
    );
  });
});
