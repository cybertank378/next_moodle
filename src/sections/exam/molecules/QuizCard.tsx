"use client";

import { ArrowRight, Calendar, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/libs/routes";
import { stripHtml } from "@/libs/utils";
import type { QuizSummaryResponseDTO } from "@/modules/quiz/domain/dto/QuizResponseDto";
import QuizStatusBadge from "@/sections/exam/atoms/QuizStatusBadge";
import QuizTimeLimitBadge from "@/sections/exam/atoms/QuizTimeLimitBadge";
import Button from "@/shared-ui/component/Button";

interface Props {
  quiz: QuizSummaryResponseDTO;
}

export default function QuizCard({ quiz }: Props) {
  const router = useRouter();
  const cleanIntro = stripHtml(quiz.intro);

  const handleNavigateToQuizDetail = () => {
    router.push(ROUTES.DASHBOARD.EXAM_DETAIL(quiz.id));
  };

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200  bg-white  p-5 shadow-sm transition-all duration-200 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <QuizStatusBadge status={quiz.status} />
          <QuizTimeLimitBadge seconds={quiz.timeLimitSeconds} />
        </div>

        <div className="flex items-start gap-3 pt-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500  border border-amber-500/20">
            <HelpCircle size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-slate-900  hover:text-amber-600 ">
              {quiz.name}
            </h3>
            {quiz.maxAttempts > 0 ? (
              <p className="text-xs text-slate-500 ">
                Maksimal percobaan: {quiz.maxAttempts}x
              </p>
            ) : (
              <p className="text-xs text-slate-500 ">Percobaan tak terbatas</p>
            )}
          </div>
        </div>

        {cleanIntro && (
          <p className="line-clamp-2 text-xs text-slate-600  leading-relaxed">
            {cleanIntro}
          </p>
        )}

        <div className="flex items-center gap-4 text-[11px] text-slate-500  pt-1">
          {quiz.timeOpen > 0 && (
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>
                Buka:{" "}
                {new Date(quiz.timeOpen * 1000).toLocaleDateString("id-ID")}
              </span>
            </div>
          )}
          {quiz.timeClose > 0 && (
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>
                Tutup:{" "}
                {new Date(quiz.timeClose * 1000).toLocaleDateString("id-ID")}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 border-t border-slate-200  pt-4">
        <Button
          size="sm"
          color="warning"
          variant="filled"
          fullWidth
          rightIcon={ArrowRight}
          onClick={handleNavigateToQuizDetail}
        >
          Detail & Akses Ujian
        </Button>
      </div>
    </div>
  );
}
