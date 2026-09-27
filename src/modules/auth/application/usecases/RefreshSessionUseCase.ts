import type { IAuthRepository } from "@/modules/auth/domain/interfaces/AuthInterfaces";

export class RefreshSessionUseCase {
  constructor(private readonly sessionManager: IAuthRepository) {}

  async execute(cookieValue: string) {
    return this.sessionManager.refreshSession(cookieValue);
  }
}
