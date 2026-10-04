"use client";

import { useCallback, useState } from "react";
import { request } from "@/libs/apiClient";
import type { AdminDashboardResponseDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";

export interface AdminDashboardState {
  data: AdminDashboardResponseDto | null;
  loading: boolean;
  error: string | null;
}

export function useDashboardApi() {
  const [adminState, setAdminState] = useState<AdminDashboardState>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchAdminOverview = useCallback(async (months?: number) => {
    setAdminState((prev) => ({ ...prev, loading: true, error: null }));

    const query = months ? `?months=${months}` : "";
    const res = await request<AdminDashboardResponseDto>(
      `/api/dashboard/admin${query}`,
      { method: "GET" },
    );

    if (res.error || !res.data) {
      setAdminState((prev) => ({
        data: prev.data,
        loading: false,
        error: res.error ?? "Gagal memuat ringkasan platform.",
      }));
      return;
    }

    setAdminState({ data: res.data, loading: false, error: null });
  }, []);

  return { adminState, fetchAdminOverview };
}
