import { vi } from "vitest";
import type { AuthSessionManager } from "@/modules/auth/domain/interfaces/AuthInterfaces";

export function createAuthSessionManagerTestDouble(): AuthSessionManager {
  return {
    createSession: vi.fn(),
    resolveSession: vi.fn(),
    refreshSession: vi.fn(),
    revokeSession: vi.fn(),
    revokeAllForActor: vi.fn(),
  };
}
