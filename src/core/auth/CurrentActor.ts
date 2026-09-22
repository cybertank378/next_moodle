import { ValidationError } from "@/core/errors/ValidationError";

export type ActorRole =
  | "ADMIN"
  | "TENANT"
  | "STUDENT"
  | "SUPERADMIN"
  | "TENANT_ADMIN"
  | "TEACHER"
  | string;

export interface CurrentActor {
  userId: string;
  username: string;
  role: ActorRole;
  tenantId: string;
  email?: string;
}

export function validateCurrentActor(actor: unknown): CurrentActor {
  if (!actor || typeof actor !== "object") {
    throw new ValidationError(
      "Invalid actor: actor context must be a non-null object.",
    );
  }

  const candidate = actor as Partial<CurrentActor>;

  if (
    !candidate.userId ||
    typeof candidate.userId !== "string" ||
    candidate.userId.trim().length === 0
  ) {
    throw new ValidationError(
      "Invalid actor: userId is required and cannot be empty.",
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

  // Cross-tenant platform superadmins may have global scope, but all tenant/student roles must have tenantId
  const isGlobalSuperadmin = candidate.role === "SUPERADMIN";
  if (
    !isGlobalSuperadmin &&
    (!candidate.tenantId ||
      typeof candidate.tenantId !== "string" ||
      candidate.tenantId.trim().length === 0)
  ) {
    throw new ValidationError(
      `Invalid actor: tenantId is required for actor role '${candidate.role}'.`,
    );
  }

  return {
    userId: candidate.userId.trim(),
    username: candidate.username
      ? String(candidate.username).trim()
      : candidate.userId.trim(),
    role: candidate.role.trim(),
    tenantId: candidate.tenantId ? candidate.tenantId.trim() : "",
    email: candidate.email ? String(candidate.email).trim() : undefined,
  };
}
