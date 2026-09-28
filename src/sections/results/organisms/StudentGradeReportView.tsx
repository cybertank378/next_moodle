"use client";

import { Award, BookOpen, CheckCircle, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { useGradeApi } from "@/modules/grades/presentation/hooks/useGradeApi";
import Button from "@/shared-ui/component/Button";
import Skeleton from "@/shared-ui/component/Skeleton";
import GradeScoreCard from "../atoms/GradeScoreCard";
import GradeItemRow from "../molecules/GradeItemRow";
import GradeReportSummaryCard from "../molecules/GradeReportSummaryCard";

export interface StudentGradeReportViewProps {
  courseId: number;
  userId?: number;
  courseTitle?: string;
  onBack?: () => void;
}

export default function StudentGradeReportView({
  courseId,
  userId,
  courseTitle,
  onBack,
}: StudentGradeReportViewProps) {
  const { userReportState, getUserGradeReport } = useGradeApi();

  useEffect(() => {
    if (courseId) {
      void getUserGradeReport(courseId, userId);
    }
  }, [courseId, userId, getUserGradeReport]);

  const report = userReportState.data;
  const loading = userReportState.loading;
  const error = userReportState.error;

  return (
    <div data-testid="student-grade-report-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Rapor & Hasil Ujian
          </h1>
          <p className="text-sm text-gray-400">
            Penarikan hasil penilaian ujian dan rekaman kelulusan materi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onBack && (
            <Button
              size="sm"
              variant="outline"
              color="secondary"
              onClick={onBack}
            >
              Kembali
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            color="secondary"
            leftIcon={RefreshCw}
            loading={loading}
            onClick={() => void getUserGradeReport(courseId, userId)}
          >
            Muat Ulang
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
          <p className="font-semibold">Gagal memuat hasil penilaian:</p>
          <p className="mt-1 text-xs">{error}</p>
        </div>
      )}

      {loading && !report ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </div>
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : report ? (
        <>
          <GradeReportSummaryCard report={report} courseTitle={courseTitle} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GradeScoreCard
              label="Komponen Penilaian"
              value={report.items.length}
              subLabel="Tugas / Kuis"
              icon={<BookOpen size={18} />}
              variant="primary"
            />
            <GradeScoreCard
              label="Komponen Lulus"
              value={report.items.filter((i) => i.isPassed === true).length}
              subLabel={`dari ${report.items.length} ujian`}
              icon={<CheckCircle size={18} />}
              variant="success"
            />
            <GradeScoreCard
              label="Skor Akhir Kursus"
              value={
                report.courseTotal ? report.courseTotal.gradeFormatted : "-"
              }
              subLabel={
                report.courseTotal?.isPassed ? "Tuntas" : "Belum Tuntas"
              }
              icon={<Award size={18} />}
              variant={report.courseTotal?.isPassed ? "success" : "warning"}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-white">
              Daftar Komponen Nilai & Kuis
            </h3>

            {report.items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-800 p-8 text-center text-sm text-gray-400">
                Belum ada aktivitas kuis atau materi yang telah dinilai pada
                kursus ini.
              </div>
            ) : (
              <div className="space-y-3">
                {report.items.map((item) => (
                  <GradeItemRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
