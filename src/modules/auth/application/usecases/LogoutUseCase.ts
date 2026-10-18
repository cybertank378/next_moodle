import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { IAuthRepository } from "@/modules/auth/domain/interfaces/AuthInterfaces";

export class LogoutUseCase extends BaseUseCase<string, void> {
  constructor(private readonly sessionManager: IAuthRepository) {
    super();
  }

  async handle(cookieValue: string): Promise<void> {
    await this.sessionManager.revokeSession(cookieValue);
  }
}

