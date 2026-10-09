import type { IAuthRepository } from "@/modules/auth/domain/interfaces/AuthInterfaces";

export class LogoutUseCase {
  constructor(private readonly sessionManager: IAuthRepository) {}

  async execute(cookieValue: string): Promise<void> {
    await this.sessionManager.revokeSession(cookieValue);
  }
}
