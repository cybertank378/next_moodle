import { useCallback, useState } from "react";
import type { ApiErrorResponse } from "@/core/http/ApiErrorResponse";
import type { ApiResponse } from "@/core/http/ApiResponse";
import type { QuizAccessResponseDTO } from "../../domain/dto";

export function useQuizApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuizAccess = useCallback(
    async (quizId: string): Promise<QuizAccessResponseDTO | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/v1/quizzes/${quizId}/access`);
        const data: ApiResponse<QuizAccessResponseDTO> | ApiErrorResponse =
          await res.json();
        if (!res.ok || !data.success) {
          setError(
            (data as ApiErrorResponse).error?.message ||
              "Gagal memuat akses kuis",
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
    },
    [],
  );

  return {
    getQuizAccess,
    loading,
    error,
  };
}
