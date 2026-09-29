import type { CreateUserRequestDto } from "../../domain/dto/UserRequestDto";
import type { UserRepositoryInterface } from "../../domain/interfaces/UserRepositoryInterface";

export class CreateUsersUseCase {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(input: {
    tenantId: string;
    users: CreateUserRequestDto[];
  }): Promise<Array<{ id: number; username: string }>> {
    return this.userRepository.createUsers(input);
  }
}
