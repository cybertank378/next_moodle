// Files: src/modules/notification/infrastructure/providers/NotificationRecipientProvider.ts

import { prisma } from "@/libs/prisma";
import type {
  NotificationAudienceSpec,
  NotificationOwnerScope,
} from "@/modules/notification/domain/types/NotificationTypes";
import type {
  NotificationRecipientProviderInterface,
  ResolvedRecipient,
} from "@/modules/notification/domain/interfaces/NotificationRecipientProviderInterface";

export class NotificationRecipientProvider implements NotificationRecipientProviderInterface {
  async resolveRecipients(
    audienceSpec: NotificationAudienceSpec,
    ownerScope: NotificationOwnerScope,
    ownerTenantId: string | null,
  ): Promise<ResolvedRecipient[]> {
    const targetTenantId = ownerScope === "TENANT" ? ownerTenantId : null;

    // 1. If explicit userIds provided
    if (audienceSpec.scope === "USERS" && audienceSpec.userIds && audienceSpec.userIds.length > 0) {
      return audienceSpec.userIds.map((uid) => ({
        recipientId: uid,
        role: "STUDENT",
        tenantId: targetTenantId,
        name: `User ${uid}`,
      }));
    }

    // 2. Query distinct recipients from NotificationDevice or past Notification interactions
    const deviceRecipients = await prisma.notificationDevice.findMany({
      where: {
        active: true,
        ...(targetTenantId ? { tenantId: targetTenantId } : {}),
        ...(audienceSpec.roles && audienceSpec.roles.length > 0
          ? { role: { in: audienceSpec.roles } }
          : {}),
      },
      select: {
        userId: true,
        role: true,
        tenantId: true,
      },
      distinct: ["userId", "role"],
    });

    if (deviceRecipients.length > 0) {
      return deviceRecipients.map(
        (d: { userId: string; role: string; tenantId: string | null }) => ({
          recipientId: d.userId,
          role: d.role,
          tenantId: d.tenantId,
          name: `Penerima ${d.userId}`,
        }),
      );
    }

    // 3. Fallback: if no active devices registered yet, create representative recipient for tenant
    if (targetTenantId) {
      return [
        {
          recipientId: `all_students_${targetTenantId}`,
          role: "STUDENT",
          tenantId: targetTenantId,
          name: "Seluruh Siswa",
        },
        {
          recipientId: `all_teachers_${targetTenantId}`,
          role: "TEACHER",
          tenantId: targetTenantId,
          name: "Seluruh Guru",
        },
      ];
    }

    return [
      {
        recipientId: "all_platform_admins",
        role: "ADMIN",
        tenantId: null,
        name: "Seluruh Administrator",
      },
    ];
  }

  async getAudienceCount(
    audienceSpec: NotificationAudienceSpec,
    ownerScope: NotificationOwnerScope,
    ownerTenantId: string | null,
  ): Promise<number> {
    const recipients = await this.resolveRecipients(audienceSpec, ownerScope, ownerTenantId);
    return recipients.length;
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
      { role: "TENANT", label: "Pengelola Sekolah / Tenant" },
    ];

    if (ownerScope === "PLATFORM") {
      const tenants = await prisma.tenant.findMany({
        select: { id: true, name: true },
        take: 100,
        orderBy: { name: "asc" },
      });

      return {
        roles: [...roles, { role: "ADMIN", label: "Administrator Platform" }],
        tenants,
      };
    }

    return { roles };
  }
}
