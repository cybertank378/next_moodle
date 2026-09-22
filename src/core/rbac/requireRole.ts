import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { AppRole } from "./AppRole";
import type { AuthorizationActor } from "./AuthorizationContext";
import { AuthorizationError } from "./AuthorizationError";

export function requireRole(
  actor: AuthorizationActor | null | undefined,
  expectedRole: AppRole,
): AuthorizationActor {
  if (!actor) {
    throw new UnauthorizedError(
      "Sesi telah berakhir atau aktor tidak terautentikasi.",
    );
  }

  if (actor.role !== expectedRole) {
    throw new AuthorizationError(
      `Akses ditolak: Resource ini memerlukan role '${expectedRole}', tetapi role Anda adalah '${actor.role}'.`,
      { expectedRole, actualRole: actor.role },
    );
  }

  if (expectedRole === AppRole.TENANT || expectedRole === AppRole.STUDENT) {
    if (!actor.tenantId || actor.tenantId.trim().length === 0) {
      throw new AuthorizationError(
        `Konteks tenant wajib ada untuk role '${expectedRole}'.`,
        { role: expectedRole },
      );
    }
  }

  return actor;
}
