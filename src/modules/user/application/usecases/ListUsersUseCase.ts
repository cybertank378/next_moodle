import type { ListUsersQueryDto } from "@/modules/user/domain/dto/UserRequestDto";
import type { UserListResponseDto } from "@/modules/user/domain/dto/UserResponseDto";
import type { UserRepositoryInterface } from "@/modules/user/domain/interfaces/UserRepositoryInterface";

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(input: {
    tenantId: string;
    query?: ListUsersQueryDto;
  }): Promise<UserListResponseDto> {
    return this.userRepository.getUsers(input);
  }
}
