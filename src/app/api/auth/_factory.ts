import "server-only";

import { prisma } from "@/libs/prisma";
import { GetCurrentSessionUseCase } from "@/modules/auth/application/usecases/GetCurrentSessionUseCase";
import { LoginUseCase } from "@/modules/auth/application/usecases/LoginUseCase";
import { LogoutAllUseCase } from "@/modules/auth/application/usecases/LogoutAllUseCase";
import { LogoutUseCase } from "@/modules/auth/application/usecases/LogoutUseCase";
import { RefreshSessionUseCase } from "@/modules/auth/application/usecases/RefreshSessionUseCase";
import { AuthController } from "@/modules/auth/infrastructure/http/AuthController";
import { AuthRepository } from "@/modules/auth/infrastructure/repo/AuthRepository";

let controller: AuthController | null = null;
let sessionManager: AuthRepository | null = null;

export function getAuthSessionManager(): AuthRepository {
  sessionManager ??= new AuthRepository({}, prisma);
  return sessionManager;
}

export function getAuthController(): AuthController {
  if (controller) return controller;

  const repository = getAuthSessionManager();

  controller = new AuthController({
    login: new LoginUseCase(repository, repository, repository),
    getCurrentSession: new GetCurrentSessionUseCase(repository),
    logout: new LogoutUseCase(repository),
    logoutAll: new LogoutAllUseCase(repository),
    refresh: new RefreshSessionUseCase(repository),
  });
  return controller;
}
