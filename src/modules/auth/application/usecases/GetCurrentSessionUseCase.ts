import { BaseUseCase } from "@/core/base/BaseUseCase";
import type {
  AppSessionPayload,
  IAuthRepository,
} from "@/modules/auth/domain/interfaces/AuthInterfaces";

export class GetCurrentSessionUseCase extends BaseUseCase<
  string,
  AppSessionPayload
> {
  constructor(private readonly sessionManager: IAuthRepository) {
    super();
  }

  async handle(cookieValue: string): Promise<AppSessionPayload> {
    return this.sessionManager.resolveSession(cookieValue);
  }
}

