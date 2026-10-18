import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { authorize } from "@/core/rbac/authorize";
import { Permission, type PermissionType } from "@/core/rbac/Permission";

export function authorizeQuestionOperation(
  actor: AuthorizationActor | null | undefined,
  requiredPermission: PermissionType = Permission.QUESTION_READ,
): Error | null {
  if (!actor) {
    return new UnauthorizedError("Sesi tidak valid atau telah berakhir.");
  }

  // ADMIN has platform wide access
  if (actor.role === AppRole.ADMIN) {
    return null;
  }

  // TENANT and TEACHER have permissions for question bank
  if (actor.role === AppRole.TENANT || actor.role === AppRole.TEACHER) {
    try {
      authorize(actor, requiredPermission);
      return null;
    } catch (err) {
      if (
        err instanceof AuthorizationError ||
        err instanceof UnauthorizedError
      ) {
        return err;
      }
      throw err;
    }
  }

  return new AuthorizationError(
    "Akses ditolak: role tidak memiliki izin untuk mengakses bank soal.",
  );
}
