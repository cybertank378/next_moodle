"use client";

import type { GradeItemResponseDto } from "@/modules/grades/domain/dto/GradeResponseDto";
import Card from "@/shared-ui/component/Card";

interface CourseGradeItemCardProps {
  item: GradeItemResponseDto;
}

export default function CourseGradeItemCard({
  item,
}: CourseGradeItemCardProps) {
  return (
    <Card className="p-4 border border-slate-200/80 shadow-xs flex justify-between items-center">
      <div>
        <p className="text-sm font-semibold text-slate-900">
          {item.itemName || "Aktivitas"}
        </p>
        <span className="text-xs text-slate-400">
          Rentang: {item.gradeMin} - {item.gradeMax}
        </span>
      </div>
      <div className="text-right">
        <span className="text-base font-bold text-slate-800">
          {item.gradeFormatted || "—"}
        </span>
        {item.percentageFormatted && (
          <p className="text-xs text-slate-400">{item.percentageFormatted}</p>
        )}
      </div>
    </Card>
  );
}
