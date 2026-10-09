"use client";

import { useCallback, useState } from "react";
import { request } from "@/libs/apiClient";
import type {
  ExamMonitorActionRequestDto,
  ExamMonitorResponseDto,
  ExtendAttemptTimeRequestDto,
} from "../../domain/dto/ExamMonitorDto";

export interface ExamMonitorState {
  data: ExamMonitorResponseDto | null;
  loading: boolean;
  error: string | null;
}

export function useExamMonitorApi() {
  const [monitorState, setMonitorState] = useState<ExamMonitorState>({
    data: null,
    loading: true,
    error: null,
  });

  const [isMutating, setIsMutating] = useState(false);

  const fetchMonitor = useCallback(async (quizId: number) => {
    setMonitorState((prev) => ({ ...prev, loading: true, error: null }));
    const res = await request<ExamMonitorResponseDto>(
      `/api/exam-monitor?quizId=${quizId}`,
      { method: "GET" },
    );
    if (res.error || !res.data) {
      setMonitorState((prev) => ({
        data: prev.data,
        loading: false,
        error: res.error ?? "Gagal memuat data pengawasan ujian.",
      }));
      return;
    }
    setMonitorState({ data: res.data, loading: false, error: null });
  }, []);

  const lockAttempt = useCallback(async (req: { attemptId: number }) => {
    setIsMutating(true);
    const res = await request<void>("/api/exam-monitor/lock", {
      method: "POST",
      body: JSON.stringify(req),
    });
    setIsMutating(false);
    if (res.error) {
      throw new Error(res.error);
    }
  }, []);

  const unlockAttempt = useCallback(async (req: { attemptId: number }) => {
    setIsMutating(true);
    const res = await request<void>("/api/exam-monitor/unlock", {
      method: "POST",
      body: JSON.stringify(req),
    });
    setIsMutating(false);
    if (res.error) {
      throw new Error(res.error);
    }
  }, []);

  const forceFinishAttempt = useCallback(async (req: { attemptId: number }) => {
    setIsMutating(true);
    const res = await request<void>("/api/exam-monitor/force-finish", {
      method: "POST",
      body: JSON.stringify(req),
    });
    setIsMutating(false);
    if (res.error) {
      throw new Error(res.error);
    }
  }, []);

  const extendTimeAttempt = useCallback(
    async (req: { attemptId: number; extraTimeMinutes: number }) => {
      setIsMutating(true);
      const res = await request<void>("/api/exam-monitor/extend-time", {
        method: "POST",
        body: JSON.stringify(req),
      });
      setIsMutating(false);
      if (res.error) {
        throw new Error(res.error);
      }
    },
    [],
  );

  return {
    monitorState,
    fetchMonitor,
    isMutating,
    lockAttempt,
    unlockAttempt,
    forceFinishAttempt,
    extendTimeAttempt,
  };
}
