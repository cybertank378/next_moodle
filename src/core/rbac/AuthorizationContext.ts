import type { AppRole } from "./AppRole";

export interface AuthorizationActor {
  readonly id: string;
  readonly role: AppRole;
  readonly tenantId: string | null;
  readonly moodleUserId?: number | null;
  readonly permissions?: readonly string[];
}

export interface AuthorizationOptions {
  requestedTenantId?: string;
  resourceOwnerId?: string;
}
