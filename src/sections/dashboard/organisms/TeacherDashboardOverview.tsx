"use client";

import { useEffect } from "react";
import Card from "@/shared-ui/component/Card";
import LinkButton from "@/shared-ui/component/LinkButton";
import Typography from "@/shared-ui/component/Typography";
import StatCard from "@/sections/dashboard/molecules/StatCard";
import DashboardHeader from "@/sections/dashboard/molecules/DashboardHeader";
import { useDashboardApi } from "@/modules/dashboard/presentation/hooks/useDashboardApi";

export default function TeacherDashboardOverview() {
  const { teacherState, fetchTeacherOverview } = useDashboardApi();

  useEffect(() => {
    fetchTeacherOverview();
  }, [fetchTeacherOverview]);

  const { data, loading, error } = teacherState;

  if (error) {
    return (
      <div className="flex justify-center py-20 text-red-500">
        Gagal memuat: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader
        title="Ruang Kerja Guru"
        subtitle="Kelola soal, kelas, dan pantau kemajuan peserta didik Anda."
        titleClassName="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent"
        borderBottom={false}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          label="Kelas Aktif"
          value={data?.activeClasses ?? 0}
          hint="Total kelas aktif diajar"
          accent="emerald"
          loading={loading}
          unavailable={!data}
        />
        <StatCard
          label="Total Soal Dibuat"
          value={data?.totalQuestions ?? 0}
          hint="Pertanyaan di bank soal"
          accent="teal"
          loading={loading}
          unavailable={!data}
        />
        <StatCard
          label="Ujian Mendatang"
          value={data?.upcomingExamsCount ?? 0}
          hint="Segera dimulai minggu ini"
          accent="blue"
          loading={loading}
          unavailable={!data}
        />
      </div>

      <Card className="shadow-xl shadow-emerald-500/5 dark:shadow-none border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md overflow-hidden transition-colors">
        <div className="px-6 py-5 border-b border-slate-200/60 dark:border-slate-800 flex justify-between items-center">
          <Typography variant="h2" className="text-slate-900 dark:text-white">
            Aktivitas Ujian Kelas
          </Typography>
          <LinkButton
            href="/teacher/exams"
            variant="secondary"
            className="text-xs px-3 py-1"
          >
            Lihat Semua
          </LinkButton>
        </div>
        <div className="p-6">
          <Typography variant="body" className="text-slate-500 dark:text-slate-400 text-sm">
            Belum ada ujian kelas yang sedang berjalan hari ini.
          </Typography>
        </div>
      </Card>
    </div>
  );
}
