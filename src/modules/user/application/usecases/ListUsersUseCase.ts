import type { ListUsersQueryDto } from "../../domain/dto/UserRequestDto";
import type { UserListResponseDto } from "../../domain/dto/UserResponseDto";
import type { UserRepositoryInterface } from "../../domain/interfaces/UserRepositoryInterface";

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(input: {
    tenantId: string;
    query?: ListUsersQueryDto;
  }): Promise<UserListResponseDto> {
    return this.userRepository.getUsers(input);
  }
}
