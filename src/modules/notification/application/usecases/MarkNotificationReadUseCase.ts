// Files: src/modules/notification/application/usecases/MarkNotificationReadUseCase.ts
import { BaseUseCase } from "@/core/base/BaseUseCase";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import type { MarkNotificationReadRequestDto } from "@/modules/notification/domain/dto/NotificationRequestDto";
import type { NotificationRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationRepositoryInterface";

export class MarkNotificationReadUseCase extends BaseUseCase<
  MarkNotificationReadRequestDto,
  void
> {
  constructor(private readonly repo: NotificationRepositoryInterface) {
    super();
  }

  async handle(dto: MarkNotificationReadRequestDto): Promise<void> {
    const { notificationId, scope } = dto;

    const notification = await this.repo.findById(notificationId);
    if (!notification) {
      throw new NotFoundError("Notifikasi tidak ditemukan.");
    }

    // Tenant isolation + recipient ownership + role check.
    if (!scope.owns(notification)) {
      throw new ForbiddenError("Anda tidak berhak mengubah notifikasi ini.");
    }

    // Idempotent: keep the original readAt timestamp.
    if (notification.isRead) return;

    await this.repo.markAsRead(notificationId, scope);
  }
}
