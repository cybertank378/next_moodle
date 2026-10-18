import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { MarkAllReadRequestDto } from "@/modules/notification/domain/dto/NotificationRequestDto";
import type { NotificationRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationRepositoryInterface";

export class MarkAllReadUseCase extends BaseUseCase<
  MarkAllReadRequestDto,
  number
> {
  constructor(private readonly repo: NotificationRepositoryInterface) {
    super();
  }

  /** Returns the number of notifications marked as read. */
  async handle(dto: MarkAllReadRequestDto): Promise<number> {
    return this.repo.markAllAsRead(dto.scope);
  }
}

