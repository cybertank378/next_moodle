import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { authorize } from "@/core/rbac/authorize";
import { Permission } from "@/core/rbac/Permission";

export class GradeAuthorizationService {
  public static authorizeUserGradesAccess(
    actor: AuthorizationActor | null | undefined,
    targetUserId?: number,
  ): { tenantId: string; resolvedUserId: number } {
    if (!actor) {
      throw new UnauthorizedError("Sesi tidak valid atau telah berakhir.");
    }

    if (actor.role === AppRole.ADMIN) {
      return {
        tenantId: actor.tenantId ?? "",
        resolvedUserId: targetUserId ?? 0,
      };
    }

    if (!actor.tenantId) {
      throw new AuthorizationError(
        "Akses ditolak: tenant ID diperlukan untuk mengakses nilai ujian.",
      );
    }

    if (actor.role === AppRole.STUDENT) {
      authorize(actor, Permission.GRADE_READ_OWN, {
        requestedTenantId: actor.tenantId,
      });

      const studentMoodleId = actor.moodleUserId;
      if (
        targetUserId !== undefined &&
        studentMoodleId !== undefined &&
        targetUserId !== studentMoodleId
      ) {
        throw new AuthorizationError(
          "Akses ditolak: Siswa hanya dapat melihat rapor miliknya sendiri.",
        );
      }

      const resolvedUserId =
        targetUserId ?? studentMoodleId ?? Number(actor.id);
      if (!resolvedUserId || Number.isNaN(resolvedUserId)) {
        throw new AuthorizationError(
          "Akses ditolak: identitas siswa di LMS tidak ditemukan.",
        );
      }

      return {
        tenantId: actor.tenantId,
        resolvedUserId,
      };
    }

    if (actor.role === AppRole.TENANT) {
      authorize(actor, Permission.GRADE_READ, {
        requestedTenantId: actor.tenantId,
      });

      return {
        tenantId: actor.tenantId,
        resolvedUserId: targetUserId ?? 0,
      };
    }

    throw new AuthorizationError(
      "Akses ditolak: role tidak memiliki izin untuk melihat nilai ujian.",
    );
  }

  public static authorizeCourseGradesAccess(
    actor: AuthorizationActor | null | undefined,
  ): { tenantId: string } {
    if (!actor) {
      throw new UnauthorizedError("Sesi tidak valid atau telah berakhir.");
    }

    if (actor.role === AppRole.ADMIN) {
      return {
        tenantId: actor.tenantId ?? "",
      };
    }

    if (!actor.tenantId) {
      throw new AuthorizationError(
        "Akses ditolak: tenant ID diperlukan untuk mengakses rekap nilai kelas.",
      );
    }

    if (actor.role === AppRole.TENANT) {
      authorize(actor, Permission.GRADE_READ, {
        requestedTenantId: actor.tenantId,
      });
      return { tenantId: actor.tenantId };
    }

    throw new AuthorizationError(
      "Akses ditolak: Hanya pengajar/tenant yang memiliki akses melihat rekap nilai kelas.",
    );
  }
}
