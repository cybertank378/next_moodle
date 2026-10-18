import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { CreateUserRequestDto } from "@/modules/user/domain/dto/UserRequestDto";
import type { UserRepositoryInterface } from "@/modules/user/domain/interfaces/UserRepositoryInterface";

export interface CreateUsersInput {
  tenantId: string;
  users: CreateUserRequestDto[];
}

export class CreateUsersUseCase extends BaseUseCase<
  CreateUsersInput,
  Array<{ id: number; username: string }>
> {
  constructor(private readonly userRepository: UserRepositoryInterface) {
    super();
  }

  async handle(input: CreateUsersInput): Promise<Array<{ id: number; username: string }>> {
    return this.userRepository.createUsers(input);
  }
}

