import { useState } from "react";
import type { ReorderQuizQuestionsRequestDto } from "@/modules/exam/domain/types/ExamTypes";

export function useExamAdminApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reorderQuestions = async (
    quizId: number,
    questions: Array<{ questionId: number; slot: number }>,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const payload: ReorderQuizQuestionsRequestDto = { quizId, questions };
      const res = await fetch(`/api/exam/quizzes/${quizId}/questions/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to reorder questions");
      }
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    reorderQuestions,
    loading,
    error,
  };
}
