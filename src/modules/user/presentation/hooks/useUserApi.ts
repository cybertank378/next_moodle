"use client";

import { useCallback, useState } from "react";
import { type RequestState, request } from "@/libs/apiClient";
import type {
  BulkImportUsersRequestDto,
  CreateUserRequestDto,
  ListUsersQueryDto,
} from "../../domain/dto/UserRequestDto";
import type {
  BulkImportUsersResponseDto,
  UserListResponseDto,
} from "../../domain/dto/UserResponseDto";

export function useUserApi() {
  const [usersState, setUsersState] = useState<
    RequestState<UserListResponseDto>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const [createState, setCreateState] = useState<
    RequestState<Array<{ id: number; username: string }>>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const [importState, setImportState] = useState<
    RequestState<BulkImportUsersResponseDto>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const listUsers = useCallback(async (params?: ListUsersQueryDto) => {
    setUsersState({ data: null, error: null, loading: true });
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", String(params.page));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));

    const path = query.toString() ? `/api/users?${query}` : "/api/users";
    const result = await request<UserListResponseDto>(path);
    setUsersState({ ...result, loading: false });
    return result;
  }, []);

  const createUser = useCallback(
    async (payload: CreateUserRequestDto | CreateUserRequestDto[]) => {
      setCreateState({ data: null, error: null, loading: true });
      const body = Array.isArray(payload) ? { users: payload } : payload;
      const result = await request<Array<{ id: number; username: string }>>(
        "/api/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      setCreateState({ ...result, loading: false });
      return result;
    },
    [],
  );

  const importUsers = useCallback(
    async (payload: BulkImportUsersRequestDto) => {
      setImportState({ data: null, error: null, loading: true });
      const result = await request<BulkImportUsersResponseDto>(
        "/api/users/import",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      setImportState({ ...result, loading: false });
      return result;
    },
    [],
  );

  return {
    usersState,
    createState,
    importState,
    listUsers,
    createUser,
    importUsers,
  };
}
