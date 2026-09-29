import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { authorize } from "@/core/rbac/authorize";
import { Permission } from "@/core/rbac/Permission";

export function authorizeQuizOperation(
  actor: AuthorizationActor | null | undefined,
): Error | null {
  if (!actor) {
    return new UnauthorizedError("Sesi tidak valid atau telah berakhir.");
  }

  // ADMIN has platform wide access
  if (actor.role === AppRole.ADMIN) {
    return null;
  }

  // STUDENT requires STUDENT_QUIZ_READ permission and valid tenantId
  if (actor.role === AppRole.STUDENT) {
    try {
      authorize(actor, Permission.STUDENT_QUIZ_READ);
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

  // TENANT and TEACHER share QUIZ_READ permission
  if (actor.role === AppRole.TENANT || actor.role === AppRole.TEACHER) {
    try {
      authorize(actor, Permission.QUIZ_READ);
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
    "Akses ditolak: role tidak memiliki akses ke kuis atau ujian.",
  );
}
