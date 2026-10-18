import { useState } from "react";
import type { QuizQuestionSlot } from "@/modules/exam/domain/interfaces/ExamAdministrationRepositoryInterface";
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

  const getQuizQuestions = async (
    quizId: number,
  ): Promise<{ data: QuizQuestionSlot[] | null; error: string | null }> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/exam/quizzes/${quizId}/questions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to fetch quiz questions");
      }
      return { data: data.data || [], error: null };
    } catch (err: any) {
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const addQuestionToQuiz = async (
    quizId: number,
    questionId: number,
    maxMark = 1.0,
    page = 1,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/exam/quizzes/${quizId}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questionId, maxMark, page }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error?.message || "Failed to add question to quiz",
        );
      }
      return { data: data.data, error: null };
    } catch (err: any) {
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const addRandomQuestions = async (
    quizId: number,
    categoryId: number,
    randomCount = 1,
    includeSubcategories = false,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/exam/quizzes/${quizId}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isRandom: true,
          categoryId,
          randomCount,
          includeSubcategories,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error?.message || "Failed to add random questions to quiz",
        );
      }
      return { data: data.data, error: null };
    } catch (err: any) {
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    reorderQuestions,
    getQuizQuestions,
    addQuestionToQuiz,
    addRandomQuestions,
    loading,
    error,
  };
}
