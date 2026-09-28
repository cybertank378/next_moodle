"use client";

import { useCallback, useState } from "react";
import { type RequestState, request } from "@/libs/apiClient";
import type {
  CourseGradesResponseDto,
  UserGradeReportResponseDto,
} from "../../domain/dto/GradeResponseDto";

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
    ): Promise<UserGradeReportResponseDto | null> => {
      setUserReportState({ data: null, error: null, loading: true });

      const url = userId
        ? `/api/grades?courseId=${courseId}&userId=${userId}`
        : `/api/grades?courseId=${courseId}`;

      const res = await request<UserGradeReportResponseDto>(url, {
        method: "GET",
      });

      if (res.error || !res.data) {
        setUserReportState({
          data: null,
          error: res.error ?? "Gagal memuat rapor nilai.",
          loading: false,
        });
        return null;
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
    ): Promise<CourseGradesResponseDto | null> => {
      setCourseGradesState({ data: null, error: null, loading: true });

      const url = activityId
        ? `/api/grades?courseId=${courseId}&activityId=${activityId}`
        : `/api/grades?courseId=${courseId}`;

      const res = await request<CourseGradesResponseDto>(url, {
        method: "GET",
      });

      if (res.error || !res.data) {
        setCourseGradesState({
          data: null,
          error: res.error ?? "Gagal memuat rekap nilai kelas.",
          loading: false,
        });
        return null;
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
