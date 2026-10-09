import type { MoodleClient } from "@/core/moodle/types";
import type {
  CreateUserRequestDto,
  ListUsersQueryDto,
  UpdateUserRequestDto,
} from "@/modules/user/domain/dto/UserRequestDto";
import type {
  BulkImportUsersResponseDto,
  UserListResponseDto,
  UserSummaryResponseDto,
} from "@/modules/user/domain/dto/UserResponseDto";

export interface UserRepositoryInterface {
  getUsers(input: {
    tenantId: string;
    query?: ListUsersQueryDto;
    client?: MoodleClient;
  }): Promise<UserListResponseDto>;

  getUserById(input: {
    tenantId: string;
    userId: number;
    client?: MoodleClient;
  }): Promise<UserSummaryResponseDto | null>;

  createUsers(input: {
    tenantId: string;
    users: CreateUserRequestDto[];
    client?: MoodleClient;
  }): Promise<Array<{ id: number; username: string }>>;

  updateUser(input: {
    tenantId: string;
    user: UpdateUserRequestDto;
    client?: MoodleClient;
  }): Promise<boolean>;

  importUsers(input: {
    tenantId: string;
    csvContent?: string;
    defaultPassword?: string;
    users?: CreateUserRequestDto[];
    client?: MoodleClient;
  }): Promise<BulkImportUsersResponseDto>;

  importStudentsCustom?(input: {
    tenantId: string;
    users: CreateUserRequestDto[];
    courseId?: number;
    groupName?: string;
    client?: MoodleClient;
  }): Promise<{
    createdUsers: Array<{ id: number; username: string }>;
    usedCustomApi: boolean;
  }>;
}
