import { useCallback, useEffect, useState } from "react";
import type { ApiErrorResponse } from "@/core/http/ApiErrorResponse";
import type { ApiResponse } from "@/core/http/ApiResponse";
import type { CourseResponseDTO } from "../../domain/dto/CourseResponseDTO";

export function useCourseApi() {
  const [courses, setCourses] = useState<readonly CourseResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/courses");
      const json: ApiResponse<readonly CourseResponseDTO[]> | ApiErrorResponse =
        await response.json();

      if (!response.ok || !json.success) {
        const errorMsg =
          (json as ApiErrorResponse).error?.message ||
          "Gagal memuat data kursus";
        setError(errorMsg);
        return;
      }

      setCourses(json.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Kesalahan koneksi saat memuat kursus",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refresh: fetchCourses,
  };
}
