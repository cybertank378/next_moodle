"use client";

import Badge from "@/shared-ui/component/Badge";
import Button from "@/shared-ui/component/Button";

interface CourseHeroTeacherSummaryProps {
  topicCount: number;
  moduleCount: number;
  onManageExams: () => void;
}

export default function CourseHeroTeacherSummary({
  topicCount,
  moduleCount,
  onManageExams,
}: CourseHeroTeacherSummaryProps) {
  return (
    <div className="w-full md:w-64 shrink-0 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-500">Peran Anda</span>
        <Badge color="info" variant="soft">
          Guru Pengampu
        </Badge>
      </div>
      <div className="space-y-1.5 pt-1 text-xs text-slate-600">
        <div className="flex justify-between">
          <span className="text-slate-400">Total Topik:</span>
          <span className="font-semibold text-slate-900">{topicCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Modul Aktivitas:</span>
          <span className="font-semibold text-slate-900">{moduleCount}</span>
        </div>
      </div>
      <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          color="primary"
          onClick={onManageExams}
          className="w-full justify-center"
        >
          Kelola Ujian &amp; Kuis
        </Button>
      </div>
    </div>
  );
}
