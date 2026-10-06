// Files: src/modules/notification/domain/value-object/NotificationSchedule.ts

import { ValidationError } from "@/core/errors/ValidationError";

export class NotificationSchedule {
  readonly scheduledAt: Date | null;
  readonly timezone: string;

  private constructor(scheduledAt: Date | null, timezone: string) {
    this.scheduledAt = scheduledAt;
    this.timezone = timezone;
    Object.freeze(this);
  }

  static create(
    scheduledAt?: Date | string | null,
    timezone?: string | null,
  ): NotificationSchedule {
    const tz = timezone?.trim() || "Asia/Jakarta";

    if (!scheduledAt) {
      return new NotificationSchedule(null, tz);
    }

    const date =
      typeof scheduledAt === "string" ? new Date(scheduledAt) : scheduledAt;
    if (isNaN(date.getTime())) {
      throw new ValidationError("Format waktu jadwal pengiriman tidak valid.");
    }

    if (date.getTime() <= Date.now()) {
      throw new ValidationError("Jadwal pengiriman harus di waktu masa depan.");
    }

    return new NotificationSchedule(date, tz);
  }
}
