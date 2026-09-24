import { describe, expect, it } from "vitest";
import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";
import type { Session } from "@/core/auth/Session";
import type { SessionRepository } from "@/core/auth/SessionRepository";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";

describe("resolveCurrentActor", () => {
  const activeSession: Session = {
    id: "sess_123",
    token: "valid_session_token_xyz",
    actor: {
      userId: "usr_456",
      username: "student.john",
      role: "STUDENT",
      tenantId: "tenant_acme_123",
    },
    expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour ahead
    isRevoked: false,
    createdAt: new Date(),
  };

  const expiredSession: Session = {
    id: "sess_exp",
    token: "expired_token_xyz",
    actor: {
      userId: "usr_456",
      username: "student.john",
      role: "STUDENT",
      tenantId: "tenant_acme_123",
    },
    expiresAt: new Date(Date.now() - 3600 * 1000), // 1 hour ago
    isRevoked: false,
    createdAt: new Date(Date.now() - 7200 * 1000),
  };

  const revokedSession: Session = {
    id: "sess_rev",
    token: "revoked_token_xyz",
    actor: {
      userId: "usr_456",
      username: "student.john",
      role: "STUDENT",
      tenantId: "tenant_acme_123",
    },
    expiresAt: new Date(Date.now() + 3600 * 1000),
    isRevoked: true,
    createdAt: new Date(),
  };

  const mockSessionRepo: SessionRepository = {
    async findByToken(token: string): Promise<Session | null> {
      if (token === activeSession.token) return activeSession;
      if (token === expiredSession.token) return expiredSession;
      if (token === revokedSession.token) return revokedSession;
      return null;
    },
    async create(): Promise<Session> {
      throw new Error("Not implemented for test");
    },
    async revoke(): Promise<void> {},
  };

  it("should resolve actor successfully from Authorization Bearer header", async () => {
    const request = new Request("https://lms.acme.edu/api/v1/profile", {
      headers: {
        authorization: `Bearer ${activeSession.token}`,
      },
    });

    const actor = await resolveCurrentActor(request, mockSessionRepo);

    expect(actor).toBeDefined();
    expect(actor.userId).toBe("usr_456");
    expect(actor.username).toBe("student.john");
    expect(actor.role).toBe("STUDENT");
    expect(actor.tenantId).toBe("tenant_acme_123");
  });

  it("should resolve actor from cookie when Authorization header is missing", async () => {
    const request = new Request("https://lms.acme.edu/api/v1/profile", {
      headers: {
        cookie: `session_token=${activeSession.token}; other=123`,
      },
    });

    const actor = await resolveCurrentActor(request, mockSessionRepo);

    expect(actor).toBeDefined();
    expect(actor.userId).toBe("usr_456");
    expect(actor.username).toBe("student.john");
  });

  it("should throw UnauthorizedError when no auth credentials provided", async () => {
    const request = new Request("https://lms.acme.edu/api/v1/profile");

    await expect(resolveCurrentActor(request, mockSessionRepo)).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("should throw UnauthorizedError when token is unknown / session not found", async () => {
    const request = new Request("https://lms.acme.edu/api/v1/profile", {
      headers: {
        authorization: "Bearer unknown_random_token",
      },
    });

    await expect(resolveCurrentActor(request, mockSessionRepo)).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("should throw UnauthorizedError when session is expired", async () => {
    const request = new Request("https://lms.acme.edu/api/v1/profile", {
      headers: {
        authorization: `Bearer ${expiredSession.token}`,
      },
    });

    await expect(resolveCurrentActor(request, mockSessionRepo)).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("should throw UnauthorizedError when session is revoked", async () => {
    const request = new Request("https://lms.acme.edu/api/v1/profile", {
      headers: {
        authorization: `Bearer ${revokedSession.token}`,
      },
    });

    await expect(resolveCurrentActor(request, mockSessionRepo)).rejects.toThrow(
      UnauthorizedError,
    );
  });
});
