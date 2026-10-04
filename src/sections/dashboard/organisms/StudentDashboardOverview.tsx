"use client";

import { useEffect } from "react";
import Card from "@/shared-ui/component/Card";
import LinkButton from "@/shared-ui/component/LinkButton";
import Button from "@/shared-ui/component/Button";
import { useDashboardApi } from "@/modules/dashboard/presentation/hooks/useDashboardApi";
import DashboardHeader from "@/sections/dashboard/molecules/DashboardHeader";

export default function StudentDashboardOverview() {
  const { studentState, fetchStudentOverview } = useDashboardApi();

  useEffect(() => {
    fetchStudentOverview();
  }, [fetchStudentOverview]);

  const { data, loading, error } = studentState;

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        Memuat dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-20 text-red-500">
        Gagal memuat: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <DashboardHeader
        title="Ujian Mendatang Saya"
        subtitle="Lihat dan mulai jadwal ujian Anda di bawah ini."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.upcomingExams?.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-10 text-slate-500">
            Tidak ada ujian mendatang.
          </div>
        )}
        
        {data?.upcomingExams?.map((exam) => (
          <Card key={exam.id} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg shadow-blue-500/5 dark:shadow-none border border-slate-200/60 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700/50 hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 transition-all duration-300 group">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {exam.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {exam.course}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 mb-1">Tanggal</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-200">
                    {exam.scheduledDate.split(", ")[0]}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {exam.scheduledDate.split(", ")[1]}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 mb-1">
                    Durasi
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-slate-200">
                    {exam.duration} Menit
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 mb-1">
                    Status
                  </p>
                  {exam.status === "open" ? (
                    <span className="inline-flex items-center text-emerald-700 dark:text-emerald-400 font-medium">
                      <span className="w-2 h-2 mr-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse"></span>
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-slate-700 dark:text-slate-400 font-medium capitalize">
                      {exam.status}
                    </span>
                  )}
                </div>
              </div>

              {exam.status === "open" ? (
                <LinkButton
                  href={`/student/exams/${exam.id}/attempt`}
                  variant="primary"
                  className="w-full justify-center shadow-md shadow-blue-500/20 dark:shadow-none"
                >
                  Mulai Ujian
                </LinkButton>
              ) : (
                <Button
                  disabled
                  variant="outline"
                  className="w-full justify-center text-slate-400 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50"
                >
                  Belum Dimulai
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
