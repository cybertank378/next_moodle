import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { authorize } from "@/core/rbac/authorize";
import { Permission } from "@/core/rbac/Permission";

export function authorizeCourseOperation(
  actor: AuthorizationActor | null | undefined,
): Error | null {
  if (!actor) {
    return new UnauthorizedError("Sesi tidak valid atau telah berakhir.");
  }

  // ADMIN can read cross-tenant / all courses
  if (actor.role === AppRole.ADMIN) {
    return null;
  }

  // STUDENT requires STUDENT_COURSE_READ permission and valid tenantId
  if (actor.role === AppRole.STUDENT) {
    try {
      authorize(actor, Permission.STUDENT_COURSE_READ);
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

  // TENANT requires COURSE_READ permission and valid tenantId
  if (actor.role === AppRole.TENANT) {
    try {
      authorize(actor, Permission.COURSE_READ);
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

  // TEACHER requires TEACHER_COURSE_READ permission and valid tenantId
  if (actor.role === AppRole.TEACHER) {
    try {
      authorize(actor, Permission.TEACHER_COURSE_READ);
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
    "Akses ditolak: role tidak memiliki akses ke course.",
  );
}
