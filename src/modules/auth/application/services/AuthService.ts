import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import type {
  AppSessionPayload,
  CreatedAppSession,
  LoginCredentials,
} from "@/modules/auth/domain/interfaces/AuthInterfaces";
import type { GetCurrentSessionUseCase } from "@/modules/auth/application/usecases/GetCurrentSessionUseCase";
import type {
  LoginResult,
  LoginUseCase,
} from "@/modules/auth/application/usecases/LoginUseCase";
import type { LogoutAllUseCase } from "@/modules/auth/application/usecases/LogoutAllUseCase";
import type { LogoutUseCase } from "@/modules/auth/application/usecases/LogoutUseCase";
import type { RefreshSessionUseCase } from "@/modules/auth/application/usecases/RefreshSessionUseCase";

/* ============================================================
 * AUTH SERVICE
 * ============================================================
 *
 * Responsibility:
 * - Application Facade
 * - UseCase Orchestrator
 * - Transaction Boundary
 * - Authentication Workflow Coordinator
 * - Thin Application Entry Point
 *
 * NOT:
 * - Business Logic Layer
 * - Repository Wrapper
 * - Database Layer
 * ============================================================
 */

export interface AuthServiceDependencies {
  readonly login: LoginUseCase;
  readonly getCurrentSession: GetCurrentSessionUseCase;
  readonly logout: LogoutUseCase;
  readonly logoutAll: LogoutAllUseCase;
  readonly refresh: RefreshSessionUseCase;
}

export class AuthService extends BaseService {
  constructor(readonly dependencies: AuthServiceDependencies) {
    super();
  }

  login(input: LoginCredentials): Promise<Result<LoginResult, Error>> {
    return this.execute(() => this.dependencies.login.execute(input));
  }

  getCurrentSession(
    cookieValue: string,
  ): Promise<Result<AppSessionPayload, Error>> {
    return this.execute(() =>
      this.dependencies.getCurrentSession.execute(cookieValue),
    );
  }

  logout(cookieValue: string): Promise<Result<void, Error>> {
    return this.execute(() => this.dependencies.logout.execute(cookieValue));
  }

  logoutAll(actorId: string): Promise<Result<void, Error>> {
    return this.execute(() => this.dependencies.logoutAll.execute(actorId));
  }

  refreshSession(
    cookieValue: string,
  ): Promise<Result<CreatedAppSession, Error>> {
    return this.execute(() =>
      this.dependencies.refresh.execute(cookieValue),
    );
  }
}



