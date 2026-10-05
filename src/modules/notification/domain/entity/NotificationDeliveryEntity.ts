// Files: src/modules/notification/domain/entity/NotificationDeliveryEntity.ts

import {
  NotificationChannel,
  NotificationDeliveryStatus,
} from "@/modules/notification/domain/types/NotificationTypes";

export interface NotificationDeliveryProps {
  id: string;
  campaignId: string;
  recipientId: string;
  recipientRole: string;
  tenantId: string | null;
  channel: NotificationChannel;
  deviceToken?: string | null;
  status?: NotificationDeliveryStatus;
  attempts?: number;
  nextAttemptAt?: Date | null;
  providerMessageId?: string | null;
  errorCode?: string | null;
  acceptedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class NotificationDeliveryEntity {
  readonly id: string;
  readonly campaignId: string;
  readonly recipientId: string;
  readonly recipientRole: string;
  readonly tenantId: string | null;
  readonly channel: NotificationChannel;
  readonly deviceToken: string | null;
  private _status: NotificationDeliveryStatus;
  private _attempts: number;
  private _nextAttemptAt: Date | null;
  private _providerMessageId: string | null;
  private _errorCode: string | null;
  private _acceptedAt: Date | null;
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: NotificationDeliveryProps) {
    this.id = props.id;
    this.campaignId = props.campaignId;
    this.recipientId = props.recipientId;
    this.recipientRole = props.recipientRole;
    this.tenantId = props.tenantId;
    this.channel = props.channel;
    this.deviceToken = props.deviceToken ?? null;
    this._status = props.status ?? NotificationDeliveryStatus.PENDING;
    this._attempts = props.attempts ?? 0;
    this._nextAttemptAt = props.nextAttemptAt ?? null;
    this._providerMessageId = props.providerMessageId ?? null;
    this._errorCode = props.errorCode ?? null;
    this._acceptedAt = props.acceptedAt ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get status(): NotificationDeliveryStatus {
    return this._status;
  }

  get attempts(): number {
    return this._attempts;
  }

  get nextAttemptAt(): Date | null {
    return this._nextAttemptAt;
  }

  get providerMessageId(): string | null {
    return this._providerMessageId;
  }

  get errorCode(): string | null {
    return this._errorCode;
  }

  get acceptedAt(): Date | null {
    return this._acceptedAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get isEligibleForRetry(): boolean {
    return this._status === NotificationDeliveryStatus.FAILED && this._attempts < 3;
  }

  markAccepted(providerMessageId?: string): void {
    this._status = NotificationDeliveryStatus.ACCEPTED;
    this._attempts += 1;
    this._providerMessageId = providerMessageId ?? null;
    this._acceptedAt = new Date();
    this._nextAttemptAt = null;
    this._errorCode = null;
    this._updatedAt = new Date();
  }

  markFailed(errorCode?: string, nextAttemptAt?: Date | null): void {
    this._status = NotificationDeliveryStatus.FAILED;
    this._attempts += 1;
    this._errorCode = errorCode ?? "UNKNOWN_ERROR";
    this._nextAttemptAt = nextAttemptAt ?? null;
    this._updatedAt = new Date();
  }

  markSkipped(reason?: string): void {
    this._status = NotificationDeliveryStatus.SKIPPED;
    this._errorCode = reason ?? "NO_DEVICE";
    this._nextAttemptAt = null;
    this._updatedAt = new Date();
  }
}
