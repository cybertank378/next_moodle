import {
  Bell,
  CheckCircle,
  ChevronRight,
  FileText,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import type { ExamSummaryDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";
import Card from "@/shared-ui/component/Card";

interface Props {
  upcomingExams?: ExamSummaryDto[];
}

export function StudentUpcomingTasks({ upcomingExams }: Props) {
  return (
    <Card className="border-slate-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-extrabold flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-700" /> Tugas & Deadline
        </h3>
        <Link
          href="/dashboard/assignments"
          className="text-blue-600 text-sm font-semibold flex items-center hover:text-blue-700"
        >
          Lihat Semua <ChevronRight className="w-4 h-4 ml-0.5" />
        </Link>
      </div>
      <div className="space-y-4">
        {upcomingExams?.slice(0, 4).map((exam, idx) => {
          const icons = [
            {
              bg: "bg-red-50",
              text: "text-red-500",
              icon: <FileText className="w-5 h-5" />,
              badge: "bg-red-50 text-red-600",
              badgeText: "2 hari lagi",
            },
            {
              bg: "bg-orange-50",
              text: "text-orange-500",
              icon: <Bell className="w-5 h-5" />,
              badge: "bg-orange-50 text-orange-600",
              badgeText: "4 hari lagi",
            },
            {
              bg: "bg-emerald-50",
              text: "text-emerald-500",
              icon: <CheckCircle className="w-5 h-5" />,
              badge: "bg-emerald-50 text-emerald-600",
              badgeText: "7 hari lagi",
            },
            {
              bg: "bg-blue-50",
              text: "text-blue-500",
              icon: <PlayCircle className="w-5 h-5" />,
              badge: "bg-slate-100 text-slate-600",
              badgeText: "10 hari lagi",
            },
          ];
          const st = icons[idx % icons.length];
          return (
            <div
              key={exam.id}
              className="flex gap-4 items-center p-3.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
            >
              <div className={`p-3 ${st.bg} ${st.text} rounded-2xl shrink-0`}>
                {st.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-800 line-clamp-1">
                  {exam.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">
                  {exam.course} • Batas: {exam.scheduledDate.split(", ")[0]}
                </p>
              </div>
              <div className="shrink-0">
                <span
                  className={`px-3 py-1 text-[11px] font-bold rounded-full ${st.badge}`}
                >
                  {st.badgeText}
                </span>
              </div>
            </div>
          );
        })}
        {(!upcomingExams || upcomingExams.length === 0) && (
          <div className="py-10 text-center text-slate-500 text-sm font-medium border-2 border-dashed border-slate-100 rounded-2xl">
            Tidak ada tugas mendatang.
          </div>
        )}
      </div>
    </Card>
  );
}
