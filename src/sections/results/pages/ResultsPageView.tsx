"use client";

import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useCourseApi } from "@/modules/course/presentation/hooks/useCourseApi";
import Skeleton from "@/shared-ui/component/Skeleton";
import StudentGradeReportView from "../organisms/StudentGradeReportView";
import TeacherClassResultsView from "../organisms/TeacherClassResultsView";

export interface ResultsPageViewProps {
  userRole: "STUDENT" | "TENANT" | "ADMIN";
}

export default function ResultsPageView({ userRole }: ResultsPageViewProps) {
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
    <div className="space-y-6">
      {courses.length > 1 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/40 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <BookOpen size={16} className="text-sky-400" />
            <span>Pilih Kursus:</span>
          </div>
          <select
            value={selectedCourseId ?? ""}
            onChange={(e) => setSelectedCourseId(Number(e.target.value))}
            className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-1.5 text-sm text-white focus:border-sky-500 focus:outline-none"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </select>
        </div>
      )}

      {coursesState.loading && !selectedCourseId ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : selectedCourseId ? (
        userRole === "STUDENT" ? (
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
        <div className="rounded-xl border border-dashed border-gray-800 p-8 text-center text-sm text-gray-400">
          Tidak ada kursus aktif yang ditemukan untuk melihat nilai ujian.
        </div>
      )}
    </div>
  );
}
