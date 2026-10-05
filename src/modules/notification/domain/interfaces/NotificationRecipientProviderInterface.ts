// Files: src/modules/notification/domain/interfaces/NotificationRecipientProviderInterface.ts

import type {
  NotificationAudienceSpec,
  NotificationOwnerScope,
} from "@/modules/notification/domain/types/NotificationTypes";

export interface ResolvedRecipient {
  recipientId: string;
  role: string;
  tenantId: string | null;
  name?: string;
}

export interface NotificationRecipientProviderInterface {
  resolveRecipients(
    audienceSpec: NotificationAudienceSpec,
    ownerScope: NotificationOwnerScope,
    ownerTenantId: string | null,
  ): Promise<ResolvedRecipient[]>;
  getAudienceCount(
    audienceSpec: NotificationAudienceSpec,
    ownerScope: NotificationOwnerScope,
    ownerTenantId: string | null,
  ): Promise<number>;
  getRecipientOptions(
    ownerScope: NotificationOwnerScope,
    ownerTenantId: string | null,
  ): Promise<{
    roles: Array<{ role: string; label: string; count?: number }>;
    tenants?: Array<{ id: string; name: string }>;
  }>;
}
