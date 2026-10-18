"use client";

import type { GradeItemResponseDto } from "@/modules/grades/domain/dto/GradeResponseDto";
import Card from "@/shared-ui/component/Card";
import Typography from "@/shared-ui/component/Typography";

interface CourseGradeTotalCardProps {
  courseTotal: GradeItemResponseDto;
}

export default function CourseGradeTotalCard({
  courseTotal,
}: CourseGradeTotalCardProps) {
  return (
    <Card className="p-5 border-blue-200 bg-blue-50/50 shadow-xs flex justify-between items-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Total Nilai Mata Pelajaran
        </p>
        <Typography
          variant="h3"
          className="text-lg font-extrabold text-slate-900 mt-0.5"
        >
          {courseTotal.itemName || "Nilai Akhir"}
        </Typography>
      </div>
      <div className="text-right">
        <span className="text-2xl font-black text-blue-700">
          {courseTotal.gradeFormatted || "—"}
        </span>
        {courseTotal.percentageFormatted && (
          <p className="text-xs text-slate-500">
            ({courseTotal.percentageFormatted})
          </p>
        )}
      </div>
    </Card>
  );
}
