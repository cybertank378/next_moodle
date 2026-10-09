import { BookOpen, CheckCircle, ChevronRight, PlayCircle } from "lucide-react";
import type { CourseSummaryDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";
import Card from "@/shared-ui/component/Card";

interface Props {
  courses?: CourseSummaryDto[];
}

export function StudentResumeLearning({ courses }: Props) {
  return (
    <Card className="border-slate-100 shadow-sm p-6 overflow-hidden">
      <div className="flex items-center gap-4 mb-5">
        <div className="p-2.5 bg-blue-700 text-white rounded-full shadow-md shadow-blue-500/30">
          <PlayCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-800">
            Lanjutkan Belajar
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Materi terakhir yang kamu akses
          </p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
        {courses?.slice(0, 3).map((course, idx) => {
          const icons = [
            <BookOpen key="1" className="w-6 h-6" />,
            <CheckCircle key="2" className="w-6 h-6" />,
            <BookOpen key="3" className="w-6 h-6" />,
          ];
          const colors = [
            "bg-emerald-50 text-emerald-600 border-emerald-100",
            "bg-blue-50 text-blue-600 border-blue-100",
            "bg-rose-50 text-rose-600 border-rose-100",
          ];
          return (
            <div
              key={course.id}
              className="min-w-[300px] flex-1 flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:border-blue-300 hover:shadow-md cursor-pointer snap-start transition-all"
            >
              <div
                className={`p-4 rounded-2xl border ${colors[idx % colors.length]}`}
              >
                {icons[idx % icons.length]}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-800 line-clamp-1">
                  {course.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-medium">
                  {course.shortName} • {idx + 2}/5 materi
                </p>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                  <div
                    className="h-1.5 rounded-full bg-blue-500"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-slate-300 bg-slate-50 p-1.5 rounded-full">
                <ChevronRight className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          );
        })}
        {(!courses || courses.length === 0) && (
          <div className="text-sm text-slate-500 font-medium">
            Belum ada kelas yang dipelajari.
          </div>
        )}
      </div>
    </Card>
  );
}
