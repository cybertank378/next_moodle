"use client";

import { useCallback, useState } from "react";
import { type RequestState, request } from "@/libs/apiClient";
import type { AnswerInputPayload } from "../../domain/dto/QuizAttemptRequestDto";
import type {
  QuizAttemptDataResponseDto,
  QuizAttemptResponseDto,
  QuizAttemptSummaryResponseDto,
  SaveQuizAnswerResponseDto,
  SubmitQuizAttemptResponseDto,
} from "../../domain/dto/QuizAttemptResponseDto";

export function useQuizAttemptApi() {
  const [startState, setStartState] = useState<
    RequestState<QuizAttemptResponseDto>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const [saveState, setSaveState] = useState<
    RequestState<SaveQuizAnswerResponseDto>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const [submitState, setSubmitState] = useState<
    RequestState<SubmitQuizAttemptResponseDto>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const [attemptsState, setAttemptsState] = useState<
    RequestState<QuizAttemptResponseDto[]>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const [dataState, setDataState] = useState<
    RequestState<QuizAttemptDataResponseDto>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const [summaryState, setSummaryState] = useState<
    RequestState<QuizAttemptSummaryResponseDto>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const startAttempt = useCallback(
    async (params: { quizId: number; forceNew?: boolean }) => {
      setStartState({ data: null, error: null, loading: true });
      const result = await request<QuizAttemptResponseDto>(
        "/api/quizzes/attempts/start",
        {
          method: "POST",
          body: JSON.stringify(params),
        },
      );
      setStartState({ ...result, loading: false });
      return result;
    },
    [],
  );

  const saveAnswer = useCallback(
    async (attemptId: number, answers: AnswerInputPayload, quizId?: number) => {
      setSaveState({ data: null, error: null, loading: true });
      const result = await request<SaveQuizAnswerResponseDto>(
        `/api/quizzes/attempts/${attemptId}/save`,
        {
          method: "POST",
          body: JSON.stringify({ answers, quizId }),
        },
      );
      setSaveState({ ...result, loading: false });
      return result;
    },
    [],
  );

  const submitAttempt = useCallback(
    async (params: {
      attemptId: number;
      answers?: AnswerInputPayload;
      timeUp?: boolean;
      quizId?: number;
    }) => {
      setSubmitState({ data: null, error: null, loading: true });
      const result = await request<SubmitQuizAttemptResponseDto>(
        `/api/quizzes/attempts/${params.attemptId}/submit`,
        {
          method: "POST",
          body: JSON.stringify({
            answers: params.answers,
            timeUp: params.timeUp,
            quizId: params.quizId,
          }),
        },
      );
      setSubmitState({ ...result, loading: false });
      return result;
    },
    [],
  );

  const getUserAttempts = useCallback(
    async (params: {
      quizId: number;
      status?: "all" | "finished" | "unfinished";
    }) => {
      setAttemptsState({ data: null, error: null, loading: true });
      const searchParams = new URLSearchParams();
      searchParams.set("quizId", String(params.quizId));
      if (params.status) {
        searchParams.set("status", params.status);
      }

      const result = await request<QuizAttemptResponseDto[]>(
        `/api/quizzes/attempts?${searchParams.toString()}`,
      );
      setAttemptsState({ ...result, loading: false });
      return result;
    },
    [],
  );

  const getAttemptData = useCallback(async (attemptId: number, page = 0) => {
    setDataState({ data: null, error: null, loading: true });
    const result = await request<QuizAttemptDataResponseDto>(
      `/api/quizzes/attempts/${attemptId}/data?page=${page}`,
    );
    setDataState({ ...result, loading: false });
    return result;
  }, []);

  const getAttemptSummary = useCallback(async (attemptId: number) => {
    setSummaryState({ data: null, error: null, loading: true });
    const result = await request<QuizAttemptSummaryResponseDto>(
      `/api/quizzes/attempts/${attemptId}/summary`,
    );
    setSummaryState({ ...result, loading: false });
    return result;
  }, []);

  return {
    startState,
    saveState,
    submitState,
    attemptsState,
    dataState,
    summaryState,
    startAttempt,
    saveAnswer,
    submitAttempt,
    getUserAttempts,
    getAttemptData,
    getAttemptSummary,
  };
}
