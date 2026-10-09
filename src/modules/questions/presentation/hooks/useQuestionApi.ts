// Files: src/modules/questions/presentation/hooks/useQuestionApi.ts
"use client";

import { useCallback, useState } from "react";
import { request } from "@/libs/apiClient";
import type {
  CreateQuestionRequestDto,
  UpdateQuestionRequestDto,
} from "@/modules/questions/domain/types/QuestionTypes";

export function useQuestionApi() {
  const [loading, setLoading] = useState(false);

  const createQuestion = useCallback(async (dto: CreateQuestionRequestDto) => {
    setLoading(true);
    try {
      const res = await request<Record<string, unknown>>("/api/questions", {
        method: "POST",
        body: JSON.stringify(dto),
      });
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuestion = useCallback(
    async (id: number, dto: UpdateQuestionRequestDto) => {
      setLoading(true);
      try {
        const res = await request<Record<string, unknown>>(`/api/questions/${id}`, {
          method: "PATCH",
          body: JSON.stringify(dto),
        });
        return res;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    createQuestion,
    updateQuestion,
    loading,
  };
}
