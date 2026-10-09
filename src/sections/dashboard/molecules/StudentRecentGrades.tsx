"use client";

import { Award, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/libs/routes";
import type { GradeSummaryDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";

interface Props {
  recentGrades?: GradeSummaryDto[];
}

export function StudentRecentGrades({ recentGrades }: Props) {
  const router = useRouter();

  const handleNavigateToAllGrades = () => {
    router.push(ROUTES.STUDENT.RESULTS);
  };

  return (
    <Card className="border-slate-100 shadow-sm p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-extrabold flex items-center gap-2">
          <Award className="w-5 h-5 text-slate-700" /> Nilai Terbaru
        </h3>
        <Button
          size="sm"
          variant="ghost"
          color="primary"
          rightIcon={ChevronRight}
          onClick={handleNavigateToAllGrades}
          className="text-blue-600 text-sm font-semibold hover:text-blue-700 h-auto p-0"
        >
          Lihat Semua
        </Button>
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
            {recentGrades?.map((grade) => (
              <tr
                key={`${grade.courseName}-${grade.score}-${grade.grade}`}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3.5 font-bold text-slate-800">
                  {grade.courseName}
                </td>
                <td className="px-4 py-3.5 text-center font-extrabold text-slate-700">
                  {grade.score}
                </td>
                <td className="px-4 py-3.5 text-center font-extrabold text-emerald-600">
                  {grade.grade}
                </td>
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
          <Button
            size="sm"
            variant="ghost"
            color="primary"
            rightIcon={ChevronRight}
            onClick={handleNavigateToAllGrades}
            className="text-blue-600 text-sm font-bold hover:text-blue-700 h-auto p-0"
          >
            Lihat Semua Nilai
          </Button>
        </div>
      </div>
    </Card>
  );
}
