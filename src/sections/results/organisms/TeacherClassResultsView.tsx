import { Award, CheckCircle, Download, RefreshCw, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { UserGradeReportResponseDto } from "@/modules/grades/domain/dto/GradeResponseDto";
import { GradeExportFormatter } from "@/modules/grades/domain/mapper/GradeExportFormatter";
import { useGradeApi } from "@/modules/grades/presentation/hooks/useGradeApi";
import Button from "@/shared-ui/component/Button";
import SearchField from "@/shared-ui/component/SearchField";
import Skeleton from "@/shared-ui/component/Skeleton";
import GradeScoreCard from "@/sections/results/atoms/GradeScoreCard";
import CourseGradesTable from "@/sections/results/molecules/CourseGradesTable";
import StudentGradeReportView from "@/sections/results/organisms/StudentGradeReportView";

export interface TeacherClassResultsViewProps {
  courseId: number;
  courseTitle?: string;
}

const ITEMS_PER_PAGE = 10;

export default function TeacherClassResultsView({
  courseId,
  courseTitle,
}: TeacherClassResultsViewProps) {
  const { courseGradesState, getCourseGrades } = useGradeApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<UserGradeReportResponseDto | null>(null);

  useEffect(() => {
    if (courseId) {
      void getCourseGrades(courseId);
    }
  }, [courseId, getCourseGrades]);

  const handleExportExcel = async () => {
    if (exporting || reports.length === 0) return;
    setExporting(true);
    try {
      const res = await fetch(`/api/grades/export?courseId=${courseId}`);
      if (!res.ok) {
        const errJson = (await res.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        throw new Error(
          errJson.error?.message ?? `Export gagal (${res.status})`,
        );
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, 19);
      const safeCourseTitle = (courseTitle ?? `course-${courseId}`)
        .replace(/[^a-zA-Z0-9-_]/g, "_")
        .slice(0, 40);
      a.href = url;
      a.download = `rekap-nilai_${safeCourseTitle}_${timestamp}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      // Surface error briefly – a toast integration can be added later
      console.error("[GradeExport]", err);
      alert(
        err instanceof Error ? err.message : "Gagal mengekspor rekap nilai.",
      );
    } finally {
      setExporting(false);
    }
  };

  const reports = courseGradesState.data?.reports ?? [];
  const loading = courseGradesState.loading;
  const error = courseGradesState.error;

  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports;
    const q = searchQuery.toLowerCase();
    return reports.filter(
      (r) =>
        r.userFullName.toLowerCase().includes(q) ||
        String(r.userId).includes(q),
    );
  }, [reports, searchQuery]);

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReports.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReports, currentPage]);

  const stats = useMemo(() => {
    if (reports.length === 0) {
      return { totalStudents: 0, averageScore: 0, passedStudents: 0 };
    }
    let totalScore = 0;
    let scoredCount = 0;
    let passedCount = 0;

    for (const r of reports) {
      if (
        r.courseTotal?.gradeRaw !== null &&
        r.courseTotal?.gradeRaw !== undefined
      ) {
        totalScore += r.courseTotal.gradeRaw;
        scoredCount++;
      }
      if (r.courseTotal?.isPassed === true) {
        passedCount++;
      }
    }

    return {
      totalStudents: reports.length,
      averageScore:
        scoredCount > 0 ? (totalScore / scoredCount).toFixed(1) : "-",
      passedStudents: passedCount,
    };
  }, [reports]);

  if (selectedStudent) {
    return (
      <StudentGradeReportView
        courseId={courseId}
        userId={selectedStudent.userId}
        courseTitle={courseTitle}
        onBack={() => setSelectedStudent(null)}
      />
    );
  }

  return (
    <div data-testid="teacher-class-results-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Rekap Nilai Kelas & Ujian
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Penarikan hasil penilaian ujian siswa pada kursus{" "}
            {courseTitle ? `"${courseTitle}"` : `#${courseId}`}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            color="secondary"
            leftIcon={RefreshCw}
            loading={loading}
            onClick={() => void getCourseGrades(courseId)}
          >
            Muat Ulang
          </Button>

          <Button
            size="sm"
            variant="filled"
            color="primary"
            leftIcon={Download}
            loading={exporting}
            disabled={reports.length === 0 || loading}
            onClick={() => void handleExportExcel()}
            data-testid="export-excel-btn"
          >
            Export Excel
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
          <p className="font-semibold">Gagal memuat rekap nilai:</p>
          <p className="mt-1 text-xs">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GradeScoreCard
          label="Total Peserta Dinilai"
          value={stats.totalStudents}
          subLabel="Siswa terdaftar"
          icon={<Users size={18} />}
          variant="primary"
        />
        <GradeScoreCard
          label="Rata-rata Skor Kelas"
          value={stats.averageScore}
          subLabel="dari 100 poin"
          icon={<Award size={18} />}
          variant="info"
        />
        <GradeScoreCard
          label="Tingkat Kelulusan"
          value={
            stats.totalStudents > 0
              ? `${Math.round((stats.passedStudents / stats.totalStudents) * 100)}%`
              : "0%"
          }
          subLabel={`${stats.passedStudents} siswa tuntas`}
          icon={<CheckCircle size={18} />}
          variant="success"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <SearchField
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Cari peserta berdasarkan nama / ID..."
            size="sm"
            className="w-full max-w-sm"
          />
        </div>

        {loading && reports.length === 0 ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        ) : (
          <CourseGradesTable
            reports={paginatedReports}
            onSelectStudent={(s) => setSelectedStudent(s)}
            currentPage={currentPage}
            totalItems={filteredReports.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            onRetry={() => void getCourseGrades(courseId)}
          />
        )}
      </div>
    </div>
  );
}
