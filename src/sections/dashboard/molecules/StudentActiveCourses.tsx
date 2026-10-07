import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { CourseSummaryDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";
import Card from "@/shared-ui/component/Card";

interface Props {
  courses?: CourseSummaryDto[];
}

export function StudentActiveCourses({ courses }: Props) {
  return (
    <Card className="border-slate-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-extrabold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-slate-700" /> Mata Pelajaran
        </h3>
        <Link
          href="/dashboard/courses"
          className="text-blue-600 text-sm font-semibold flex items-center hover:text-blue-700"
        >
          Lihat Semua <ChevronRight className="w-4 h-4 ml-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses?.slice(0, 6).map((course, idx) => {
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
            <div
              key={course.id}
              className="border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex gap-4 mb-5">
                <div className={`p-3.5 rounded-2xl ${colorClass}`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 line-clamp-1">
                    {course.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Guru: {course.instructor}
                  </p>
                </div>
              </div>
              <div className="mt-auto">
                <div className="flex justify-end mb-1.5">
                  <span className="text-[11px] font-bold text-slate-600">
                    {course.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${barColorClass}`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}

        {(!courses || courses.length === 0) && (
          <div className="col-span-full py-10 text-center text-slate-500 border-2 border-dashed border-slate-100 rounded-2xl font-medium">
            Belum ada mata pelajaran aktif.
          </div>
        )}
      </div>
    </Card>
  );
}
