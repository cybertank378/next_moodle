import type { GetNotificationsRequestDto } from "../../domain/dto/NotificationRequestDto";
import type { PaginatedNotificationsResponseDto } from "../../domain/dto/NotificationResponseDto";
import type { NotificationRepositoryInterface } from "../../domain/interfaces/NotificationRepositoryInterface";
import { NotificationMapper } from "../../domain/mapper/NotificationMapper";

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
