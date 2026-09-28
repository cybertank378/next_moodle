"use client";

import { Award, CheckCircle, RefreshCw, Search, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { UserGradeReportResponseDto } from "@/modules/grades/domain/dto/GradeResponseDto";
import { useGradeApi } from "@/modules/grades/presentation/hooks/useGradeApi";
import Button from "@/shared-ui/component/Button";
import Skeleton from "@/shared-ui/component/Skeleton";
import GradeScoreCard from "../atoms/GradeScoreCard";
import CourseGradesTable from "../molecules/CourseGradesTable";
import StudentGradeReportView from "./StudentGradeReportView";

export interface TeacherClassResultsViewProps {
  courseId: number;
  courseTitle?: string;
}

export default function TeacherClassResultsView({
  courseId,
  courseTitle,
}: TeacherClassResultsViewProps) {
  const { courseGradesState, getCourseGrades } = useGradeApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<UserGradeReportResponseDto | null>(null);

  useEffect(() => {
    if (courseId) {
      void getCourseGrades(courseId);
    }
  }, [courseId, getCourseGrades]);

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
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Rekap Nilai Kelas & Ujian
          </h1>
          <p className="text-sm text-gray-400">
            Penarikan hasil penilaian ujian siswa pada kursus{" "}
            {courseTitle ? `"${courseTitle}"` : `#${courseId}`}.
          </p>
        </div>

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
          <div className="relative w-full max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Cari peserta berdasarkan nama / ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-gray-900/60 py-2 pl-9 pr-4 text-sm text-white placeholder-gray-500 transition-colors focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {loading && reports.length === 0 ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        ) : (
          <CourseGradesTable
            reports={filteredReports}
            onSelectStudent={(s) => setSelectedStudent(s)}
          />
        )}
      </div>
    </div>
  );
}
