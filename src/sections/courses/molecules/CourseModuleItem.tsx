"use client";

import {
  CheckCircle2,
  Edit3,
  ExternalLink,
  FileText,
  HelpCircle,
} from "lucide-react";
import type { CourseModuleResponseDTO } from "@/modules/course/domain/dto/CourseResponseDto";
import Button from "@/shared-ui/component/Button";

interface CourseModuleItemProps {
  module: CourseModuleResponseDTO;
  isTeacher: boolean;
  onTakeExam: () => void;
  onManageExam: () => void;
}

export default function CourseModuleItem({
  module,
  isTeacher,
  onTakeExam,
  onManageExam,
}: CourseModuleItemProps) {
  const isQuiz = module.modName.toLowerCase() === "quiz";

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3.5 hover:bg-slate-50 hover:border-slate-300 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            isQuiz ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
          }`}
        >
          {isQuiz ? <HelpCircle size={18} /> : <FileText size={18} />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {module.name}
          </p>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            {module.modName}
          </span>
        </div>
      </div>

      {isQuiz ? (
        isTeacher ? (
          <Button
            size="sm"
            variant="outline"
            color="primary"
            leftIcon={Edit3}
            onClick={onManageExam}
          >
            Kelola Kuis
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            color="warning"
            leftIcon={CheckCircle2}
            onClick={onTakeExam}
          >
            Ikuti Ujian
          </Button>
        )
      ) : (
        module.url && (
          <Button
            size="sm"
            variant="ghost"
            color="secondary"
            leftIcon={ExternalLink}
            onClick={() =>
              window.open(module.url ?? "", "_blank", "noopener,noreferrer")
            }
          >
            Buka Materi
          </Button>
        )
      )}
    </div>
  );
}
