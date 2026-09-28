import { Eye, User } from "lucide-react";
import type { UserGradeReportResponseDto } from "@/modules/grades/domain/dto/GradeResponseDto";
import Button from "@/shared-ui/component/Button";
import GradeStatusBadge from "../atoms/GradeStatusBadge";

export interface CourseGradesTableProps {
  reports: UserGradeReportResponseDto[];
  onSelectStudent?: (report: UserGradeReportResponseDto) => void;
  className?: string;
}

export default function CourseGradesTable({
  reports,
  onSelectStudent,
  className = "",
}: CourseGradesTableProps) {
  if (reports.length === 0) {
    return (
      <div
        data-testid="grades-table-empty"
        className="rounded-xl border border-dashed border-gray-800 p-8 text-center"
      >
        <p className="text-sm text-gray-400">
          Belum ada rekap nilai peserta yang tersedia untuk kursus ini.
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="course-grades-table"
      className={`overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/60 ${className}`}
    >
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-800 bg-gray-900/80 text-xs font-semibold uppercase text-gray-400">
          <tr>
            <th className="px-4 py-3">Peserta</th>
            <th className="px-4 py-3">ID Siswa</th>
            <th className="px-4 py-3 text-center">Komponen Selesai</th>
            <th className="px-4 py-3 text-right">Nilai Total</th>
            <th className="px-4 py-3 text-center">Status</th>
            {onSelectStudent && <th className="px-4 py-3 text-center">Aksi</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/60">
          {reports.map((report) => {
            const total = report.courseTotal;
            const completedCount = report.items.filter(
              (i) => i.gradeRaw !== null,
            ).length;

            return (
              <tr
                key={report.userId}
                className="transition-colors hover:bg-gray-800/30"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400">
                      <User size={15} />
                    </div>
                    <span className="font-medium text-white">
                      {report.userFullName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-gray-400">#{report.userId}</td>
                <td className="px-4 py-3.5 text-center text-gray-300">
                  {completedCount} / {report.items.length}
                </td>
                <td className="px-4 py-3.5 text-right font-bold text-white">
                  {total ? total.gradeFormatted : "-"}
                </td>
                <td className="px-4 py-3.5 text-center">
                  <GradeStatusBadge isPassed={total ? total.isPassed : null} />
                </td>
                {onSelectStudent && (
                  <td className="px-4 py-3.5 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      color="secondary"
                      leftIcon={Eye}
                      onClick={() => onSelectStudent(report)}
                      aria-label={`Lihat rapor ${report.userFullName}`}
                    >
                      Rapor
                    </Button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
