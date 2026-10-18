"use client";

import type { CourseSummaryResponseDTO } from "@/modules/course/domain/dto/CourseResponseDto";
import Card from "@/shared-ui/component/Card";
import Typography from "@/shared-ui/component/Typography";

interface CourseOverviewInfoCardProps {
  course: CourseSummaryResponseDTO;
  isTeacher: boolean;
}

export default function CourseOverviewInfoCard({
  course,
  isTeacher,
}: CourseOverviewInfoCardProps) {
  return (
    <Card className="p-6 space-y-4 border border-slate-200/80 shadow-xs">
      <Typography variant="h3" className="font-bold text-slate-900">
        Informasi Pembelajaran
      </Typography>
      <div className="space-y-3 text-xs text-slate-600">
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-400">Kode Mata Pelajaran</span>
          <span className="font-semibold text-slate-800">
            {course.shortName}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-400">
            {isTeacher ? "Hak Akses" : "Status Belajar"}
          </span>
          <span className="font-semibold text-slate-800">
            {isTeacher
              ? "Pengajar / Guru Pengampu"
              : course.isCompleted
                ? "Telah Selesai"
                : "Sedang Berlangsung"}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-400">Format Pembelajaran</span>
          <span className="font-semibold text-slate-800 capitalize">
            {course.format}
          </span>
        </div>
        {course.startDate && (
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-400">Tanggal Mulai</span>
            <span className="font-semibold text-slate-800">
              {new Date(course.startDate * 1000).toLocaleDateString("id-ID", {
                dateStyle: "medium",
              })}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
