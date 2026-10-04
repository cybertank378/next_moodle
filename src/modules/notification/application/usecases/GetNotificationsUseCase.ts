import type { GetNotificationsRequestDto } from "@/modules/notification/domain/dto/NotificationRequestDto";
import type { PaginatedNotificationsResponseDto } from "@/modules/notification/domain/dto/NotificationResponseDto";
import type { NotificationRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationRepositoryInterface";
import { NotificationMapper } from "@/modules/notification/domain/mapper/NotificationMapper";

export class GetNotificationsUseCase {
  constructor(private readonly repo: NotificationRepositoryInterface) {}

  async execute(
    dto: GetNotificationsRequestDto,
  ): Promise<PaginatedNotificationsResponseDto> {
    const { scope, tab, page, limit } = dto;

    const { items, total } = await this.repo.findByRecipient({
      scope,
      isRead: tab === "read",
      page,
      limit,
    });

    return {
      items: items.map(NotificationMapper.toDto),
      total,
      page,
      limit,
      totalPages: total === 0 ? 1 : Math.ceil(total / limit),
    };
  }
}
