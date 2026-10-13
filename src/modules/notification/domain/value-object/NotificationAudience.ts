// Files: src/modules/notification/domain/value-object/NotificationAudience.ts

import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { ValidationError } from "@/core/errors/ValidationError";
import {
  NotificationAudienceScope,
  type NotificationAudienceSpec,
  NotificationOwnerScope,
} from "@/modules/notification/domain/types/NotificationTypes";

export class NotificationAudience {
  readonly scope: NotificationAudienceScope;
  readonly tenantIds: readonly string[];
  readonly roles: readonly string[];
  readonly userIds: readonly string[];

  private constructor(spec: NotificationAudienceSpec) {
    this.scope = spec.scope;
    this.tenantIds = Object.freeze(spec.tenantIds ? [...spec.tenantIds] : []);
    this.roles = Object.freeze(spec.roles ? [...spec.roles] : []);
    this.userIds = Object.freeze(spec.userIds ? [...spec.userIds] : []);
    Object.freeze(this);
  }

  static create(
    spec: NotificationAudienceSpec,
    actorScope: NotificationOwnerScope,
    actorTenantId: string | null,
  ): NotificationAudience {
    if (!spec || !spec.scope) {
      throw new ValidationError("Spesifikasi target audiens tidak valid.");
    }

    if (actorScope === NotificationOwnerScope.TENANT) {
      if (!actorTenantId) {
        throw new ForbiddenError("Tenant ID wajib ada untuk pengelola tenant.");
      }

      // Tenant can never target another tenant, regardless of audience scope.
      if (spec.tenantIds?.length) {
        if (
          spec.tenantIds &&
          spec.tenantIds.some((id) => id !== actorTenantId)
        ) {
          throw new ForbiddenError("Tenant tidak dapat memilih tenant lain.");
        }
      }

      return new NotificationAudience({
        scope: spec.scope,
        tenantIds: [actorTenantId],
        roles: spec.roles,
        userIds: spec.userIds,
      });
    }

    // Platform admin can target all or specific tenants
    return new NotificationAudience(spec);
  }

  toSpec(): NotificationAudienceSpec {
    return {
      scope: this.scope,
      tenantIds: [...this.tenantIds],
      roles: [...this.roles],
      userIds: [...this.userIds],
    };
  }
}
