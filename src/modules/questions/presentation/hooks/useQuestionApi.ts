import { request } from "@/libs/apiClient";
import { CreateQuestionRequestDto } from "../../domain/types/QuestionTypes";
import { useCallback, useState } from "react";

export function useQuestionApi() {
  const [loading, setLoading] = useState(false);

  const createQuestion = useCallback(async (dto: CreateQuestionRequestDto) => {
    setLoading(true);
    try {
      const res = await request<any>("/api/questions", {
        method: "POST",
        body: JSON.stringify(dto),
      });
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createQuestion,
    loading,
  };
}
