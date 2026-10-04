"use client";

import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Role, type UserRole } from "@/libs/enums";
import { useCourseApi } from "@/modules/course/presentation/hooks/useCourseApi";
import SelectField from "@/shared-ui/component/SelectField";
import Skeleton from "@/shared-ui/component/Skeleton";
import ResultsEmptyState from "@/sections/results/atoms/ResultsEmptyState";
import StudentGradeReportView from "@/sections/results/organisms/StudentGradeReportView";
import TeacherClassResultsView from "@/sections/results/organisms/TeacherClassResultsView";

export interface ResultsManagementViewProps {
  userRole: UserRole;
}

export default function ResultsManagementView({
  userRole,
}: ResultsManagementViewProps) {
  const { coursesState, listCourses } = useCourseApi();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  useEffect(() => {
    void listCourses();
  }, [listCourses]);

  const courses = coursesState.data?.courses ?? [];

  useEffect(() => {
    if (!selectedCourseId && courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <div data-testid="results-management-view" className="space-y-6">
      {courses.length > 1 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
            <BookOpen size={16} className="text-sky-500 dark:text-sky-400" />
            <span>Pilih Kursus:</span>
          </div>
          <SelectField
            value={selectedCourseId ?? ""}
            onChange={(e) => setSelectedCourseId(Number(e.target.value))}
            size="sm"
          >
            {courses.map((c) => (
              <option
                key={c.id}
                value={c.id}
                className="bg-white dark:bg-gray-900 text-slate-800 dark:text-white"
              >
                {c.fullName}
              </option>
            ))}
          </SelectField>
        </div>
      )}

      {coursesState.loading && !selectedCourseId ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : selectedCourseId ? (
        userRole === Role.STUDENT ? (
          <StudentGradeReportView
            courseId={selectedCourseId}
            courseTitle={selectedCourse?.fullName}
          />
        ) : (
          <TeacherClassResultsView
            courseId={selectedCourseId}
            courseTitle={selectedCourse?.fullName}
          />
        )
      ) : (
        <ResultsEmptyState
          title="Tidak ada kursus aktif"
          description="Tidak ditemukan kursus yang terdaftar untuk melihat hasil penilaian."
          onRetry={() => void listCourses()}
        />
      )}
    </div>
  );
}
