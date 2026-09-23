import type { AuthSessionManager } from "@/modules/auth/domain/interfaces/AuthInterfaces";

export class LogoutAllUseCase {
  constructor(private readonly sessionManager: AuthSessionManager) {}

  async execute(actorId: string): Promise<void> {
    await this.sessionManager.revokeAllForActor(actorId);
  }
}
