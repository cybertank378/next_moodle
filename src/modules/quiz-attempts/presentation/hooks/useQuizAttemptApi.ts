import { useCallback, useState } from "react";
import type { ApiErrorResponse } from "@/core/http/ApiErrorResponse";
import type { ApiResponse } from "@/core/http/ApiResponse";
import type { SaveQuizAnswerRequestDTO } from "../../domain/dto";

export function useQuizAttemptApi() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveAnswer = useCallback(
    async (
      attemptId: string,
      answer: SaveQuizAnswerRequestDTO,
    ): Promise<boolean> => {
      setSaving(true);
      setError(null);
      try {
        const res = await fetch(`/api/v1/attempts/${attemptId}/answers`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(answer),
        });
        const data: ApiResponse<{ saved: true }> | ApiErrorResponse =
          await res.json();
        if (!res.ok || !data.success) {
          setError(
            (data as ApiErrorResponse).error?.message ||
              "Gagal menyimpan jawaban",
          );
          return false;
        }
        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Kesalahan koneksi saat menyimpan jawaban",
        );
        return false;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const submitAttempt = useCallback(
    async (attemptId: string): Promise<boolean> => {
      setSaving(true);
      setError(null);
      try {
        const res = await fetch(`/api/v1/attempts/${attemptId}/submit`, {
          method: "POST",
        });
        const data: ApiResponse<{ submitted: true }> | ApiErrorResponse =
          await res.json();
        if (!res.ok || !data.success) {
          setError(
            (data as ApiErrorResponse).error?.message ||
              "Gagal mengirimkan ujian",
          );
          return false;
        }
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Kesalahan koneksi saat submit",
        );
        return false;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  return {
    saveAnswer,
    submitAttempt,
    saving,
    error,
  };
}
