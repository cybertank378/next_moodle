import { vi } from "vitest";
import type { IAuthRepository } from "@/modules/auth/domain/interfaces/AuthInterfaces";

export function createIAuthRepositoryTestDouble(): IAuthRepository {
  return {
    createSession: vi.fn(),
    resolveSession: vi.fn(),
    refreshSession: vi.fn(),
    revokeSession: vi.fn(),
    revokeAllForActor: vi.fn(),
  };
}
