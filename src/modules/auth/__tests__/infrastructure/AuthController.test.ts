import { describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import { AuthController } from "@/modules/auth/infrastructure/http/AuthController";

describe("AuthController", () => {
  it("sets an HttpOnly app session cookie and never returns the raw Moodle token", async () => {
    const login = vi.fn().mockResolvedValue({
      actor: {
        id: "moodle:tenant-1:42",
        userId: "moodle:tenant-1:42",
        username: "student01",
        role: AppRole.STUDENT,
        tenantId: "tenant-1",
        moodleUserId: 42,
        permissions: ["student.dashboard.read"],
      },
      sessionCookie: {
        name: "session_token",
        value: "encrypted-app-session",
        expiresAt: new Date("2026-09-23T08:00:00.000Z"),
      },
    });
    const controller = new AuthController({
      login: { execute: login },
      getCurrentSession: { execute: vi.fn() },
      logout: { execute: vi.fn() },
      logoutAll: { execute: vi.fn() },
      refresh: { execute: vi.fn() },
    });

    const response = await controller.login(
      new Request("https://app.example.test/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: "student01",
          password: "secret-password",
        }),
      }),
    );
    const body = await response.json();

    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(JSON.stringify(body)).not.toContain("raw-moodle-token");
    expect(body.data.actor.username).toBe("student01");
    expect(login).toHaveBeenCalledWith({
      tenant: "app.example.test",
      username: "student01",
      password: "secret-password",
    });
  });
});
