import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import type { CreateUsersInput, CreateUsersUseCase } from "@/modules/user/application/usecases/CreateUsersUseCase";
import type { ImportUsersInput, ImportUsersUseCase } from "@/modules/user/application/usecases/ImportUsersUseCase";
import type { ListUsersInput, ListUsersUseCase } from "@/modules/user/application/usecases/ListUsersUseCase";
import type { BulkImportUsersResponseDto } from "@/modules/user/domain/dto/UserResponseDto";
import type { UserListResponseDto } from "@/modules/user/domain/dto/UserResponseDto";

export class UserService extends BaseService {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly createUsersUseCase: CreateUsersUseCase,
    private readonly importUsersUseCase: ImportUsersUseCase,
  ) {
    super("UserService");
  }

  async listUsers(
    input: ListUsersInput,
  ): Promise<Result<UserListResponseDto, Error>> {
    return this.execute(() => this.listUsersUseCase.execute(input));
  }

  async createUsers(
    input: CreateUsersInput,
  ): Promise<Result<Array<{ id: number; username: string }>, Error>> {
    return this.execute(() => this.createUsersUseCase.execute(input));
  }

  async importUsers(
    input: ImportUsersInput,
  ): Promise<Result<BulkImportUsersResponseDto, Error>> {
    return this.execute(() => this.importUsersUseCase.execute(input));
  }
}
