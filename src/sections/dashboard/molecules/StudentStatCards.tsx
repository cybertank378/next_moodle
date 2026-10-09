import Card from "@/shared-ui/component/Card";
import { BookOpen, FileText, Award, Flame } from "lucide-react";

interface Props {
  totalCourses: number;
  activeExams: number;
  avgGradeScore: number;
  avgGradeLetter: string;
  avgProgress: number;
}

export function StudentStatCards({ totalCourses, activeExams, avgGradeScore, avgGradeLetter, avgProgress }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-5 border-blue-100/60 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
         <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl"><BookOpen className="w-6 h-6"/></div>
         <div>
            <p className="text-xs text-slate-500 font-bold mb-0.5">Mata Pelajaran</p>
            <p className="text-2xl font-bold text-slate-800 leading-none">{totalCourses}</p>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Pelajaran aktif</p>
         </div>
      </Card>
      <Card className="p-5 border-orange-100/60 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
         <div className="p-3.5 bg-orange-50 text-orange-500 rounded-2xl"><FileText className="w-6 h-6"/></div>
         <div>
            <p className="text-xs text-slate-500 font-bold mb-0.5">Tugas Mendatang</p>
            <p className="text-2xl font-bold text-slate-800 leading-none">{activeExams}</p>
            <p className="text-[10px] text-blue-500 font-semibold mt-1">Dalam 7 hari</p>
         </div>
      </Card>
      <Card className="p-5 border-emerald-100/60 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
         <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl"><Award className="w-6 h-6"/></div>
         <div>
            <p className="text-xs text-slate-500 font-bold mb-0.5">Rata-rata Nilai</p>
            <p className="text-2xl font-bold text-slate-800 leading-none">{avgGradeScore > 0 ? avgGradeScore : "-"}</p>
            <p className={`text-[10px] font-bold mt-1 ${avgGradeScore > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
               {avgGradeScore > 0 ? avgGradeLetter : "Belum ada"}
            </p>
         </div>
      </Card>
      <Card className="p-5 border-purple-100/60 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
         <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl"><Flame className="w-6 h-6"/></div>
         <div>
            <p className="text-xs text-slate-500 font-bold mb-0.5">Progress Belajar</p>
            <p className="text-2xl font-bold text-slate-800 leading-none">{avgProgress}%</p>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Dari semua mata pelajaran</p>
         </div>
      </Card>
    </div>
  );
}
