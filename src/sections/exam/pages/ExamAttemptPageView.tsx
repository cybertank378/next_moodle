"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/libs/routes";
import { useQuizApi } from "@/modules/quiz/presentation/hooks/useQuizApi";
import { useQuizAttemptApi } from "@/modules/quiz/presentation/hooks/useQuizAttemptApi";
import Skeleton from "@/shared-ui/component/Skeleton";
import ExamAttemptInterface from "@/sections/exam/organisms/ExamAttemptInterface";

export interface ExamAttemptPageViewProps {
  quizId: number;
  attemptId: number;
}

export default function ExamAttemptPageView({
  quizId,
  attemptId,
}: ExamAttemptPageViewProps) {
  const router = useRouter();
  const {
    dataState,
    summaryState,
    getAttemptData,
    getAttemptSummary,
    saveAnswer,
    submitAttempt,
  } = useQuizAttemptApi();
  const { detailState, getQuizDetail } = useQuizApi();

  useEffect(() => {
    if (attemptId) {
      void getAttemptData(attemptId, 0);
      void getAttemptSummary(attemptId);
    }
    if (quizId) {
      void getQuizDetail(quizId);
    }
  }, [attemptId, quizId, getAttemptData, getAttemptSummary, getQuizDetail]);

  const loading = dataState.loading || summaryState.loading;
  const questions =
    dataState.data?.questions ?? summaryState.data?.questions ?? [];

  const initialSeconds = detailState.data?.timeLimitSeconds
    ? detailState.data.timeLimitSeconds
    : 3600;

  const handleSaveAnswer = async (
    answers: Record<string, string | number>,
  ): Promise<boolean> => {
    const res = await saveAnswer(attemptId, answers, quizId);
    return res.data?.success ?? false;
  };

  const handleFinalSubmit = async () => {
    const res = await submitAttempt({
      attemptId,
      quizId,
    });
    if (res.data?.success) {
      router.push(ROUTES.DASHBOARD.EXAMS);
    }
  };

  if (loading && questions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200  bg-white  p-6 space-y-4 shadow-sm">
          <Skeleton height={32} width={260} />
          <Skeleton height={20} width={180} />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton height={280} />
            <Skeleton height={60} />
          </div>
          <div>
            <Skeleton height={220} />
          </div>
        </div>
      </div>
    );
  }

  // Provide fallback question slots if not yet loaded from backend
  const displayQuestions =
    questions.length > 0
      ? questions
      : [
          {
            slot: 1,
            number: 1,
            html: "<p>Pertanyaan 1</p>",
            maxMark: 1,
          },
          {
            slot: 2,
            number: 2,
            html: "<p>Pertanyaan 2</p>",
            maxMark: 1,
          },
          {
            slot: 3,
            number: 3,
            html: "<p>Pertanyaan 3</p>",
            maxMark: 1,
          },
        ];

  return (
    <ExamAttemptInterface
      attemptId={attemptId}
      quizId={quizId}
      quizName={detailState.data?.name ?? `Ujian #${quizId}`}
      initialSeconds={initialSeconds}
      questions={displayQuestions}
      onSaveAnswer={handleSaveAnswer}
      onFinalSubmit={handleFinalSubmit}
    />
  );
}
