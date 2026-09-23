import type { AuthSessionManager } from "@/modules/auth/domain/interfaces/AuthInterfaces";

export class GetCurrentSessionUseCase {
  constructor(private readonly sessionManager: AuthSessionManager) {}

  async execute(cookieValue: string) {
    return this.sessionManager.resolveSession(cookieValue);
  }
}
