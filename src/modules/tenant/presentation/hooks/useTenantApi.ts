import { useCallback, useState } from "react";
import type { ApiErrorResponse } from "@/core/http/ApiErrorResponse";
import type { ApiResponse } from "@/core/http/ApiResponse";
import type { TenantResponseDTO } from "@/modules/tenant/domain/dto/TenantResponseDTO";
import type { TestTenantConnectionResponseDTO } from "@/modules/tenant/domain/dto/TestTenantConnectionResponseDTO";

export function useTenantApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTenantBySlug = useCallback(
    async (slug: string): Promise<TenantResponseDTO | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/v1/tenants/${encodeURIComponent(slug)}`);
        const data: ApiResponse<TenantResponseDTO> | ApiErrorResponse =
          await res.json();
        if (!res.ok || !data.success) {
          setError(
            (data as ApiErrorResponse).error?.message ||
              "Gagal memuat informasi tenant.",
          );
          return null;
        }
        return data.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Kesalahan koneksi.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const testConnection = useCallback(
    async (
      tenantId: string,
    ): Promise<TestTenantConnectionResponseDTO | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/v1/tenants/${encodeURIComponent(tenantId)}/test-connection`,
          { method: "POST" },
        );
        const data:
          | ApiResponse<TestTenantConnectionResponseDTO>
          | ApiErrorResponse = await res.json();
        if (!res.ok || !data.success) {
          setError(
            (data as ApiErrorResponse).error?.message ||
              "Uji koneksi Moodle gagal.",
          );
          return null;
        }
        return data.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Kesalahan koneksi.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    getTenantBySlug,
    testConnection,
  };
}
