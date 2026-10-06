// Files: src/modules/notification/application/usecases/CreateNotificationUseCase.ts
import { ValidationError } from "@/core/errors/ValidationError";
import type { CreateNotificationRequestDto } from "@/modules/notification/domain/dto/NotificationRequestDto";
import type { NotificationEntity } from "@/modules/notification/domain/entity/NotificationEntity";
import type { NotificationOutboxRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationOutboxRepositoryInterface";
import type { NotificationRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationRepositoryInterface";
import type { PushNotificationAdapterInterface } from "@/modules/notification/domain/interfaces/PushNotificationAdapterInterface";

const MAX_TITLE_LENGTH = 200;
const MAX_BODY_LENGTH = 1000;

/** Only same-origin absolute app paths: `/x`, but not `//host` or `/\host`. */
function isInternalPath(path: string): boolean {
  return /^\/(?![/\\])[^\s]*$/.test(path);
}

/**
 * Entry point for server-side producers (domain events such as import
 * completion or exam result availability). Not exposed to the browser.
 */
export class CreateNotificationUseCase {
  constructor(
    private readonly repo: NotificationRepositoryInterface,
    private readonly wsAdapter?: PushNotificationAdapterInterface,
    private readonly outboxRepo?: NotificationOutboxRepositoryInterface,
  ) {}

  async execute(
    dto: CreateNotificationRequestDto,
  ): Promise<NotificationEntity> {
    const title = dto.title.trim();
    const body = dto.body.trim();
    const linkPath = dto.linkPath?.trim() || null;

    if (!title || title.length > MAX_TITLE_LENGTH) {
      throw new ValidationError(
        `Judul notifikasi wajib diisi (maks. ${MAX_TITLE_LENGTH} karakter).`,
      );
    }
    if (body.length > MAX_BODY_LENGTH) {
      throw new ValidationError(
        `Isi notifikasi maksimal ${MAX_BODY_LENGTH} karakter.`,
      );
    }
    if (linkPath !== null && !isInternalPath(linkPath)) {
      throw new ValidationError(
        "Tautan notifikasi harus berupa path internal aplikasi.",
      );
    }

    const notification = await this.repo.create({
      scope: dto.scope,
      type: dto.type,
      title,
      body,
      linkPath,
    });

    if (this.wsAdapter) {
      try {
        const result = await this.wsAdapter.dispatchNotification(notification);
        if (
          result &&
          result.outcome === "FAILED" &&
          result.isRetryable &&
          this.outboxRepo
        ) {
          await this.outboxRepo.enqueue(
            notification.id,
            "RETRY_PUSH_DISPATCH",
            { notificationId: notification.id },
          );
        }
      } catch (err) {
        console.error("Failed to dispatch real-time notification:", err);
        if (this.outboxRepo) {
          await this.outboxRepo
            .enqueue(notification.id, "RETRY_PUSH_DISPATCH", {
              notificationId: notification.id,
            })
            .catch((e) => console.error("Failed to enqueue outbox:", e));
        }
      }
    }

    return notification;
  }
}
