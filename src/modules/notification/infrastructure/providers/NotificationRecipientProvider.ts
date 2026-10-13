import "server-only";

import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { ValidationError } from "@/core/errors/ValidationError";
import { prisma } from "@/libs/prisma";
import type {
  NotificationRecipientProviderInterface,
  ResolvedRecipient,
} from "@/modules/notification/domain/interfaces/NotificationRecipientProviderInterface";
import {
  NotificationAudienceScope,
  NotificationOwnerScope,
  type NotificationAudienceSpec,
} from "@/modules/notification/domain/types/NotificationTypes";

interface MoodleCourse { id: number }
interface MoodleEnrolledUser {
  id: number;
  fullname?: string;
  username?: string;
  roles?: Array<{ shortname?: string }>;
  suspended?: boolean;
}

const STUDENT_ROLES = new Set(["student"]);
const TEACHER_ROLES = new Set(["editingteacher", "teacher"]);
const SUPPORTED_ROLES = new Set(["STUDENT", "TEACHER"]);

/**
 * Moodle is the authoritative source of academic recipients.
 * Device registration is never used to discover IN_APP audiences.
 */
export class NotificationRecipientProvider
  implements NotificationRecipientProviderInterface
{
  constructor(private readonly moodle: MoodleClientFactory) {}

  async resolveRecipients(
    audienceSpec: NotificationAudienceSpec,
    ownerScope: NotificationOwnerScope,
    ownerTenantId: string | null,
  ): Promise<ResolvedRecipient[]> {
    const requestedTenants = new Set(audienceSpec.tenantIds ?? []);
    if (ownerScope === NotificationOwnerScope.TENANT) {
      if (!ownerTenantId || [...requestedTenants].some(id => id !== ownerTenantId)) {
        throw new ValidationError("Akses tenant tujuan tidak diizinkan.");
      }
    }
    const where = ownerScope === NotificationOwnerScope.TENANT
      ? { id: ownerTenantId as string, status: "ACTIVE" as const }
      : { status: "ACTIVE" as const, ...(requestedTenants.size > 0
          ? { id: { in: [...requestedTenants] } }
          : {}) };
    const tenants = await prisma.tenant.findMany({
      where,
      select: { id: true, slug: true, status: true },
      orderBy: { id: "asc" },
    });
    if (ownerScope === NotificationOwnerScope.PLATFORM && requestedTenants.size > 0 &&
        tenants.length !== requestedTenants.size) {
      throw new ValidationError("Satu atau beberapa tenant tidak aktif atau tidak ditemukan.");
    }
    if (tenants.length === 0) return [];

    const roles = new Set(audienceSpec.roles?.length
      ? audienceSpec.roles : ["STUDENT"]);
    if ([...roles].some(role => !SUPPORTED_ROLES.has(role))) {
      throw new ValidationError("Role audiens belum didukung oleh resolver Moodle.");
    }
    const requestedUsers = new Set(audienceSpec.userIds ?? []);
    if (ownerScope === NotificationOwnerScope.PLATFORM && audienceSpec.scope === NotificationAudienceScope.USERS &&
      [...requestedUsers].some(id => !/^moodle:[^:]+:\d+$/.test(id))) {
      throw new ValidationError("ADMIN harus menggunakan ID Moodle berformat moodle:<tenantId>:<userId> untuk menghindari ambigu lintas tenant.");
    }
    if (audienceSpec.scope === NotificationAudienceScope.USERS && requestedUsers.size === 0) {
      throw new ValidationError("Daftar pengguna tujuan tidak boleh kosong.");
    }

    const recipients = new Map<string, ResolvedRecipient>();
    for (const tenant of tenants) {
      const client = await this.moodle.createClientForTenant(
        { tenantId: tenant.id, tenantSlug: tenant.slug, status: "ACTIVE" },
        "admin",
      );
      // Both functions are already used by the existing course/enrolment modules.
      const courses = await client.call<MoodleCourse[]>("core_course_get_courses", {});
      for (const course of courses ?? []) {
        if (course.id === 1) continue;
        const students = await client.call<MoodleEnrolledUser[]>(
          "core_enrol_get_enrolled_users",
          { courseid: course.id },
        );
        for (const student of students ?? []) {
          if (!Number.isSafeInteger(student.id) || student.id <= 0 || student.suspended) continue;
          const moodleRoles = new Set((student.roles ?? []).map(r => r.shortname?.toLowerCase()));
          const role = [...moodleRoles].some(r => r && TEACHER_ROLES.has(r))
            ? "TEACHER"
            : [...moodleRoles].some(r => r && STUDENT_ROLES.has(r))
              ? "STUDENT" : null;
          if (!role || !roles.has(role)) continue;
          const recipientId = `moodle:${tenant.id}:${student.id}`;
          if (audienceSpec.scope === NotificationAudienceScope.USERS &&
              !requestedUsers.has(recipientId) && !requestedUsers.has(String(student.id))) continue;
          const key = `${tenant.id}:${recipientId}:${role}`;
          recipients.set(key, {
            recipientId, role, tenantId: tenant.id,
            name: student.fullname || student.username || recipientId,
          });
        }
      }
    }
    // Explicit IDs must resolve to real enrolments; no fabricated recipients.
    if (audienceSpec.scope === NotificationAudienceScope.USERS &&
        [...requestedUsers].some(uid => ![...recipients.values()].some(
          r => uid === r.recipientId || uid === r.recipientId.split(":").at(-1),
        ))) {
      throw new ValidationError("Satu atau beberapa pengguna bukan anggota audiens Moodle yang valid.");
    }
    return [...recipients.values()];
  }

  async getAudienceCount(
    audienceSpec: NotificationAudienceSpec,
    ownerScope: NotificationOwnerScope,
    ownerTenantId: string | null,
  ): Promise<number> {
    return (await this.resolveRecipients(audienceSpec, ownerScope, ownerTenantId)).length;
  }

  async getRecipientOptions(
    ownerScope: NotificationOwnerScope,
    ownerTenantId: string | null,
  ): Promise<{
    roles: Array<{ role: string; label: string; count?: number }>;
    tenants?: Array<{ id: string; name: string }>;
  }> {
    const roles = [
      { role: "STUDENT", label: "Siswa / Peserta Ujian" },
      { role: "TEACHER", label: "Guru / Pengawas" },
    ];
    if (ownerScope !== NotificationOwnerScope.PLATFORM) return { roles };
    const tenants = await prisma.tenant.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return { roles, tenants };
  }
}
