import Card from "@/shared-ui/component/Card";
import { Award, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { GradeSummaryDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";

interface Props {
  recentGrades?: GradeSummaryDto[];
}

export function StudentRecentGrades({ recentGrades }: Props) {
  return (
    <Card className="border-slate-100 shadow-sm p-6 flex flex-col">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-extrabold flex items-center gap-2"><Award className="w-5 h-5 text-slate-700"/> Nilai Terbaru</h3>
          <Link href="/student/grades" className="text-blue-600 text-sm font-semibold flex items-center hover:text-blue-700">Lihat Semua <ChevronRight className="w-4 h-4 ml-0.5"/></Link>
       </div>
       <div className="flex-1 flex flex-col">
          <table className="w-full text-sm text-left">
             <thead className="text-xs text-slate-500 border-b-2 border-slate-100">
                <tr>
                   <th className="px-4 py-3 font-semibold">Mata Pelajaran</th>
                   <th className="px-4 py-3 font-semibold text-center">Nilai</th>
                   <th className="px-4 py-3 font-semibold text-center">Predikat</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                 {recentGrades?.map((grade, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                       <td className="px-4 py-3.5 font-bold text-slate-800">{grade.courseName}</td>
                       <td className="px-4 py-3.5 text-center font-extrabold text-slate-700">{grade.score}</td>
                       <td className="px-4 py-3.5 text-center font-extrabold text-emerald-600">{grade.grade}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
           {(!recentGrades || recentGrades.length === 0) && (
              <div className="py-10 text-center text-slate-500 text-sm font-medium border-2 border-dashed border-slate-100 rounded-2xl mx-4 mt-4 mb-4">
                 Belum ada nilai yang dipublikasikan.
              </div>
           )}
          <div className="mt-auto pt-4 px-2">
             <Link href="/student/grades" className="text-blue-600 text-sm font-bold flex items-center hover:text-blue-700">Lihat Semua Nilai <ChevronRight className="w-4 h-4 ml-1"/></Link>
          </div>
       </div>
    </Card>
  );
}
