import type { AuthenticatedUser } from "../entities/AuthenticatedUser";

export interface AuthRepository {
  authenticate(
    username: string,
    password: string,
    tenantId: string,
  ): Promise<AuthenticatedUser>;
  validateSession(token: string): Promise<AuthenticatedUser | null>;
}
