import type { MarkAllReadRequestDto } from "@/modules/notification/domain/dto/NotificationRequestDto";
import type { NotificationRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationRepositoryInterface";

export class MarkAllReadUseCase {
  constructor(private readonly repo: NotificationRepositoryInterface) {}

  /** Returns the number of notifications marked as read. */
  async execute(dto: MarkAllReadRequestDto): Promise<number> {
    return this.repo.markAllAsRead(dto.scope);
  }
}
