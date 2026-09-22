"use client";

import { useCallback, useState } from "react";
import type {
  CreateTenantRequestDTO,
  ListTenantsResponseDTO,
  TenantResponseDTO,
  UpdateTenantRequestDTO,
  UpdateTenantStatusRequestDTO,
} from "@/modules/tenant/domain/TenantDTOs";

interface ApiResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

type FetchState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

function initState<T>(): FetchState<T> {
  return { data: null, error: null, loading: false };
}

async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<{ data: T | null; error: string | null }> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const json = await res.json();

  if (!json.success) {
    return { data: null, error: json.error?.message ?? "Request gagal." };
  }

  return { data: json.data as T, error: null };
}

/**
 * useTenantApi — client-side hook for tenant CRUD operations.
 * Calls the internal Next.js BFF API only; never calls Moodle directly.
 */
export function useTenantApi() {
  const [listState, setListState] = useState<
    FetchState<ListTenantsResponseDTO>
  >(initState());
  const [detailState, setDetailState] = useState<FetchState<TenantResponseDTO>>(
    initState(),
  );
  const [mutationState, setMutationState] = useState<
    FetchState<TenantResponseDTO>
  >(initState());

  const listTenants = useCallback(
    async (params?: {
      status?: string;
      search?: string;
      page?: number;
      pageSize?: number;
    }) => {
      setListState({ data: null, error: null, loading: true });

      const query = new URLSearchParams();
      if (params?.status) query.set("status", params.status);
      if (params?.search) query.set("search", params.search);
      if (params?.page != null) query.set("page", String(params.page));
      if (params?.pageSize != null)
        query.set("pageSize", String(params.pageSize));

      const url = `/api/tenants${query.toString() ? `?${query}` : ""}`;
      const { data, error } = await apiFetch<ListTenantsResponseDTO>(url);

      setListState({ data, error, loading: false });
      return { data, error };
    },
    [],
  );

  const getTenant = useCallback(
    async (tenantId: string): Promise<ApiResult<TenantResponseDTO>> => {
      setDetailState({ data: null, error: null, loading: true });
      const { data, error } = await apiFetch<TenantResponseDTO>(
        `/api/tenants/${tenantId}`,
      );
      setDetailState({ data, error, loading: false });
      return { data, error, loading: false };
    },
    [],
  );

  const createTenant = useCallback(
    async (
      body: CreateTenantRequestDTO,
    ): Promise<ApiResult<TenantResponseDTO>> => {
      setMutationState({ data: null, error: null, loading: true });
      const { data, error } = await apiFetch<TenantResponseDTO>(
        "/api/tenants",
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      );
      setMutationState({ data, error, loading: false });
      return { data, error, loading: false };
    },
    [],
  );

  const updateTenant = useCallback(
    async (
      tenantId: string,
      body: UpdateTenantRequestDTO,
    ): Promise<ApiResult<TenantResponseDTO>> => {
      setMutationState({ data: null, error: null, loading: true });
      const { data, error } = await apiFetch<TenantResponseDTO>(
        `/api/tenants/${tenantId}`,
        { method: "PATCH", body: JSON.stringify(body) },
      );
      setMutationState({ data, error, loading: false });
      return { data, error, loading: false };
    },
    [],
  );

  const updateTenantStatus = useCallback(
    async (
      tenantId: string,
      body: UpdateTenantStatusRequestDTO,
    ): Promise<ApiResult<TenantResponseDTO>> => {
      setMutationState({ data: null, error: null, loading: true });
      const { data, error } = await apiFetch<TenantResponseDTO>(
        `/api/tenants/${tenantId}/status`,
        { method: "PATCH", body: JSON.stringify(body) },
      );
      setMutationState({ data, error, loading: false });
      return { data, error, loading: false };
    },
    [],
  );

  return {
    listTenants,
    getTenant,
    createTenant,
    updateTenant,
    updateTenantStatus,
    listState,
    detailState,
    mutationState,
  };
}
