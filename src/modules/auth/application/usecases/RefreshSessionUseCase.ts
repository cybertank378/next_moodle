import type { AuthSessionManager } from "@/modules/auth/domain/interfaces/AuthInterfaces";

export class RefreshSessionUseCase {
  constructor(private readonly sessionManager: AuthSessionManager) {}

  async execute(cookieValue: string) {
    return this.sessionManager.refreshSession(cookieValue);
  }
}
