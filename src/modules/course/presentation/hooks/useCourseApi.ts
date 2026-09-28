"use client";

import { useCallback, useState } from "react";
import { type RequestState, request } from "@/libs/apiClient";
import type {
  CourseListResponseDTO,
  CourseSectionResponseDTO,
} from "@/modules/course/domain/dto/CourseResponseDto";

export function useCourseApi() {
  const [coursesState, setCoursesState] = useState<
    RequestState<CourseListResponseDTO>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const [contentsState, setContentsState] = useState<
    RequestState<CourseSectionResponseDTO[]>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const listCourses = useCallback(
    async (params?: { search?: string; categoryId?: number }) => {
      setCoursesState({ data: null, error: null, loading: true });
      const query = new URLSearchParams();
      if (params?.search) query.set("search", params.search);
      if (params?.categoryId)
        query.set("categoryId", String(params.categoryId));

      const path = query.toString() ? `/api/courses?${query}` : "/api/courses";
      const result = await request<CourseListResponseDTO>(path);
      setCoursesState({ ...result, loading: false });
      return result;
    },
    [],
  );

  const getCourseContents = useCallback(async (courseId: number) => {
    setContentsState({ data: null, error: null, loading: true });
    const result = await request<CourseSectionResponseDTO[]>(
      `/api/courses/${courseId}/contents`,
    );
    setContentsState({ ...result, loading: false });
    return result;
  }, []);

  return {
    coursesState,
    contentsState,
    listCourses,
    getCourseContents,
  };
}
