"use client";

import { Calendar, Clock, Edit3, Eye } from "lucide-react";
import type { QuizSummaryResponseDTO } from "@/modules/quiz/domain/dto/QuizResponseDto";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import Typography from "@/shared-ui/component/Typography";

interface CourseQuizCardProps {
  quiz: QuizSummaryResponseDTO;
  isTeacher: boolean;
  onMonitor: () => void;
  onEdit: () => void;
  onDetail: () => void;
  onTakeExam: () => void;
}

export default function CourseQuizCard({
  quiz,
  isTeacher,
  onMonitor,
  onEdit,
  onDetail,
  onTakeExam,
}: CourseQuizCardProps) {
  return (
    <Card className="p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1.5 min-w-0">
        <Typography
          variant="h3"
          className="text-base font-bold text-slate-900 truncate"
        >
          {quiz.name}
        </Typography>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          {quiz.timeLimitSeconds ? (
            <span className="flex items-center gap-1">
              <Clock size={14} className="text-slate-400" />
              Durasi: {Math.floor(quiz.timeLimitSeconds / 60)} menit
            </span>
          ) : (
            <span>Durasi: Bebas</span>
          )}
          {quiz.timeOpen ? (
            <span className="flex items-center gap-1">
              <Calendar size={14} className="text-slate-400" />
              Dibuka:{" "}
              {new Date(quiz.timeOpen * 1000).toLocaleString("id-ID", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
          ) : null}
        </div>
      </div>

      {isTeacher ? (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            color="secondary"
            leftIcon={Eye}
            onClick={onMonitor}
          >
            Monitor
          </Button>
          <Button
            size="sm"
            variant="outline"
            color="primary"
            leftIcon={Edit3}
            onClick={onEdit}
          >
            Edit Kuis
          </Button>
          <Button size="sm" color="primary" onClick={onDetail}>
            Detail
          </Button>
        </div>
      ) : (
        <Button size="sm" color="primary" onClick={onTakeExam}>
          Masuk ke Sesi Ujian
        </Button>
      )}
    </Card>
  );
}
