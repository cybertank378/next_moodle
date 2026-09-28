import "server-only";

import { MoodleRestClient } from "@/core/moodle/MoodleRestClient";
import { prisma } from "@/libs/prisma";
import { GetCurrentSessionUseCase } from "@/modules/auth/application/usecases/GetCurrentSessionUseCase";
import { LoginUseCase } from "@/modules/auth/application/usecases/LoginUseCase";
import { LogoutAllUseCase } from "@/modules/auth/application/usecases/LogoutAllUseCase";
import { LogoutUseCase } from "@/modules/auth/application/usecases/LogoutUseCase";
import { RefreshSessionUseCase } from "@/modules/auth/application/usecases/RefreshSessionUseCase";
import type {
  IMoodleClient,
  LoginTenant,
} from "@/modules/auth/domain/interfaces/AuthInterfaces";
import { AuthController } from "@/modules/auth/infrastructure/http/AuthController";
import { MoodleDynamicAuthenticator } from "@/modules/auth/infrastructure/providers/MoodleDynamicAuthenticator";
import { AuthRepository } from "@/modules/auth/infrastructure/repo/AuthRepository";

let controller: AuthController | null = null;
let sessionManager: AuthRepository | null = null;

export function getAuthRepository(): AuthRepository {
  sessionManager ??= new AuthRepository({}, prisma);
  return sessionManager;
}

export function getAuthController(): AuthController {
  if (controller) return controller;

  const repository = getAuthRepository();

  const moodleClient = new MoodleDynamicAuthenticator();

  controller = new AuthController({
    login: new LoginUseCase(repository, moodleClient, repository),
    getCurrentSession: new GetCurrentSessionUseCase(repository),
    logout: new LogoutUseCase(repository),
    logoutAll: new LogoutAllUseCase(repository),
    refresh: new RefreshSessionUseCase(repository),
  });
  return controller;
}
