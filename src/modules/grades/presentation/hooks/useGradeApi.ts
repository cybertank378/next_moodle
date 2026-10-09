"use client";

import { useCallback, useState } from "react";
import { type RequestState, request } from "@/libs/apiClient";
import type {
  CourseGradesResponseDto,
  UserGradeReportResponseDto,
} from "@/modules/grades/domain/dto/GradeResponseDto";
import { showErrorToast, showSuccessToast } from "@/shared-ui/component/Toast";

export function useGradeApi() {
  const [userReportState, setUserReportState] = useState<
    RequestState<UserGradeReportResponseDto>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const [courseGradesState, setCourseGradesState] = useState<
    RequestState<CourseGradesResponseDto>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const getUserGradeReport = useCallback(
    async (
      courseId: number,
      userId?: number,
      options?: { silent?: boolean },
    ): Promise<UserGradeReportResponseDto | null> => {
      setUserReportState({ data: null, error: null, loading: true });

      const url = userId
        ? `/api/grades?courseId=${courseId}&userId=${userId}`
        : `/api/grades?courseId=${courseId}`;

      const res = await request<UserGradeReportResponseDto>(url, {
        method: "GET",
      });

      if (res.error || !res.data) {
        const errorMsg = res.error ?? "Gagal memuat rapor nilai.";
        if (!options?.silent) {
          showErrorToast(errorMsg);
        }
        setUserReportState({
          data: null,
          error: errorMsg,
          loading: false,
        });
        return null;
      }

      if (!options?.silent) {
        showSuccessToast("Rapor nilai berhasil diperbarui.");
      }
      setUserReportState({
        data: res.data,
        error: null,
        loading: false,
      });
      return res.data;
    },
    [],
  );

  const getCourseGrades = useCallback(
    async (
      courseId: number,
      activityId?: number,
      options?: { silent?: boolean },
    ): Promise<CourseGradesResponseDto | null> => {
      setCourseGradesState({ data: null, error: null, loading: true });

      const url = activityId
        ? `/api/grades?courseId=${courseId}&activityId=${activityId}`
        : `/api/grades?courseId=${courseId}`;

      const res = await request<CourseGradesResponseDto>(url, {
        method: "GET",
      });

      if (res.error || !res.data) {
        const errorMsg = res.error ?? "Gagal memuat rekap nilai kelas.";
        if (!options?.silent) {
          showErrorToast(errorMsg);
        }
        setCourseGradesState({
          data: null,
          error: errorMsg,
          loading: false,
        });
        return null;
      }

      if (!options?.silent) {
        showSuccessToast("Rekap nilai kelas berhasil diperbarui.");
      }
      setCourseGradesState({
        data: res.data,
        error: null,
        loading: false,
      });
      return res.data;
    },
    [],
  );

  return {
    userReportState,
    courseGradesState,
    getUserGradeReport,
    getCourseGrades,
  };
}
