"use client";

import { useEffect } from "react";
import Card from "@/shared-ui/component/Card";
import LinkButton from "@/shared-ui/component/LinkButton";
import Button from "@/shared-ui/component/Button";
import Typography from "@/shared-ui/component/Typography";
import { useDashboardApi } from "@/modules/dashboard/presentation/hooks/useDashboardApi";
import DashboardHeader from "@/sections/dashboard/molecules/DashboardHeader";
import { BookOpen, Calendar, Clock, GraduationCap, PlayCircle, Trophy } from "lucide-react";

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

  const totalCourses = data?.courses?.length || 0;
  const activeExams = data?.upcomingExams?.filter(e => e.status === "open").length || 0;
  const avgProgress = data?.courses && data.courses.length > 0 
    ? Math.round(data.courses.reduce((acc, curr) => acc + (curr.progress || 0), 0) / data.courses.length) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-12">
      {/* Banner / Greeting Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 text-white shadow-xl shadow-blue-500/20">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <GraduationCap className="w-64 h-64 transform rotate-12 translate-x-8 -translate-y-12" />
        </div>
        <div className="relative p-8 md:p-12 z-10 flex flex-col md:flex-row items-center justify-between">
          <div>
            <Typography variant="h2" className="text-white font-bold mb-2">
              Selamat datang, {data?.profile?.name || "Siswa"} 👋
            </Typography>
            <Typography variant="body" className="text-blue-100 max-w-2xl text-lg">
              {data?.profile?.className} • {data?.profile?.schoolName} • Tahun Pelajaran {data?.profile?.academicYear}
            </Typography>
          </div>
          <div className="mt-6 md:mt-0 flex gap-3">
            <LinkButton href="/student/exams" variant="secondary" className="font-semibold bg-white text-indigo-600 hover:bg-blue-50 rounded-full px-6 py-3 shadow-md">
              Lihat Ujian
            </LinkButton>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <LinkButton href="/student/courses" variant="outline" className="flex flex-col items-center justify-center p-4 h-24 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300">
          <BookOpen className="w-6 h-6 mb-2 text-indigo-500" />
          <span className="text-sm font-medium">Mata Pelajaran</span>
        </LinkButton>
        <LinkButton href="/student/assignments" variant="outline" className="flex flex-col items-center justify-center p-4 h-24 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300">
          <Trophy className="w-6 h-6 mb-2 text-rose-500" />
          <span className="text-sm font-medium">Tugas</span>
        </LinkButton>
        <LinkButton href="/student/calendar" variant="outline" className="flex flex-col items-center justify-center p-4 h-24 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300">
          <Calendar className="w-6 h-6 mb-2 text-amber-500" />
          <span className="text-sm font-medium">Kalender</span>
        </LinkButton>
        <LinkButton href="/student/grades" variant="outline" className="flex flex-col items-center justify-center p-4 h-24 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300">
          <GraduationCap className="w-6 h-6 mb-2 text-emerald-500" />
          <span className="text-sm font-medium">Nilai</span>
        </LinkButton>
        
        {data?.profile?.educationLevel !== "SD" && (
          <LinkButton href="/student/announcements" variant="outline" className="flex flex-col items-center justify-center p-4 h-24 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 col-span-2 md:col-span-4 lg:col-span-1">
            <PlayCircle className="w-6 h-6 mb-2 text-sky-500" />
            <span className="text-sm font-medium">Pengumuman</span>
          </LinkButton>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex items-center">
          <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-5">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <Typography variant="caption" className="text-slate-500 font-medium">Total Mata Pelajaran</Typography>
            <Typography variant="h3" className="font-bold text-slate-900 dark:text-white">{totalCourses}</Typography>
          </div>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex items-center">
          <div className="p-4 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mr-5">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <Typography variant="caption" className="text-slate-500 font-medium">Ujian Mendatang</Typography>
            <Typography variant="h3" className="font-bold text-slate-900 dark:text-white">{activeExams}</Typography>
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex items-center">
          <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mr-5">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <Typography variant="caption" className="text-slate-500 font-medium">Rata-rata Progress</Typography>
            <Typography variant="h3" className="font-bold text-slate-900 dark:text-white">{avgProgress}%</Typography>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Left Column: Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <Typography variant="h4" className="font-bold flex items-center text-slate-800 dark:text-slate-100">
                <BookOpen className="w-5 h-5 mr-2 text-indigo-500" />
                Mata Pelajaran Saya
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(!data?.courses || data.courses.length === 0) && (
              <div className="col-span-1 md:col-span-2 text-center py-10 text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                Anda belum mengikuti mata pelajaran apapun.
              </div>
            )}
            
            {data?.courses?.map((course) => (
              <Card key={course.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 overflow-hidden group">
                <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-blue-400"></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <Typography variant="h5" className="font-bold text-slate-900 dark:text-white line-clamp-1" title={course.name}>{course.name}</Typography>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-medium mr-2">{course.shortName}</span>
                        <span>{course.instructor}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-1.5">
                        <Typography variant="caption" className="text-slate-500 font-medium">Progress</Typography>
                        <Typography variant="caption" className="text-indigo-600 dark:text-indigo-400 font-bold">{course.progress || 0}%</Typography>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className="bg-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${course.progress || 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Upcoming Exams */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <Typography variant="h4" className="font-bold flex items-center text-slate-800 dark:text-slate-100">
                <Clock className="w-5 h-5 mr-2 text-rose-500" />
                Ujian Mendatang
            </Typography>
          </div>

          <div className="space-y-4">
            {(!data?.upcomingExams || data.upcomingExams.length === 0) && (
              <div className="text-center py-10 text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                Tidak ada ujian mendatang.
              </div>
            )}
            
            {data?.upcomingExams?.map((exam) => (
              <Card key={exam.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                {exam.status === "open" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
                )}
                <div className="p-5 pl-6">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
                    {exam.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
                    {exam.course}
                  </p>

                  <div className="flex flex-col space-y-2 mb-5 text-sm">
                    <div className="flex items-center text-slate-600 dark:text-slate-300">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        <span>{exam.scheduledDate.split(", ")[0]}</span>
                    </div>
                    <div className="flex items-center text-slate-600 dark:text-slate-300">
                        <Clock className="w-4 h-4 mr-2 text-slate-400" />
                        <span>{exam.duration} Menit</span>
                    </div>
                  </div>

                  {exam.status === "open" ? (
                    <LinkButton
                      href={"/student/exams/$/attempt"}
                      variant="primary"
                      className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" /> Mulai Ujian
                    </LinkButton>
                  ) : (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full justify-center text-slate-400 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                    >
                      Belum Dimulai
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
