import { BaseUseCase } from "@/core/base/BaseUseCase";
import type {
  CreatedAppSession,
  IAuthRepository,
} from "@/modules/auth/domain/interfaces/AuthInterfaces";

export class RefreshSessionUseCase extends BaseUseCase<
  string,
  CreatedAppSession
> {
  constructor(private readonly sessionManager: IAuthRepository) {
    super();
  }

  async handle(cookieValue: string): Promise<CreatedAppSession> {
    return this.sessionManager.refreshSession(cookieValue);
  }
}

