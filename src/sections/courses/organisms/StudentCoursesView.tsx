"use client";

import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ROUTES } from "@/libs/routes";
import { useCourseApi } from "@/modules/course/presentation/hooks/useCourseApi";
import CourseProgressBadge from "@/sections/courses/atoms/CourseProgressBadge";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import EmptyState from "@/shared-ui/component/EmptyState";
import SearchField from "@/shared-ui/component/SearchField";
import Skeleton from "@/shared-ui/component/Skeleton";
import { showErrorToast } from "@/shared-ui/component/Toast";
import Typography from "@/shared-ui/component/Typography";

export default function StudentCoursesView() {
  const router = useRouter();
  const { coursesState, listCourses } = useCourseApi();
  const [search, setSearch] = useState("");

  const handleNavigateToCourseDetail = (courseId: string | number) => {
    router.push(ROUTES.STUDENT.COURSE_DETAIL(courseId));
  };

  useEffect(() => {
    void listCourses();
  }, [listCourses]);

  useEffect(() => {
    if (coursesState.error) {
      showErrorToast(coursesState.error);
    }
  }, [coursesState.error]);

  const allCourses = coursesState.data?.courses || [];

  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return allCourses;
    return allCourses.filter(
      (course) =>
        course.fullName.toLowerCase().includes(q) ||
        course.shortName.toLowerCase().includes(q) ||
        course.displayName.toLowerCase().includes(q),
    );
  }, [allCourses, search]);

  const loading = coursesState.loading;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <Typography variant="h1" className="text-2xl font-bold text-slate-900">
                Mata Pelajaran Saya
              </Typography>
              <Typography variant="body" className="text-sm text-slate-500 mt-0.5">
                Daftar semua mata pelajaran yang Anda ikuti saat ini.
              </Typography>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 shrink-0">
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Cari mata pelajaran..."
            size="md"
          />
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <Card
              key={`course-skeleton-${idx}`}
              className="p-6 space-y-4 shadow-sm border border-slate-100"
            >
              <div className="flex gap-4">
                <Skeleton height={52} width={52} rounded className="rounded-2xl" />
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
                <Skeleton height={8} width="100%" rounded className="rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && coursesState.error && (
        <EmptyState
          title="Gagal Memuat Mata Pelajaran"
          description={coursesState.error}
          action={
            <Button size="sm" onClick={() => void listCourses()}>
              Coba Lagi
            </Button>
          }
        />
      )}

      {!loading && !coursesState.error && allCourses.length === 0 && (
        <EmptyState
          title="Belum Terdaftar di Mata Pelajaran"
          description="Anda belum terdaftar pada mata pelajaran apa pun saat ini. Silakan hubungi admin sekolah atau guru pengampu Anda."
          icon={<BookOpen className="w-6 h-6 text-slate-400" />}
        />
      )}

      {!loading && !coursesState.error && allCourses.length > 0 && filteredCourses.length === 0 && (
        <EmptyState
          title="Mata Pelajaran Tidak Ditemukan"
          description={`Tidak ada mata pelajaran yang cocok dengan kata kunci "${search}".`}
          action={
            <Button size="sm" variant="outline" onClick={() => setSearch("")}>
              Reset Pencarian
            </Button>
          }
        />
      )}

      {!loading && !coursesState.error && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCourses.map((course, idx) => {
            const colors = [
              "bg-indigo-50 text-indigo-600",
              "bg-blue-50 text-blue-600",
              "bg-emerald-50 text-emerald-600",
              "bg-amber-50 text-amber-600",
              "bg-rose-50 text-rose-600",
              "bg-teal-50 text-teal-600",
            ];
            const barColors = [
              "bg-indigo-500",
              "bg-blue-500",
              "bg-emerald-500",
              "bg-amber-500",
              "bg-rose-500",
              "bg-teal-500",
            ];
            const colorClass = colors[idx % colors.length];
            const barColorClass = barColors[idx % barColors.length];

            const hasProgress =
              course.progress !== null && course.progress !== undefined;
            const progressValue = hasProgress
              ? Math.min(100, Math.max(0, Math.round(course.progress!)))
              : 0;

            return (
              <Button
                key={course.id}
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => handleNavigateToCourseDetail(course.id)}
                className="p-0 h-auto rounded-2xl block text-left w-full hover:bg-transparent font-normal whitespace-normal transition-none"
              >
                <div className="border border-slate-200/80 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all bg-white h-full flex flex-col w-full">
                  <div className="flex gap-4 mb-5">
                    <div
                      className={`p-4 rounded-2xl ${colorClass} group-hover:scale-105 transition-transform duration-200 shrink-0`}
                    >
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                          {course.shortName}
                        </span>
                        <CourseProgressBadge
                          progress={course.progress}
                          isCompleted={course.isCompleted}
                        />
                      </div>
                      <Typography
                        variant="h3"
                        className="font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors"
                      >
                        {course.displayName}
                      </Typography>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Progress
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {hasProgress ? `${progressValue}%` : "Belum tersedia"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      {hasProgress && (
                        <div
                          className={`h-2 rounded-full ${barColorClass}`}
                          style={{ width: `${progressValue}%` }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
