"use client";

import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useCourseApi } from "@/modules/course/presentation/hooks/useCourseApi";
import CourseCard from "@/sections/courses/molecules/CourseCard";
import CourseFilterBar from "@/sections/courses/molecules/CourseFilterBar";
import Skeleton from "@/shared-ui/component/Skeleton";

export default function CoursesView() {
  const { coursesState, listCourses } = useCourseApi();
  const [search, setSearch] = useState("");

  useEffect(() => {
    void listCourses({ search });
  }, [listCourses, search]);

  const courses = coursesState.data?.courses ?? [];
  const loading = coursesState.loading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900 ">
          Mata Pelajaran
        </h1>
        <p className="text-sm text-slate-500 ">
          Daftar mata pelajaran aktif yang terhubung dengan modul pembelajaran
          Moodle.
        </p>
      </div>

      <CourseFilterBar search={search} onSearchChange={setSearch} />

      {coursesState.error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
          {coursesState.error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={`course-skeleton-${idx}`}
              className="rounded-xl border border-slate-200  bg-white  p-5 space-y-4 shadow-sm"
            >
              <div className="flex justify-between">
                <Skeleton height={20} width={60} />
                <Skeleton height={20} width={80} />
              </div>
              <Skeleton height={24} width={180} />
              <Skeleton height={40} />
              <Skeleton height={36} />
            </div>
          ))}
        </div>
      )}

      {!loading && courses.length === 0 && !coursesState.error && (
        <div className="rounded-xl border border-slate-200  bg-white  p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100  text-slate-500 ">
            <BookOpen size={24} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900 ">
            Belum ada mata pelajaran yang ditemukan
          </h3>
          <p className="mt-1 text-xs text-slate-500  max-w-sm mx-auto">
            {search
              ? "Tidak ada mata pelajaran yang cocok dengan pencarian Anda."
              : "Anda belum terdaftar pada mata pelajaran apapun di Moodle saat ini."}
          </p>
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
