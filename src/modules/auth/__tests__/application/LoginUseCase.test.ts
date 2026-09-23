import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import { LoginUseCase } from "@/modules/auth/application/usecases/LoginUseCase";
import type {
  AuthSessionManager,
  MoodleAuthProvider,
  TenantAuthResolver,
} from "@/modules/auth/domain/interfaces/AuthInterfaces";

describe("LoginUseCase", () => {
  const tenant = {
    tenantId: "tenant-1",
    slug: "acme",
    moodleUrl: "https://moodle.example.test",
    status: "ACTIVE" as const,
  };

  let tenantResolver: TenantAuthResolver;
  let moodleAuth: MoodleAuthProvider;
  let sessionManager: AuthSessionManager;

  beforeEach(() => {
    tenantResolver = {
      resolveLoginTenant: vi.fn().mockResolvedValue(tenant),
    };
    moodleAuth = {
      authenticateStudent: vi.fn().mockResolvedValue({
        token: "raw-moodle-token",
        siteInfo: {
          userId: 42,
          username: "student01",
          fullName: "Student One",
          email: "student@example.test",
        },
      }),
    };
    sessionManager = {
      createSession: vi.fn().mockResolvedValue({
        cookieValue: "encrypted-app-session",
        expiresAt: new Date("2026-09-23T08:00:00.000Z"),
      }),
      resolveSession: vi.fn(),
      refreshSession: vi.fn(),
      revokeSession: vi.fn(),
      revokeAllForActor: vi.fn(),
    };
  });

  it("resolves tenant, authenticates through Moodle, and creates an app session", async () => {
    const useCase = new LoginUseCase(
      tenantResolver,
      moodleAuth,
      sessionManager,
    );

    const result = await useCase.execute({
      tenant: "acme",
      username: "student01",
      password: "secret-password",
    });

    expect(tenantResolver.resolveLoginTenant).toHaveBeenCalledWith("acme");
    expect(moodleAuth.authenticateStudent).toHaveBeenCalledWith({
      tenant,
      username: "student01",
      password: "secret-password",
    });
    expect(sessionManager.createSession).toHaveBeenCalledWith(
      expect.objectContaining({
        actor: expect.objectContaining({
          id: "moodle:tenant-1:42",
          role: AppRole.STUDENT,
          tenantId: "tenant-1",
          moodleUserId: 42,
        }),
        moodleToken: "raw-moodle-token",
      }),
    );
    expect(result.sessionCookie.value).toBe("encrypted-app-session");
    expect(JSON.stringify(result)).not.toContain("raw-moodle-token");
  });

  it("rejects tenant mismatch reported by Moodle site info", async () => {
    moodleAuth.authenticateStudent = vi.fn().mockResolvedValue({
      token: "raw-moodle-token",
      siteInfo: {
        userId: 42,
        username: "another-user",
        fullName: "Another User",
      },
    });
    const useCase = new LoginUseCase(
      tenantResolver,
      moodleAuth,
      sessionManager,
    );

    await expect(
      useCase.execute({
        tenant: "acme",
        username: "student01",
        password: "secret-password",
      }),
    ).rejects.toThrow("Moodle identity does not match login username");
  });
});
