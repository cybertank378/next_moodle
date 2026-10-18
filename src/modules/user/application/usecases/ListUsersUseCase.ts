import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { ListUsersQueryDto } from "@/modules/user/domain/dto/UserRequestDto";
import type { UserListResponseDto } from "@/modules/user/domain/dto/UserResponseDto";
import type { UserRepositoryInterface } from "@/modules/user/domain/interfaces/UserRepositoryInterface";

export interface ListUsersInput {
  tenantId: string;
  query?: ListUsersQueryDto;
}

export class ListUsersUseCase extends BaseUseCase<
  ListUsersInput,
  UserListResponseDto
> {
  constructor(private readonly userRepository: UserRepositoryInterface) {
    super();
  }

  async handle(input: ListUsersInput): Promise<UserListResponseDto> {
    return this.userRepository.getUsers(input);
  }
}

