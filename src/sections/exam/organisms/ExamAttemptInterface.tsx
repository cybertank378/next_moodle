"use client";

import { ArrowLeft, ArrowRight, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAutosaveAttempt } from "@/modules/quiz/presentation/hooks/useAutosaveAttempt";
import AttemptStatusBadge from "@/sections/exam/atoms/AttemptStatusBadge";
import AttemptTimer from "@/sections/exam/atoms/AttemptTimer";
import QuestionCard, {
  type QuestionCardData,
} from "@/sections/exam/molecules/QuestionCard";
import QuestionNavigator from "@/sections/exam/molecules/QuestionNavigator";
import SubmitConfirmationModal from "@/sections/exam/molecules/SubmitConfirmationModal";
import Button from "@/shared-ui/component/Button";

export interface ExamAttemptInterfaceProps {
  attemptId: number;
  quizId: number;
  quizName?: string;
  initialSeconds?: number;
  questions: QuestionCardData[];
  onFinalSubmit: () => Promise<void>;
  onSaveAnswer: (answers: Record<string, string | number>) => Promise<boolean>;
  className?: string;
}

export default function ExamAttemptInterface({
  attemptId,
  quizId,
  quizName = "Ujian Berlangsung",
  initialSeconds = 3600,
  questions,
  onFinalSubmit,
  onSaveAnswer,
  className = "",
}: ExamAttemptInterfaceProps) {
  const [currentSlot, setCurrentSlot] = useState<number>(
    questions[0]?.slot ?? 1,
  );
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flaggedSlots, setFlaggedSlots] = useState<Set<number>>(new Set());
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { syncState, updateAnswer, isOnline, flushQueue } = useAutosaveAttempt({
    attemptId,
    onSave: onSaveAnswer,
    debounceMs: 800,
  });

  const activeQuestion = questions.find((q) => q.slot === currentSlot) ??
    questions[0] ?? {
      slot: 1,
      number: 1,
      html: "<p>Soal tidak ditemukan.</p>",
    };

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentSlot]: value,
    }));
    updateAnswer(currentSlot, value);
  };

  const toggleFlag = (slot: number) => {
    setFlaggedSlots((prev) => {
      const next = new Set(prev);
      if (next.has(slot)) {
        next.delete(slot);
      } else {
        next.add(slot);
      }
      return next;
    });
  };

  const handleNext = () => {
    const currentIndex = questions.findIndex((q) => q.slot === currentSlot);
    if (currentIndex < questions.length - 1) {
      setCurrentSlot(questions[currentIndex + 1].slot);
    }
  };

  const handlePrev = () => {
    const currentIndex = questions.findIndex((q) => q.slot === currentSlot);
    if (currentIndex > 0) {
      setCurrentSlot(questions[currentIndex - 1].slot);
    }
  };

  const handleOpenSubmitModal = () => {
    setIsSubmitModalOpen(true);
  };

  const handleCloseSubmitModal = () => {
    setIsSubmitModalOpen(false);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      await flushQueue();
      await onFinalSubmit();
    } finally {
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
    }
  };

  const navigatorItems = questions.map((q) => ({
    slot: q.slot,
    isAnswered: Boolean(answers[q.slot]),
    isFlagged: flaggedSlots.has(q.slot),
  }));

  const answeredCount = Object.keys(answers).length;
  const currentIndex = questions.findIndex((q) => q.slot === currentSlot);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= questions.length - 1;

  return (
    <div
      data-testid="exam-attempt-interface"
      className={`space-y-6 ${className}`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200  bg-white  p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600  border border-indigo-500/20">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 ">{quizName}</h1>
            <p className="text-xs text-slate-500 ">
              ID Kuis: {quizId} • Attempt #{attemptId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AttemptStatusBadge status={syncState} />
          <AttemptTimer
            seconds={initialSeconds}
            onTimeUp={() => {
              void handleConfirmSubmit();
            }}
          />
        </div>
      </div>

      {/* Main Content: Question Card + Navigator Sidebar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <QuestionCard
            question={activeQuestion}
            currentAnswer={answers[currentSlot] ?? ""}
            onAnswerChange={handleAnswerChange}
            isFlagged={flaggedSlots.has(currentSlot)}
            onToggleFlag={() => toggleFlag(currentSlot)}
          />

          {/* Navigation Controls */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200  bg-white  p-4 shadow-sm">
            <Button
              size="md"
              variant="outline"
              color="secondary"
              leftIcon={ArrowLeft}
              disabled={isFirst}
              onClick={handlePrev}
            >
              Sebelumnya
            </Button>

            <div className="flex items-center gap-3">
              {isLast ? (
                <Button
                  size="md"
                  variant="filled"
                  color="warning"
                  leftIcon={Send}
                  onClick={handleOpenSubmitModal}
                >
                  Kumpulkan Ujian
                </Button>
              ) : (
                <Button
                  size="md"
                  variant="filled"
                  color="primary"
                  rightIcon={ArrowRight}
                  onClick={handleNext}
                >
                  Selanjutnya
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <QuestionNavigator
            questions={navigatorItems}
            currentSlot={currentSlot}
            onSelectSlot={(slot) => setCurrentSlot(slot)}
          />

          <div className="rounded-xl border border-slate-200  bg-white  p-4 text-center shadow-sm">
            <Button
              size="md"
              variant="outline"
              color="warning"
              fullWidth
              leftIcon={Send}
              onClick={handleOpenSubmitModal}
            >
              Selesaikan Ujian
            </Button>
          </div>
        </div>
      </div>

      {/* Final Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={isSubmitModalOpen}
        onClose={handleCloseSubmitModal}
        onConfirmSubmit={handleConfirmSubmit}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        isSubmitting={isSubmitting}
        isOffline={!isOnline || syncState === "offline"}
      />
    </div>
  );
}
