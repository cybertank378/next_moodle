import { useCallback, useState } from "react";
import type { ApiErrorResponse } from "@/core/http/ApiErrorResponse";
import type { ApiResponse } from "@/core/http/ApiResponse";
import type {
  CurrentUserResponseDTO,
  LoginRequestDTO,
  LoginResponseDTO,
} from "@/modules/auth/domain/dto";

export function useAuthApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: LoginRequestDTO): Promise<LoginResponseDTO | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        const data: ApiResponse<LoginResponseDTO> | ApiErrorResponse =
          await res.json();
        if (!res.ok || !data.success) {
          const errorMsg =
            (data as ApiErrorResponse).error?.message || "Gagal masuk";
          setError(errorMsg);
          return null;
        }
        return data.data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Kesalahan koneksi";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getMe =
    useCallback(async (): Promise<CurrentUserResponseDTO | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/v1/auth/me");
        const data: ApiResponse<CurrentUserResponseDTO> | ApiErrorResponse =
          await res.json();
        if (!res.ok || !data.success) {
          setError(
            (data as ApiErrorResponse).error?.message || "Tidak terautentikasi",
          );
          return null;
        }
        return data.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Kesalahan koneksi");
        return null;
      } finally {
        setLoading(false);
      }
    }, []);

  return {
    login,
    getMe,
    loading,
    error,
  };
}
