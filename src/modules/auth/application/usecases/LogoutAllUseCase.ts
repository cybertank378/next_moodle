import type { IAuthRepository } from "@/modules/auth/domain/interfaces/AuthInterfaces";

export class LogoutAllUseCase {
  constructor(private readonly sessionManager: IAuthRepository) {}

  async execute(actorId: string): Promise<void> {
    await this.sessionManager.revokeAllForActor(actorId);
  }
}
