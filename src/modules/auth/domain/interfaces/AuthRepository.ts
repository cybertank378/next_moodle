import type { AuthenticatedUser } from "@/modules/auth/domain/entities/AuthenticatedUser";

export interface AuthRepository {
  authenticate(
    username: string,
    password: string,
    tenantId: string,
  ): Promise<AuthenticatedUser>;
  validateSession(token: string): Promise<AuthenticatedUser | null>;
}
