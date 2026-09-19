"use client";

import { BookOpen } from "lucide-react";
import { useMemo, useState } from "react";
import { useCourseApi } from "@/modules/courses/presentation/hooks/useCourseApi";
import { EmptyState } from "@/shared-ui/component/EmptyState";
import { ErrorState } from "@/shared-ui/component/ErrorState";
import { SearchField } from "@/shared-ui/component/SearchField";
import { CourseCard } from "../molecules/CourseCard";
import { CourseSkeletonCard } from "../molecules/CourseSkeletonCard";

export interface CourseListViewProps {
  readonly onCourseClick?: (courseId: string) => void;
}

export function CourseListView({ onCourseClick }: CourseListViewProps) {
  const { courses, loading, error, refresh } = useCourseApi();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const q = searchQuery.toLowerCase();
    return courses.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q),
    );
  }, [courses, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Daftar Kursus Saya
          </h2>
          <p className="text-sm text-muted-foreground">
            Akses materi, jadwal ujian, dan tugas yang terdaftar pada akun Anda.
          </p>
        </div>
        <SearchField
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Cari nama atau kode kursus..."
        />
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            "card-skel-1",
            "card-skel-2",
            "card-skel-3",
            "card-skel-4",
            "card-skel-5",
            "card-skel-6",
          ].map((skelId) => (
            <CourseSkeletonCard key={skelId} />
          ))}
        </div>
      )}

      {!loading && error && (
        <ErrorState
          title="Gagal Memuat Kursus"
          message={error}
          onRetry={refresh}
        />
      )}

      {!loading && !error && filteredCourses.length === 0 && (
        <EmptyState
          icon={<BookOpen className="h-6 w-6" />}
          title={searchQuery ? "Tidak Ditemukan" : "Belum Ada Kursus"}
          description={
            searchQuery
              ? `Tidak ada kursus yang cocok dengan pencarian "${searchQuery}".`
              : "Anda belum terdaftar dalam kursus manapun di platform LMS ini."
          }
          actionLabel={searchQuery ? "Reset Pencarian" : undefined}
          onAction={searchQuery ? () => setSearchQuery("") : undefined}
        />
      )}

      {!loading && !error && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onSelectCourse={onCourseClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
