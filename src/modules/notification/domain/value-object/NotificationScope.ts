import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { AppRole } from "@/core/rbac/AppRole";

export interface NotificationScopeInput {
  recipientId: string;
  role: string;
  tenantId: string | null | undefined;
}

/** Minimal shape needed to decide whether a notification belongs to a scope. */
export interface NotificationOwnership {
  tenantId: string | null;
  recipientId: string;
  recipientRole: string;
}

/**
 * Trusted recipient scope for every notification read/write.
 *
 * - ADMIN   → platform scope (`tenantId = null`), any supplied tenant is ignored.
 * - TENANT / TEACHER / STUDENT → tenant scope; a non-empty tenantId is mandatory.
 *
 * Must be built from the authenticated session actor, never from request input.
 */
export class NotificationScope {
  private constructor(
    readonly tenantId: string | null,
    readonly recipientId: string,
    readonly recipientRole: AppRole,
  ) {
    Object.freeze(this);
  }

  static forRecipient(input: NotificationScopeInput): NotificationScope {
    const recipientId = input.recipientId?.trim() ?? "";
    if (!recipientId) {
      throw new ForbiddenError("Identitas penerima notifikasi tidak valid.");
    }

    if (!Object.values(AppRole).includes(input.role as AppRole)) {
      throw new ForbiddenError("Role tidak didukung untuk notifikasi.");
    }
    const role = input.role as AppRole;

    if (role === AppRole.ADMIN) {
      return new NotificationScope(null, recipientId, role);
    }

    const tenantId = input.tenantId?.trim() ?? "";
    if (!tenantId) {
      throw new ForbiddenError(
        `Konteks tenant wajib ada untuk notifikasi role '${role}'.`,
      );
    }

    return new NotificationScope(tenantId, recipientId, role);
  }

  get isPlatformScope(): boolean {
    return this.tenantId === null;
  }

  /** Tenant isolation + ownership + role check in one place. */
  owns(notification: NotificationOwnership): boolean {
    return (
      notification.tenantId === this.tenantId &&
      notification.recipientId === this.recipientId &&
      notification.recipientRole === this.recipientRole
    );
  }
}
