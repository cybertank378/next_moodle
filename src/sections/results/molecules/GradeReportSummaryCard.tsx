import { Award, BookOpen, CheckCircle2, User } from "lucide-react";
import type { UserGradeReportResponseDto } from "@/modules/grades/domain/dto/GradeResponseDto";
import GradeStatusBadge from "../atoms/GradeStatusBadge";

export interface GradeReportSummaryCardProps {
  report: UserGradeReportResponseDto;
  courseTitle?: string;
  className?: string;
}

export default function GradeReportSummaryCard({
  report,
  courseTitle,
  className = "",
}: GradeReportSummaryCardProps) {
  const total = report.courseTotal;
  const passedCount = report.items.filter((i) => i.isPassed === true).length;
  const totalItems = report.items.length;

  return (
    <div
      data-testid="grade-report-summary-card"
      className={`rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-950/30 via-gray-900/60 to-purple-950/20 p-6 backdrop-blur-md ${className}`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <Award size={16} />
            <span>Rapor Hasil Penilaian</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-sky-500/10 p-2.5 text-sky-400 border border-sky-500/20">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {report.userFullName}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <BookOpen size={13} />
                <span>{courseTitle || `Kursus ID #${report.courseId}`}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-6">
          <div className="text-right">
            <p className="text-xs font-medium text-gray-400">
              Nilai Akhir Kursus
            </p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-extrabold text-white">
                {total ? total.gradeFormatted : "-"}
              </span>
              {total && (
                <span className="text-xs text-gray-400">
                  / {total.gradeMax}
                </span>
              )}
            </div>
            {total && (
              <GradeStatusBadge isPassed={total.isPassed} className="mt-1" />
            )}
          </div>

          <div className="hidden sm:block text-right border-l border-gray-800 pl-6">
            <p className="text-xs font-medium text-gray-400">
              Kelulusan Komponen
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-emerald-400">
              <CheckCircle2 size={16} />
              <span className="text-lg font-bold">
                {passedCount} / {totalItems}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Komponen Ujian</p>
          </div>
        </div>
      </div>
    </div>
  );
}
