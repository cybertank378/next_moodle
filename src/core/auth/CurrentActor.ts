import { ValidationError } from "@/core/errors/ValidationError";
import { AppRole } from "@/core/rbac/AppRole";

export interface CurrentActor {
  readonly id?: string;
  readonly userId: string;
  readonly username: string;
  readonly role: AppRole | string;
  readonly tenantId: string | null;
  readonly moodleUserId?: number | null;
  readonly permissions?: readonly string[];
  readonly email?: string;
  readonly displayName?: string;
}

export function validateCurrentActor(actor: unknown): CurrentActor {
  if (!actor || typeof actor !== "object") {
    throw new ValidationError(
      "Invalid actor: actor context must be a non-null object.",
    );
  }

  const candidate = actor as Partial<CurrentActor>;
  const actorId =
    typeof candidate.id === "string" && candidate.id.trim()
      ? candidate.id.trim()
      : typeof candidate.userId === "string" && candidate.userId.trim()
        ? candidate.userId.trim()
        : "";

  if (!actorId) {
    throw new ValidationError(
      "Invalid actor: id is required and cannot be empty.",
    );
  }

  if (
    !candidate.role ||
    typeof candidate.role !== "string" ||
    candidate.role.trim().length === 0
  ) {
    throw new ValidationError(
      "Invalid actor: role is required and cannot be empty.",
    );
  }

  if (!Object.values(AppRole).includes(candidate.role as AppRole)) {
    throw new ValidationError("Invalid actor: unsupported role.");
  }

  const role = candidate.role as AppRole;
  if (role !== AppRole.ADMIN && !candidate.tenantId) {
    throw new ValidationError(
      `Invalid actor: tenantId is required for actor role '${candidate.role}'.`,
    );
  }

  return {
    id: actorId,
    userId:
      typeof candidate.userId === "string" && candidate.userId.trim()
        ? candidate.userId.trim()
        : actorId,
    username: candidate.username ? String(candidate.username).trim() : actorId,
    role,
    tenantId: candidate.tenantId ? candidate.tenantId.trim() : null,
    moodleUserId:
      typeof candidate.moodleUserId === "number"
        ? candidate.moodleUserId
        : null,
    permissions: Array.isArray(candidate.permissions)
      ? candidate.permissions.filter(
          (permission): permission is string => typeof permission === "string",
        )
      : [],
    email: candidate.email ? String(candidate.email).trim() : undefined,
    displayName: candidate.displayName
      ? String(candidate.displayName).trim()
      : undefined,
  };
}
