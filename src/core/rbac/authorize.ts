import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { AppRole } from "./AppRole";
import type {
  AuthorizationActor,
  AuthorizationOptions,
} from "./AuthorizationContext";
import { AuthorizationError } from "./AuthorizationError";
import { hasPermission } from "./hasPermission";
import type { PermissionType } from "./Permission";

export function authorize(
  actor: AuthorizationActor | null | undefined,
  permission: PermissionType,
  options?: AuthorizationOptions,
): AuthorizationActor {
  if (!actor) {
    throw new UnauthorizedError(
      "Sesi telah berakhir atau aktor tidak terautentikasi.",
    );
  }

  // 1. Role permission check
  if (!hasPermission(actor.role, permission)) {
    throw new AuthorizationError(
      `Role '${actor.role}' tidak memiliki izin untuk '${permission}'.`,
      { role: actor.role, permission },
    );
  }

  // 2. Tenant isolation rule
  if (actor.role === AppRole.TENANT || actor.role === AppRole.STUDENT) {
    if (!actor.tenantId || actor.tenantId.trim().length === 0) {
      throw new AuthorizationError(
        `Konteks tenant wajib ada untuk aktor role '${actor.role}'.`,
        { role: actor.role },
      );
    }

    if (
      options?.requestedTenantId &&
      options.requestedTenantId !== actor.tenantId
    ) {
      throw new AuthorizationError(
        "Akses ditolak: Permintaan tenant tidak sesuai dengan sesi aktif.",
        {
          actorTenantId: actor.tenantId,
          requestedTenantId: options.requestedTenantId,
        },
      );
    }
  }

  // 3. Ownership check for student own-resource permissions
  if (options?.resourceOwnerId && actor.role === AppRole.STUDENT) {
    const isOwnerById = actor.id === options.resourceOwnerId;
    const isOwnerByMoodleId =
      actor.moodleUserId !== undefined &&
      actor.moodleUserId !== null &&
      String(actor.moodleUserId) === options.resourceOwnerId;

    if (!isOwnerById && !isOwnerByMoodleId) {
      throw new AuthorizationError(
        "Akses ditolak: Resource ini bukan milik akun Anda.",
        { resourceOwnerId: options.resourceOwnerId, actorId: actor.id },
      );
    }
  }

  return actor;
}
