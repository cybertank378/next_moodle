import type { GetUnreadCountRequestDto } from "../../domain/dto/NotificationRequestDto";
import type { NotificationRepositoryInterface } from "../../domain/interfaces/NotificationRepositoryInterface";

export class GetUnreadCountUseCase {
  constructor(private readonly repo: NotificationRepositoryInterface) {}

  async execute(dto: GetUnreadCountRequestDto): Promise<number> {
    return this.repo.countUnread(dto.scope);
  }
}
