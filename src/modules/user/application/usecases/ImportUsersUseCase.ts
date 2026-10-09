import type { BulkImportUsersRequestDto } from "@/modules/user/domain/dto/UserRequestDto";
import type { BulkImportUsersResponseDto } from "@/modules/user/domain/dto/UserResponseDto";
import type { UserRepositoryInterface } from "@/modules/user/domain/interfaces/UserRepositoryInterface";

export class ImportUsersUseCase {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(input: {
    tenantId: string;
    request: BulkImportUsersRequestDto;
  }): Promise<BulkImportUsersResponseDto> {
    return this.userRepository.importUsers({
      tenantId: input.tenantId,
      csvContent: input.request.csvContent,
      defaultPassword: input.request.defaultPassword,
      users: input.request.users,
    });
  }
}
