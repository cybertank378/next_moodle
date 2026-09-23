import type { AuthSessionManager } from "@/modules/auth/domain/interfaces/AuthInterfaces";

export class LogoutUseCase {
  constructor(private readonly sessionManager: AuthSessionManager) {}

  async execute(cookieValue: string): Promise<void> {
    await this.sessionManager.revokeSession(cookieValue);
  }
}
