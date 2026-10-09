import type { GetUnreadCountRequestDto } from "@/modules/notification/domain/dto/NotificationRequestDto";
import type { NotificationRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationRepositoryInterface";

export class GetUnreadCountUseCase {
  constructor(private readonly repo: NotificationRepositoryInterface) {}

  async execute(dto: GetUnreadCountRequestDto): Promise<number> {
    return this.repo.countUnread(dto.scope);
  }
}
