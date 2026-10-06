// Files: src/modules/notification/domain/entity/NotificationCampaignEntity.ts

import { ValidationError } from "@/core/errors/ValidationError";
import {
  NotificationAudienceScope,
  type NotificationAudienceSpec,
  NotificationChannel,
  NotificationDispatchStatus,
  type NotificationOwnerScope,
} from "@/modules/notification/domain/types/NotificationTypes";

export interface NotificationCampaignProps {
  id: string;
  ownerScope: NotificationOwnerScope;
  ownerTenantId: string | null;
  createdById: string;
  createdByRole: string;
  title: string;
  contentJson: Record<string, unknown>;
  contentSchemaVersion?: number;
  sanitizedHtml: string;
  plainText: string;
  pushSummary?: string | null;
  audienceSpec: NotificationAudienceSpec;
  channels: NotificationChannel[];
  dispatchStatus?: NotificationDispatchStatus;
  scheduledAt?: Date | null;
  timezone?: string | null;
  archivedAt?: Date | null;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class NotificationCampaignEntity {
  readonly id: string;
  readonly ownerScope: NotificationOwnerScope;
  readonly ownerTenantId: string | null;
  readonly createdById: string;
  readonly createdByRole: string;
  private _title: string;
  private _contentJson: Record<string, unknown>;
  private _contentSchemaVersion: number;
  private _sanitizedHtml: string;
  private _plainText: string;
  private _pushSummary: string | null;
  private _audienceSpec: NotificationAudienceSpec;
  private _channels: NotificationChannel[];
  private _dispatchStatus: NotificationDispatchStatus;
  private _scheduledAt: Date | null;
  private _timezone: string | null;
  private _archivedAt: Date | null;
  private _version: number;
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: NotificationCampaignProps) {
    const trimmedTitle = props.title?.trim();
    if (!trimmedTitle) {
      throw new ValidationError("Judul pengumuman/notifikasi wajib diisi.");
    }
    if (trimmedTitle.length > 200) {
      throw new ValidationError(
        "Judul notifikasi tidak boleh melebihi 200 karakter.",
      );
    }

    this.id = props.id;
    this.ownerScope = props.ownerScope;
    this.ownerTenantId = props.ownerTenantId;
    this.createdById = props.createdById;
    this.createdByRole = props.createdByRole;
    this._title = trimmedTitle;
    this._contentJson = props.contentJson || {};
    this._contentSchemaVersion = props.contentSchemaVersion ?? 1;
    this._sanitizedHtml = props.sanitizedHtml || "";
    this._plainText = props.plainText || "";
    this._pushSummary = props.pushSummary?.trim() || null;
    this._audienceSpec = props.audienceSpec || {
      scope: NotificationAudienceScope.ALL,
    };
    this._channels =
      props.channels.length > 0 ? props.channels : [NotificationChannel.IN_APP];
    this._dispatchStatus =
      props.dispatchStatus ?? NotificationDispatchStatus.DRAFT;
    this._scheduledAt = props.scheduledAt ?? null;
    this._timezone = props.timezone ?? "Asia/Jakarta";
    this._archivedAt = props.archivedAt ?? null;
    this._version = props.version ?? 1;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get title(): string {
    return this._title;
  }

  get contentJson(): Record<string, unknown> {
    return this._contentJson;
  }

  get contentSchemaVersion(): number {
    return this._contentSchemaVersion;
  }

  get sanitizedHtml(): string {
    return this._sanitizedHtml;
  }

  get plainText(): string {
    return this._plainText;
  }

  get pushSummary(): string | null {
    return this._pushSummary;
  }

  get audienceSpec(): NotificationAudienceSpec {
    return this._audienceSpec;
  }

  get channels(): NotificationChannel[] {
    return [...this._channels];
  }

  get dispatchStatus(): NotificationDispatchStatus {
    return this._dispatchStatus;
  }

  get scheduledAt(): Date | null {
    return this._scheduledAt;
  }

  get timezone(): string | null {
    return this._timezone;
  }

  get archivedAt(): Date | null {
    return this._archivedAt;
  }

  get version(): number {
    return this._version;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get isArchived(): boolean {
    return this._archivedAt !== null;
  }

  get canEdit(): boolean {
    return this._dispatchStatus === NotificationDispatchStatus.DRAFT;
  }

  get canDelete(): boolean {
    return this._dispatchStatus === NotificationDispatchStatus.DRAFT;
  }

  get canSchedule(): boolean {
    return this._dispatchStatus === NotificationDispatchStatus.DRAFT;
  }

  get canSend(): boolean {
    return (
      this._dispatchStatus === NotificationDispatchStatus.DRAFT ||
      this._dispatchStatus === NotificationDispatchStatus.SCHEDULED
    );
  }

  get canCancel(): boolean {
    return (
      this._dispatchStatus === NotificationDispatchStatus.SCHEDULED ||
      this._dispatchStatus === NotificationDispatchStatus.QUEUED
    );
  }

  updateContent(data: {
    title: string;
    contentJson: Record<string, unknown>;
    sanitizedHtml: string;
    plainText: string;
    pushSummary?: string | null;
    audienceSpec?: NotificationAudienceSpec;
    channels?: NotificationChannel[];
  }): void {
    if (!this.canEdit) {
      throw new ValidationError(
        "Campaign hanya dapat diubah saat berstatus DRAFT.",
      );
    }

    const trimmedTitle = data.title.trim();
    if (!trimmedTitle) {
      throw new ValidationError("Judul pengumuman/notifikasi wajib diisi.");
    }
    if (trimmedTitle.length > 200) {
      throw new ValidationError(
        "Judul notifikasi tidak boleh melebihi 200 karakter.",
      );
    }

    this._title = trimmedTitle;
    this._contentJson = data.contentJson;
    this._sanitizedHtml = data.sanitizedHtml;
    this._plainText = data.plainText;
    if (data.pushSummary !== undefined) {
      this._pushSummary = data.pushSummary?.trim() || null;
    }
    if (data.audienceSpec) {
      this._audienceSpec = data.audienceSpec;
    }
    if (data.channels && data.channels.length > 0) {
      this._channels = data.channels;
    }
    this._version += 1;
    this._updatedAt = new Date();
  }

  schedule(date: Date, timezone?: string): void {
    if (this._dispatchStatus !== NotificationDispatchStatus.DRAFT) {
      throw new ValidationError("Hanya draft yang dapat dijadwalkan.");
    }

    if (date.getTime() <= Date.now()) {
      throw new ValidationError("Waktu jadwal pengiriman harus di masa depan.");
    }

    this._scheduledAt = date;
    if (timezone) {
      this._timezone = timezone;
    }
    this._dispatchStatus = NotificationDispatchStatus.SCHEDULED;
    this._version += 1;
    this._updatedAt = new Date();
  }

  unschedule(): void {
    if (this._dispatchStatus !== NotificationDispatchStatus.SCHEDULED) {
      throw new ValidationError(
        "Hanya campaign terjadwal yang dapat dibatalkan jadwalnya.",
      );
    }

    this._scheduledAt = null;
    this._dispatchStatus = NotificationDispatchStatus.DRAFT;
    this._version += 1;
    this._updatedAt = new Date();
  }

  queue(): void {
    if (
      this._dispatchStatus !== NotificationDispatchStatus.DRAFT &&
      this._dispatchStatus !== NotificationDispatchStatus.SCHEDULED
    ) {
      throw new ValidationError(
        "Campaign tidak dalam status yang dapat dikirim.",
      );
    }

    this._dispatchStatus = NotificationDispatchStatus.QUEUED;
    this._version += 1;
    this._updatedAt = new Date();
  }

  markProcessing(): void {
    this._dispatchStatus = NotificationDispatchStatus.PROCESSING;
    this._version += 1;
    this._updatedAt = new Date();
  }

  markCompleted(): void {
    this._dispatchStatus = NotificationDispatchStatus.COMPLETED;
    this._version += 1;
    this._updatedAt = new Date();
  }

  markPartialFailed(): void {
    this._dispatchStatus = NotificationDispatchStatus.PARTIAL_FAILED;
    this._version += 1;
    this._updatedAt = new Date();
  }

  markFailed(): void {
    this._dispatchStatus = NotificationDispatchStatus.FAILED;
    this._version += 1;
    this._updatedAt = new Date();
  }

  cancel(): void {
    if (!this.canCancel) {
      throw new ValidationError(
        "Campaign tidak dapat dibatalkan pada status saat ini.",
      );
    }

    this._dispatchStatus = NotificationDispatchStatus.CANCELLED;
    this._version += 1;
    this._updatedAt = new Date();
  }

  toggleArchive(): void {
    if (this._archivedAt) {
      this._archivedAt = null;
    } else {
      this._archivedAt = new Date();
    }
    this._version += 1;
    this._updatedAt = new Date();
  }
}
