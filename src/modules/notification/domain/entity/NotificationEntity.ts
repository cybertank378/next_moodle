import { AppRole } from "@/core/rbac/AppRole";
import type { NotificationType } from "@/modules/notification/domain/types/NotificationTypes";

export interface NotificationProps {
  id: string;
  /** `null` only for ADMIN platform-scoped notifications. */
  tenantId: string | null;
  recipientId: string;
  recipientRole: string;
  type: NotificationType;
  title: string;
  body: string;
  linkPath: string | null;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
}

export class NotificationEntity {
  private readonly _props: Readonly<NotificationProps>;

  constructor(props: NotificationProps) {
    if (!props.id) throw new Error("NotificationEntity: id is required");
    if (!props.recipientId)
      throw new Error("NotificationEntity: recipientId is required");
    if (!Object.values(AppRole).includes(props.recipientRole as AppRole)) {
      throw new Error("NotificationEntity: recipientRole is invalid");
    }

    const isPlatformRecipient = props.recipientRole === AppRole.ADMIN;
    if (isPlatformRecipient && props.tenantId !== null) {
      throw new Error(
        "NotificationEntity: tenantId must be null for ADMIN recipients",
      );
    }
    if (!isPlatformRecipient && !props.tenantId) {
      throw new Error(
        "NotificationEntity: tenantId is required for tenant-scoped recipients",
      );
    }

    if (!props.title) throw new Error("NotificationEntity: title is required");

    this._props = Object.freeze({ ...props });
  }

  get id(): string {
    return this._props.id;
  }

  get tenantId(): string | null {
    return this._props.tenantId;
  }

  get recipientId(): string {
    return this._props.recipientId;
  }

  get recipientRole(): string {
    return this._props.recipientRole;
  }

  get type(): NotificationType {
    return this._props.type;
  }

  get title(): string {
    return this._props.title;
  }

  get body(): string {
    return this._props.body;
  }

  get linkPath(): string | null {
    return this._props.linkPath;
  }

  get isRead(): boolean {
    return this._props.isRead;
  }

  get isUnread(): boolean {
    return !this._props.isRead;
  }

  get readAt(): Date | null {
    return this._props.readAt;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  /** Returns a new entity with isRead=true and readAt set to now. Immutable. */
  markAsRead(): NotificationEntity {
    return new NotificationEntity({
      ...this._props,
      isRead: true,
      readAt: new Date(),
    });
  }

  toJSON(): NotificationProps {
    return { ...this._props };
  }
}
