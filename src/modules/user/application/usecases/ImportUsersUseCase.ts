import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { BulkImportUsersRequestDto } from "@/modules/user/domain/dto/UserRequestDto";
import type { BulkImportUsersResponseDto } from "@/modules/user/domain/dto/UserResponseDto";
import type { UserRepositoryInterface } from "@/modules/user/domain/interfaces/UserRepositoryInterface";

export interface ImportUsersInput {
  tenantId: string;
  request: BulkImportUsersRequestDto;
}

export class ImportUsersUseCase extends BaseUseCase<
  ImportUsersInput,
  BulkImportUsersResponseDto
> {
  constructor(private readonly userRepository: UserRepositoryInterface) {
    super();
  }

  async handle(input: ImportUsersInput): Promise<BulkImportUsersResponseDto> {
    return this.userRepository.importUsers({
      tenantId: input.tenantId,
      csvContent: input.request.csvContent,
      defaultPassword: input.request.defaultPassword,
      users: input.request.users,
    });
  }
}

