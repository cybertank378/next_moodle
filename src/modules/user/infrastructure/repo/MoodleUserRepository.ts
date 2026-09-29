import "server-only";

import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import type {
  CreateUserRequestDto,
  ListUsersQueryDto,
  UpdateUserRequestDto,
} from "../../domain/dto/UserRequestDto";
import type {
  BulkImportUsersResponseDto,
  UserImportRowErrorDto,
  UserListResponseDto,
  UserSummaryResponseDto,
} from "../../domain/dto/UserResponseDto";
import type { UserRepositoryInterface } from "../../domain/interfaces/UserRepositoryInterface";
import { UserImportParser } from "../../domain/mapper/UserImportParser";

interface RawMoodleUser {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  idnumber?: string;
  department?: string;
  institution?: string;
  suspended?: boolean;
  firstaccess?: number;
  lastaccess?: number;
  profileimageurl?: string;
}

interface RawGetUsersResponse {
  users: RawMoodleUser[];
  warnings?: unknown[];
}

export class MoodleUserRepository implements UserRepositoryInterface {
  constructor(
    private readonly clientFactory: MoodleClientFactory,
    private readonly clientOverride?: MoodleClient,
  ) {}

  private async resolveClient(
    tenantId: string,
    clientOverride?: MoodleClient,
  ): Promise<MoodleClient> {
    if (clientOverride) return clientOverride;
    if (this.clientOverride) return this.clientOverride;
    return this.clientFactory.createClientForTenant(
      { tenantId, tenantSlug: tenantId, status: "ACTIVE" },
      "admin",
    );
  }

  async getUsers(input: {
    tenantId: string;
    query?: ListUsersQueryDto;
    client?: MoodleClient;
  }): Promise<UserListResponseDto> {
    const client = await this.resolveClient(input.tenantId, input.client);

    const criteria: Array<{ key: string; value: string }> = [];
    if (input.query?.search && input.query.search.trim().length > 0) {
      criteria.push({
        key: "search",
        value: `%${input.query.search.trim()}%`,
      });
    } else {
      criteria.push({
        key: "email",
        value: "%",
      });
    }

    const res = await client.call<RawGetUsersResponse>("core_user_get_users", {
      criteria,
    });

    const rawUsers = res?.users ?? [];
    const page = input.query?.page ?? 1;
    const pageSize = input.query?.pageSize ?? 20;

    const mappedUsers: UserSummaryResponseDto[] = rawUsers.map((raw) => ({
      id: raw.id,
      username: raw.username,
      firstname: raw.firstname,
      lastname: raw.lastname,
      fullname: raw.fullname || `${raw.firstname} ${raw.lastname}`.trim(),
      email: raw.email,
      idnumber: raw.idnumber ?? null,
      department: raw.department ?? null,
      institution: raw.institution ?? null,
      suspended: Boolean(raw.suspended),
      firstAccess: raw.firstaccess ?? null,
      lastAccess: raw.lastaccess ?? null,
      profileImageUrl: raw.profileimageurl ?? null,
    }));

    const startIndex = (page - 1) * pageSize;
    const paginatedUsers = mappedUsers.slice(startIndex, startIndex + pageSize);

    return {
      users: paginatedUsers,
      total: mappedUsers.length,
      page,
      pageSize,
    };
  }

  async getUserById(input: {
    tenantId: string;
    userId: number;
    client?: MoodleClient;
  }): Promise<UserSummaryResponseDto | null> {
    const client = await this.resolveClient(input.tenantId, input.client);

    const rawUsers = await client.call<RawMoodleUser[]>(
      "core_user_get_users_by_field",
      {
        field: "id",
        values: [input.userId],
      },
    );

    const raw = rawUsers?.[0];
    if (!raw) return null;

    return {
      id: raw.id,
      username: raw.username,
      firstname: raw.firstname,
      lastname: raw.lastname,
      fullname: raw.fullname || `${raw.firstname} ${raw.lastname}`.trim(),
      email: raw.email,
      idnumber: raw.idnumber ?? null,
      department: raw.department ?? null,
      institution: raw.institution ?? null,
      suspended: Boolean(raw.suspended),
      firstAccess: raw.firstaccess ?? null,
      lastAccess: raw.lastaccess ?? null,
      profileImageUrl: raw.profileimageurl ?? null,
    };
  }

  async createUsers(input: {
    tenantId: string;
    users: CreateUserRequestDto[];
    client?: MoodleClient;
  }): Promise<Array<{ id: number; username: string }>> {
    if (input.users.length === 0) return [];
    const client = await this.resolveClient(input.tenantId, input.client);

    const payloadUsers = UserImportParser.toMoodleCreateUsersPayload(
      input.users,
    );
    const created = await client.call<Array<{ id: number; username: string }>>(
      "core_user_create_users",
      {
        users: payloadUsers,
      },
    );

    return created ?? [];
  }

  async updateUser(input: {
    tenantId: string;
    user: UpdateUserRequestDto;
    client?: MoodleClient;
  }): Promise<boolean> {
    const client = await this.resolveClient(input.tenantId, input.client);

    await client.call("core_user_update_users", {
      users: [
        {
          id: input.user.id,
          ...(input.user.username ? { username: input.user.username } : {}),
          ...(input.user.firstname ? { firstname: input.user.firstname } : {}),
          ...(input.user.lastname ? { lastname: input.user.lastname } : {}),
          ...(input.user.email ? { email: input.user.email } : {}),
          ...(input.user.password ? { password: input.user.password } : {}),
          ...(input.user.idnumber ? { idnumber: input.user.idnumber } : {}),
          ...(typeof input.user.suspended === "boolean"
            ? { suspended: input.user.suspended ? 1 : 0 }
            : {}),
        },
      ],
    });

    return true;
  }

  async importUsers(input: {
    tenantId: string;
    csvContent?: string;
    defaultPassword?: string;
    users?: CreateUserRequestDto[];
    client?: MoodleClient;
  }): Promise<BulkImportUsersResponseDto> {
    let usersToCreate: CreateUserRequestDto[] = input.users ?? [];
    const errors: UserImportRowErrorDto[] = [];

    if (input.csvContent) {
      const parsed = UserImportParser.parseCsv(
        input.csvContent,
        input.defaultPassword,
      );
      usersToCreate = [...usersToCreate, ...parsed.users];
      errors.push(...parsed.errors);
    }

    if (usersToCreate.length === 0) {
      return {
        importedCount: 0,
        failedCount: errors.length,
        createdUsers: [],
        errors,
      };
    }

    const createdUsers = await this.createUsers({
      tenantId: input.tenantId,
      users: usersToCreate,
      client: input.client,
    });

    const distinctFailedRows = new Set(errors.map((e) => e.row)).size;

    return {
      importedCount: createdUsers.length,
      failedCount:
        distinctFailedRows + (usersToCreate.length - createdUsers.length),
      createdUsers,
      errors,
    };
  }
}
