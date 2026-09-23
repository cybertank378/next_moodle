import "server-only";

import { prisma } from "@/libs/prisma";
import { GetCurrentSessionUseCase } from "@/modules/auth/application/usecases/GetCurrentSessionUseCase";
import { LoginUseCase } from "@/modules/auth/application/usecases/LoginUseCase";
import { LogoutAllUseCase } from "@/modules/auth/application/usecases/LogoutAllUseCase";
import { LogoutUseCase } from "@/modules/auth/application/usecases/LogoutUseCase";
import { RefreshSessionUseCase } from "@/modules/auth/application/usecases/RefreshSessionUseCase";
import { AuthController } from "@/modules/auth/infrastructure/http/AuthController";
import { EncryptedCookieSessionManager } from "@/modules/auth/infrastructure/providers/EncryptedCookieSessionManager";
import { MoodleStudentAuthProvider } from "@/modules/auth/infrastructure/providers/MoodleStudentAuthProvider";
import { PrismaTenantAuthResolver } from "@/modules/auth/infrastructure/providers/PrismaTenantAuthResolver";

let controller: AuthController | null = null;
let sessionManager: EncryptedCookieSessionManager | null = null;

export function getAuthSessionManager(): EncryptedCookieSessionManager {
  sessionManager ??= new EncryptedCookieSessionManager();
  return sessionManager;
}

export function getAuthController(): AuthController {
  if (controller) return controller;

  const tenantResolver = new PrismaTenantAuthResolver(prisma);
  const moodleAuth = new MoodleStudentAuthProvider();
  const sessions = getAuthSessionManager();

  controller = new AuthController({
    login: new LoginUseCase(tenantResolver, moodleAuth, sessions),
    getCurrentSession: new GetCurrentSessionUseCase(sessions),
    logout: new LogoutUseCase(sessions),
    logoutAll: new LogoutAllUseCase(sessions),
    refresh: new RefreshSessionUseCase(sessions),
  });
  return controller;
}
