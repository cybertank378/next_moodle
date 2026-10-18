"use client";

import type { CourseSectionResponseDTO } from "@/modules/course/domain/dto/CourseResponseDto";
import Button from "@/shared-ui/component/Button";

interface CourseTopicItemProps {
  index: number;
  section: CourseSectionResponseDTO;
  onOpenMateri: () => void;
}

export default function CourseTopicItem({
  index,
  section,
  onOpenMateri,
}: CourseTopicItemProps) {
  return (
    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
          {index + 1}
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {section.name || `Topik ${section.sectionNumber}`}
          </p>
          <span className="text-xs text-slate-500">
            {section.modules?.length ?? 0} modul aktivitas
          </span>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        color="secondary"
        onClick={onOpenMateri}
      >
        Buka Materi
      </Button>
    </div>
  );
}
