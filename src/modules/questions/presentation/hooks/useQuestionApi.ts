// Files: src/modules/questions/presentation/hooks/useQuestionApi.ts
"use client";

import { useCallback, useState } from "react";
import { request } from "@/libs/apiClient";
import type {
  CreateQuestionCategoryRequestDto,
  CreateQuestionRequestDto,
  GetQuestionsQueryDto,
  GetQuestionsResultDto,
  QuestionCategory,
  UpdateQuestionRequestDto,
} from "@/modules/questions/domain/types/QuestionTypes";

export function useQuestionApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuestions = useCallback(
    async (params?: GetQuestionsQueryDto) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (params?.categoryId !== undefined) {
          queryParams.set("categoryId", String(params.categoryId));
        }
        if (params?.qtype) queryParams.set("qtype", params.qtype);
        if (params?.status) queryParams.set("status", params.status);
        if (params?.search) queryParams.set("search", params.search);
        if (params?.page !== undefined) {
          queryParams.set("page", String(params.page));
        }
        if (params?.limit !== undefined) {
          queryParams.set("limit", String(params.limit));
        }

        const queryStr = queryParams.toString();
        const url = `/api/questions${queryStr ? `?${queryStr}` : ""}`;
        const res = await request<GetQuestionsResultDto>(url, {
          method: "GET",
        });
        return res;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load questions";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getCategories = useCallback(async (contextId?: number) => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/questions/categories${contextId ? `?contextId=${contextId}` : ""}`;
      const res = await request<QuestionCategory[]>(url, {
        method: "GET",
      });
      return res;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load question categories";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(
    async (dto: CreateQuestionCategoryRequestDto) => {
      setLoading(true);
      setError(null);
      try {
        const res = await request<QuestionCategory>(
          "/api/questions/categories",
          {
            method: "POST",
            body: JSON.stringify(dto),
          },
        );
        return res;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Failed to create question category";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const createQuestion = useCallback(async (dto: CreateQuestionRequestDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await request<Record<string, unknown>>("/api/questions", {
        method: "POST",
        body: JSON.stringify(dto),
      });
      return res;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to create question";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuestion = useCallback(
    async (id: number, dto: UpdateQuestionRequestDto) => {
      setLoading(true);
      setError(null);
      try {
        const res = await request<Record<string, unknown>>(
          `/api/questions/${id}`,
          {
            method: "PATCH",
            body: JSON.stringify(dto),
          },
        );
        return res;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to update question";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    getQuestions,
    getCategories,
    createCategory,
    createQuestion,
    updateQuestion,
    loading,
    error,
  };
}
