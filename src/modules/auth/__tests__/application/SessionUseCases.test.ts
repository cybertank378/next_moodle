import { describe, expect, it, vi } from "vitest";
import { createAuthSessionManagerTestDouble } from "@/modules/auth/__tests__/helpers/AuthSessionManagerTestDouble";
import { GetCurrentSessionUseCase } from "@/modules/auth/application/usecases/GetCurrentSessionUseCase";
import { LogoutAllUseCase } from "@/modules/auth/application/usecases/LogoutAllUseCase";
import { LogoutUseCase } from "@/modules/auth/application/usecases/LogoutUseCase";
import { RefreshSessionUseCase } from "@/modules/auth/application/usecases/RefreshSessionUseCase";

describe("auth session use cases", () => {
  it("gets and refreshes a session through the domain session port", async () => {
    const sessions = createAuthSessionManagerTestDouble();
    const payload = { actor: { id: "actor-1" }, moodleToken: "token" };
    const refreshed = {
      cookieValue: "new-cookie",
      expiresAt: new Date("2026-09-23T08:00:00.000Z"),
    };
    vi.mocked(sessions.resolveSession).mockResolvedValue(payload as never);
    vi.mocked(sessions.refreshSession).mockResolvedValue(refreshed);
    await expect(
      new GetCurrentSessionUseCase(sessions).execute("cookie"),
    ).resolves.toEqual(payload);
    await expect(
      new RefreshSessionUseCase(sessions).execute("cookie"),
    ).resolves.toEqual(refreshed);
    expect(sessions.resolveSession).toHaveBeenCalledWith("cookie");
    expect(sessions.refreshSession).toHaveBeenCalledWith("cookie");
  });

  it("revokes one session or every session for an actor through the domain session port", async () => {
    const sessions = createAuthSessionManagerTestDouble();
    await new LogoutUseCase(sessions).execute("cookie");
    await new LogoutAllUseCase(sessions).execute("actor-1");
    expect(sessions.revokeSession).toHaveBeenCalledWith("cookie");
    expect(sessions.revokeAllForActor).toHaveBeenCalledWith("actor-1");
  });
});
