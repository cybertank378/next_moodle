"use client";

import { useCallback, useState } from "react";
import { type RequestState, request } from "@/libs/apiClient";
import type {
  QuizAccessResponseDTO,
  QuizListResponseDTO,
  QuizSummaryResponseDTO,
} from "../../domain/dto/QuizResponseDto";

export function useQuizApi() {
  const [quizzesState, setQuizzesState] = useState<
    RequestState<QuizListResponseDTO>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const [detailState, setDetailState] = useState<
    RequestState<QuizSummaryResponseDTO>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const [accessState, setAccessState] = useState<
    RequestState<QuizAccessResponseDTO>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const listQuizzes = useCallback(
    async (params?: { courseId?: number; search?: string }) => {
      setQuizzesState({ data: null, error: null, loading: true });
      const searchParams = new URLSearchParams();
      if (params?.courseId) {
        searchParams.set("courseId", String(params.courseId));
      }
      if (params?.search) {
        searchParams.set("search", params.search);
      }

      const queryString = searchParams.toString();
      const url = queryString ? `/api/quizzes?${queryString}` : "/api/quizzes";

      const result = await request<QuizListResponseDTO>(url);
      setQuizzesState({ ...result, loading: false });
      return result;
    },
    [],
  );

  const getQuizDetail = useCallback(async (quizId: number) => {
    setDetailState({ data: null, error: null, loading: true });
    const result = await request<QuizSummaryResponseDTO>(`/api/quizzes/${quizId}`);
    setDetailState({ ...result, loading: false });
    return result;
  }, []);

  const checkQuizAccess = useCallback(async (quizId: number) => {
    setAccessState({ data: null, error: null, loading: true });
    const result = await request<QuizAccessResponseDTO>(
      `/api/quizzes/${quizId}/access`,
    );
    setAccessState({ ...result, loading: false });
    return result;
  }, []);

  return {
    quizzesState,
    detailState,
    accessState,
    listQuizzes,
    getQuizDetail,
    checkQuizAccess,
  };
}
