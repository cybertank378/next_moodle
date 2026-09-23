"use client";

import { useCallback, useState } from "react";
import type {
  ConfigureTenantCredentialRequestDTO,
  CreateTenantRequestDTO,
  ListTenantsResponseDTO,
  TenantResponseDTO,
  UpdateTenantRequestDTO,
  UpdateTenantStatusRequestDTO,
} from "@/modules/tenants/domain/dto/TenantDTOs";

interface RequestState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { message?: string };
}

async function request<T>(
  url: string,
  options?: RequestInit,
): Promise<{ data: T | null; error: string | null }> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  const body = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || !body.success || body.data === undefined) {
    return { data: null, error: body.error?.message ?? "Permintaan gagal." };
  }
  return { data: body.data, error: null };
}

export function useTenantsApi() {
  const [listState, setListState] = useState<RequestState<ListTenantsResponseDTO>>({
    data: null,
    error: null,
    loading: false,
  });
  const [detailState, setDetailState] = useState<RequestState<TenantResponseDTO>>({
    data: null,
    error: null,
    loading: false,
  });
  const [mutationState, setMutationState] = useState<RequestState<TenantResponseDTO>>({
    data: null,
    error: null,
    loading: false,
  });

  const listTenants = useCallback(async (params: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
  }) => {
    setListState({ data: null, error: null, loading: true });
    const query = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
    });
    if (params.search) query.set("search", params.search);
    if (params.status) query.set("status", params.status);
    const result = await request<ListTenantsResponseDTO>(`/api/tenants?${query}`);
    setListState({ ...result, loading: false });
    return result;
  }, []);

  const getTenant = useCallback(async (tenantId: string) => {
    setDetailState({ data: null, error: null, loading: true });
    const result = await request<TenantResponseDTO>(`/api/tenants/${tenantId}`);
    setDetailState({ ...result, loading: false });
    return result;
  }, []);

  const mutate = useCallback(
    async (url: string, method: string, body?: unknown) => {
      setMutationState({ data: null, error: null, loading: true });
      const result = await request<TenantResponseDTO>(url, {
        method,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      setMutationState({ ...result, loading: false });
      return result;
    },
    [],
  );

  const createTenant = useCallback(
    (body: CreateTenantRequestDTO) => mutate("/api/tenants", "POST", body),
    [mutate],
  );

  const updateTenant = useCallback(
    (tenantId: string, body: UpdateTenantRequestDTO) =>
      mutate(`/api/tenants/${tenantId}`, "PATCH", body),
    [mutate],
  );

  const updateTenantStatus = useCallback(
    (tenantId: string, body: UpdateTenantStatusRequestDTO) =>
      mutate(`/api/tenants/${tenantId}/status`, "PATCH", body),
    [mutate],
  );

  const configureCredential = useCallback(
    (tenantId: string, body: ConfigureTenantCredentialRequestDTO) =>
      mutate(`/api/tenants/${tenantId}/credentials`, "PUT", body),
    [mutate],
  );

  const deleteTenant = useCallback(async (tenantId: string) => {
    const response = await fetch(`/api/tenants/${tenantId}`, {
      method: "DELETE",
    });
    const body = (await response.json()) as ApiEnvelope<{ id: string }>;
    return {
      data: response.ok && body.success ? (body.data ?? null) : null,
      error:
        response.ok && body.success
          ? null
          : (body.error?.message ?? "Gagal menghapus tenant."),
    };
  }, []);

  return {
    listState,
    detailState,
    mutationState,
    listTenants,
    getTenant,
    createTenant,
    updateTenant,
    updateTenantStatus,
    configureCredential,
    deleteTenant,
  };
}
