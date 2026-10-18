import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { IAuthRepository } from "@/modules/auth/domain/interfaces/AuthInterfaces";

export class LogoutAllUseCase extends BaseUseCase<string, void> {
  constructor(private readonly sessionManager: IAuthRepository) {
    super();
  }

  async handle(actorId: string): Promise<void> {
    await this.sessionManager.revokeAllForActor(actorId);
  }
}

