"use client";

import { useEffect } from "react";
import Card from "@/shared-ui/component/Card";
import LinkButton from "@/shared-ui/component/LinkButton";
import Typography from "@/shared-ui/component/Typography";
import StatCard from "@/sections/dashboard/molecules/StatCard";
import DashboardHeader from "@/sections/dashboard/molecules/DashboardHeader";
import { useDashboardApi } from "@/modules/dashboard/presentation/hooks/useDashboardApi";
import Skeleton from "@/shared-ui/component/Skeleton";

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
          label="Total Siswa Terdaftar"
          value={data?.totalStudents ?? 0}
          hint="Di seluruh mata pelajaran"
          accent="blue"
          loading={loading}
          unavailable={!data}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* WIDGET PERINGATAN / ACTION REQUIRED */}
        <div className="lg:col-span-2">
          <Card className="border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-900/10 shadow-sm p-5">
            <Typography variant="h4" className="text-rose-700 dark:text-rose-400 font-bold mb-3 flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-pulse"></span>
              Peringatan & Tindakan Diperlukan
            </Typography>
            <div className="space-y-3">
              {loading ? (
                 <Skeleton className="h-10 w-full rounded" />
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-800">
                    <Typography variant="body" className="text-sm">Ujian <strong>"Matematika Mid-Term"</strong> dijadwalkan besok namun belum memiliki soal.</Typography>
                    <LinkButton href="/teacher/exams/manage" variant="secondary" className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50">Tambahkan Soal</LinkButton>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-800">
                    <Typography variant="body" className="text-sm">Terdapat <strong>3 insiden mencurigakan</strong> pada sesi Proctoring ujian terakhir.</Typography>
                    <LinkButton href="/teacher/proctoring/reports" variant="secondary" className="text-xs text-amber-600 border-amber-200 hover:bg-amber-50">Lihat Laporan</LinkButton>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
        <Card className="shadow-xl shadow-emerald-500/5 dark:shadow-none border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md overflow-hidden transition-colors">
          <div className="px-6 py-5 border-b border-slate-200/60 dark:border-slate-800 flex justify-between items-center">
            <Typography variant="h2" className="text-slate-900 dark:text-white">
              Mata Pelajaran Saya
            </Typography>
            <LinkButton
              href="/teacher/courses"
              variant="secondary"
              className="text-xs px-3 py-1"
            >
              Lihat Semua
            </LinkButton>
          </div>
          <div className="p-6 space-y-4">
            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            )}
            {!loading && (!data?.courses || data.courses.length === 0) && (
              <Typography variant="body" className="text-slate-500 dark:text-slate-400 text-sm text-center py-6">
                Belum ada mata pelajaran yang Anda ampu.
              </Typography>
            )}
            {!loading && data?.courses?.slice(0, 5).map(course => (
               <div key={course.id} className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex justify-between items-start">
                     <div>
                        <Typography variant="body" className="font-semibold text-slate-900 dark:text-white">{course.name}</Typography>
                        <Typography variant="caption" className="text-slate-500 dark:text-slate-400">{course.shortName}</Typography>
                     </div>
                  </div>
               </div>
            ))}
          </div>
        </Card>

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
          <div className="p-6 space-y-4">
            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            )}
            {!loading && (!data?.recentExams || data.recentExams.length === 0) && (
              <Typography variant="body" className="text-slate-500 dark:text-slate-400 text-sm text-center py-6">
                Belum ada ujian kelas yang dijadwalkan.
              </Typography>
            )}
            {!loading && data?.recentExams?.map(exam => (
               <div key={exam.id} className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                     <div>
                        <Typography variant="body" className="font-semibold text-slate-900 dark:text-white">{exam.name}</Typography>
                        <Typography variant="caption" className="text-slate-500 dark:text-slate-400">{exam.course}</Typography>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                     <div>
                        <Typography variant="caption" className="text-slate-400">Tanggal</Typography>
                        <Typography variant="body" className="text-sm font-medium">{exam.scheduledDate.split(", ")[0]}</Typography>
                     </div>
                     <div>
                        <Typography variant="caption" className="text-slate-400">Durasi</Typography>
                        <Typography variant="body" className="text-sm font-medium">{exam.duration} Menit</Typography>
                     </div>
                  </div>
               </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
