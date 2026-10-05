// Files: src/modules/notification/application/services/NotificationAuthorizationService.ts

import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { AppRole } from "@/core/rbac/AppRole";
import type { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import { NotificationOwnerScope } from "@/modules/notification/domain/types/NotificationTypes";

export interface CampaignActor {
  id: string;
  role: AppRole | string;
  tenantId: string | null;
}

export class NotificationAuthorizationService {
  static assertCanManageCampaign(actor: CampaignActor): void {
    if (actor.role !== AppRole.ADMIN && actor.role !== AppRole.TENANT) {
      throw new ForbiddenError("Hanya Administrator atau Pengelola Tenant yang memiliki akses manajemen notifikasi.");
    }
  }

  static assertCanAccessCampaign(campaign: NotificationCampaignEntity, actor: CampaignActor): void {
    this.assertCanManageCampaign(actor);

    if (actor.role === AppRole.ADMIN) {
      return; // Platform admin has full oversight
    }

    if (actor.role === AppRole.TENANT) {
      if (
        campaign.ownerScope !== NotificationOwnerScope.TENANT ||
        campaign.ownerTenantId !== actor.tenantId
      ) {
        throw new ForbiddenError("Anda tidak memiliki akses ke pengumuman/notifikasi tenant lain.");
      }
    }
  }

  static resolveOwnerScope(actor: CampaignActor): {
    ownerScope: NotificationOwnerScope;
    ownerTenantId: string | null;
  } {
    this.assertCanManageCampaign(actor);

    if (actor.role === AppRole.ADMIN) {
      return {
        ownerScope: NotificationOwnerScope.PLATFORM,
        ownerTenantId: null,
      };
    }

    if (!actor.tenantId) {
      throw new ForbiddenError("Tenant ID tidak ditemukan pada sesi pengguna.");
    }

    return {
      ownerScope: NotificationOwnerScope.TENANT,
      ownerTenantId: actor.tenantId,
    };
  }
}
