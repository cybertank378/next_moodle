import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { GetUnreadCountRequestDto } from "@/modules/notification/domain/dto/NotificationRequestDto";
import type { NotificationRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationRepositoryInterface";

export class GetUnreadCountUseCase extends BaseUseCase<
  GetUnreadCountRequestDto,
  number
> {
  constructor(private readonly repo: NotificationRepositoryInterface) {
    super();
  }

  async handle(dto: GetUnreadCountRequestDto): Promise<number> {
    return this.repo.countUnread(dto.scope);
  }
}

