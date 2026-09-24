import type { GetCurrentSessionUseCase } from "@/modules/auth/application/usecases/GetCurrentSessionUseCase";
import type { LoginUseCase } from "@/modules/auth/application/usecases/LoginUseCase";
import type { LogoutAllUseCase } from "@/modules/auth/application/usecases/LogoutAllUseCase";
import type { LogoutUseCase } from "@/modules/auth/application/usecases/LogoutUseCase";
import type { RefreshSessionUseCase } from "@/modules/auth/application/usecases/RefreshSessionUseCase";

export interface AuthServiceDependencies {
  readonly login: LoginUseCase;
  readonly getCurrentSession: GetCurrentSessionUseCase;
  readonly logout: LogoutUseCase;
  readonly logoutAll: LogoutAllUseCase;
  readonly refresh: RefreshSessionUseCase;
}

export class AuthService {
  constructor(readonly dependencies: AuthServiceDependencies) {}
}
