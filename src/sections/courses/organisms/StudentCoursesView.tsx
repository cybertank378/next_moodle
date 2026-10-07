"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDashboardApi } from "@/modules/dashboard/presentation/hooks/useDashboardApi";
import SearchField from "@/shared-ui/component/SearchField";
import Skeleton from "@/shared-ui/component/Skeleton";

export default function StudentCoursesView() {
  const { studentState, fetchStudentOverview } = useDashboardApi();
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Initial fetch if empty
    if (!studentState.data && !studentState.loading) {
      void fetchStudentOverview();
    }
  }, [studentState.data, studentState.loading, fetchStudentOverview]);

  const allCourses = studentState.data?.courses || [];

  const filteredCourses = allCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(search.toLowerCase()),
  );

  const loading = studentState.loading;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            Semua Mata Pelajaran
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Daftar semua mata pelajaran yang Anda ikuti saat ini.
          </p>
        </div>

        <div className="w-full md:w-80 shrink-0">
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Cari mata pelajaran atau guru..."
            size="md"
          />
        </div>
      </div>

      {studentState.error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
          {studentState.error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={`course-skeleton-${idx}`}
              className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4 shadow-sm"
            >
              <div className="flex gap-4">
                <Skeleton
                  height={52}
                  width={52}
                  rounded
                  className="rounded-2xl"
                />
                <div className="flex-1 space-y-3 py-1">
                  <Skeleton height={14} width="80%" />
                  <Skeleton height={12} width="60%" />
                </div>
              </div>
              <div className="pt-4 space-y-2">
                <div className="flex justify-between">
                  <Skeleton height={10} width={40} />
                  <Skeleton height={10} width={20} />
                </div>
                <Skeleton
                  height={8}
                  width="100%"
                  rounded
                  className="rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredCourses.length === 0 && (
        <div className="py-24 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
          <BookOpen className="w-16 h-16 text-slate-300 mb-5" />
          <p className="text-slate-600 font-bold text-lg">
            Tidak ada mata pelajaran ditemukan.
          </p>
          <p className="text-slate-500 text-sm mt-2 max-w-sm">
            Coba gunakan kata kunci lain untuk pencarian atau hubungi guru Anda
            jika mata pelajaran belum muncul.
          </p>
        </div>
      )}

      {!loading && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCourses.map((course, idx) => {
            const colors = [
              "bg-indigo-50 text-indigo-600",
              "bg-blue-50 text-blue-600",
              "bg-emerald-50 text-emerald-600",
              "bg-orange-50 text-orange-600",
              "bg-rose-50 text-rose-600",
              "bg-teal-50 text-teal-600",
            ];
            const barColors = [
              "bg-indigo-500",
              "bg-blue-500",
              "bg-emerald-500",
              "bg-orange-500",
              "bg-rose-500",
              "bg-teal-500",
            ];
            const colorClass = colors[idx % colors.length];
            const barColorClass = barColors[idx % barColors.length];

            return (
              <Link
                href={`/dashboard/courses/${course.id}`}
                key={course.id}
                className="block group"
              >
                <div className="border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:border-blue-100 transition-all bg-white h-full flex flex-col">
                  <div className="flex gap-4 mb-6">
                    <div
                      className={`p-4 rounded-2xl ${colorClass} group-hover:scale-110 transition-transform duration-300 shrink-0`}
                    >
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 line-clamp-2 leading-tight mb-1.5 group-hover:text-blue-600 transition-colors">
                        {course.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Guru: {course.instructor}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Progress
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${barColorClass}`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
