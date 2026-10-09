"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/libs/routes";
import { useDashboardApi } from "@/modules/dashboard/presentation/hooks/useDashboardApi";
import DashboardHeader from "@/sections/dashboard/molecules/DashboardHeader";
import StatCard from "@/sections/dashboard/molecules/StatCard";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import Skeleton from "@/shared-ui/component/Skeleton";
import { showErrorToast } from "@/shared-ui/component/Toast";
import Typography from "@/shared-ui/component/Typography";

export default function TeacherDashboardOverview() {
  const router = useRouter();
  const { teacherState, fetchTeacherOverview } = useDashboardApi();

  const handleNavigateToQuestions = () => {
    router.push(ROUTES.TEACHER.QUESTIONS);
  };

  const handleNavigateToResults = () => {
    router.push(ROUTES.TEACHER.RESULTS);
  };

  const handleNavigateToCourses = () => {
    router.push(ROUTES.TEACHER.COURSES);
  };

  const handleNavigateToExams = () => {
    router.push(ROUTES.TEACHER.EXAMS);
  };

  useEffect(() => {
    fetchTeacherOverview();
  }, [fetchTeacherOverview]);

  const { data, loading, error } = teacherState;

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader
        title="Ruang Kerja Guru"
        subtitle="Kelola soal, kelas, dan pantau kemajuan peserta didik Anda."
        titleClassName="bg-gradient-to-r from-emerald-600 to-teal-500   bg-clip-text text-transparent"
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
          <Card className="border border-rose-200  bg-rose-50/50  shadow-sm p-5">
            <Typography
              variant="h4"
              className="text-rose-700  font-bold mb-3 flex items-center"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-pulse"></span>
              Peringatan & Tindakan Diperlukan
            </Typography>
            <div className="space-y-3">
              {loading ? (
                <Skeleton className="h-10 w-full rounded" />
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white  border border-rose-100 ">
                    <Typography variant="body" className="text-sm">
                      Ujian <strong>"Matematika Mid-Term"</strong> dijadwalkan
                      besok namun belum memiliki soal.
                    </Typography>
                    <Button
                      onClick={handleNavigateToQuestions}
                      variant="outline"
                      color="danger"
                      size="sm"
                    >
                      Tambahkan Soal
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white  border border-amber-100 ">
                    <Typography variant="body" className="text-sm">
                      Terdapat <strong>3 insiden mencurigakan</strong> pada sesi
                      Proctoring ujian terakhir.
                    </Typography>
                    <Button
                      onClick={handleNavigateToResults}
                      variant="outline"
                      color="warning"
                      size="sm"
                    >
                      Lihat Laporan
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
        <Card className="shadow-xl shadow-emerald-500/5  border border-slate-200/60  bg-white/70  backdrop-blur-md overflow-hidden transition-colors">
          <div className="px-6 py-5 border-b border-slate-200/60  flex justify-between items-center">
            <Typography variant="h2" className="text-slate-900 ">
              Mata Pelajaran Saya
            </Typography>
            <Button
              onClick={handleNavigateToCourses}
              variant="secondary"
              size="sm"
            >
              Lihat Semua
            </Button>
          </div>
          <div className="p-6 space-y-4">
            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            )}
            {!loading && (!data?.courses || data.courses.length === 0) && (
              <Typography
                variant="body"
                className="text-slate-500  text-sm text-center py-6"
              >
                Belum ada mata pelajaran yang Anda ampu.
              </Typography>
            )}
            {!loading &&
              data?.courses?.slice(0, 5).map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-xl border border-slate-200/50  bg-slate-50/50  hover:bg-slate-100/50  transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Typography
                        variant="body"
                        className="font-semibold text-slate-900 "
                      >
                        {course.name}
                      </Typography>
                      <Typography variant="caption" className="text-slate-500 ">
                        {course.shortName}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card className="shadow-xl shadow-emerald-500/5  border border-slate-200/60  bg-white/70  backdrop-blur-md overflow-hidden transition-colors">
          <div className="px-6 py-5 border-b border-slate-200/60  flex justify-between items-center">
            <Typography variant="h2" className="text-slate-900 ">
              Aktivitas Ujian Kelas
            </Typography>
            <Button
              onClick={handleNavigateToExams}
              variant="secondary"
              size="sm"
            >
              Lihat Semua
            </Button>
          </div>
          <div className="p-6 space-y-4">
            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            )}
            {!loading &&
              (!data?.recentExams || data.recentExams.length === 0) && (
                <Typography
                  variant="body"
                  className="text-slate-500  text-sm text-center py-6"
                >
                  Belum ada ujian kelas yang dijadwalkan.
                </Typography>
              )}
            {!loading &&
              data?.recentExams?.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-xl border border-slate-200/50  bg-slate-50/50  hover:bg-slate-100/50  transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Typography
                        variant="body"
                        className="font-semibold text-slate-900 "
                      >
                        {exam.name}
                      </Typography>
                      <Typography variant="caption" className="text-slate-500 ">
                        {exam.course}
                      </Typography>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div>
                      <Typography variant="caption" className="text-slate-400">
                        Tanggal
                      </Typography>
                      <Typography
                        variant="body"
                        className="text-sm font-medium"
                      >
                        {exam.scheduledDate.split(", ")[0]}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="caption" className="text-slate-400">
                        Durasi
                      </Typography>
                      <Typography
                        variant="body"
                        className="text-sm font-medium"
                      >
                        {exam.duration} Menit
                      </Typography>
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
