"use client";

import { useEffect } from "react";
import Card from "@/shared-ui/component/Card";
import Typography from "@/shared-ui/component/Typography";
import { useDashboardApi } from "@/modules/dashboard/presentation/hooks/useDashboardApi";
import { 
  BookOpen, Clock, PlayCircle, FileText, Award, ChevronRight, ChevronLeft, Bell, CheckCircle, Flame, Calendar
} from "lucide-react";
import Link from "next/link";

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
    <div className="flex flex-col xl:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 w-full max-w-[1600px] mx-auto">
      
      {/* LEFT COLUMN - Main Content */}
      <div className="flex-1 space-y-6 min-w-0">
        
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-3xl bg-[#f0f7ff] border border-blue-100 p-8 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div className="flex items-center">
             <div className="w-24 h-24 mr-6 hidden sm:flex items-center justify-center">
                <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-[6px] border-white shadow-sm">
                   <span className="text-4xl">🧑‍🎓</span>
                </div>
             </div>
             <div>
                <Typography variant="h2" className="text-slate-800 font-bold mb-1 flex items-center gap-2">
                  Halo, {data?.profile?.name || "Andi Pratama"}! <span className="text-2xl">👋</span>
                </Typography>
                <Typography variant="body" className="text-slate-600 mb-4 font-medium">
                  Terus semangat belajar dan raih cita-citamu!
                </Typography>
                <div className="flex items-center text-sm font-semibold text-slate-500 space-x-2">
                   <span className="bg-white px-3 py-1 rounded-full border border-slate-200">{data?.profile?.schoolName || "SMP Negeri 1 Jakarta"}</span>
                   <span>•</span>
                   <span className="bg-white px-3 py-1 rounded-full border border-slate-200">{data?.profile?.className || "Kelas 8A"}</span>
                   <span>•</span>
                   <span className="bg-white px-3 py-1 rounded-full border border-slate-200">Semester Genap {data?.profile?.academicYear || "2024/2025"}</span>
                </div>
             </div>
          </div>
          <div className="hidden md:flex bg-white p-5 rounded-2xl shadow-sm border border-slate-100 max-w-[220px] mt-4 md:mt-0 text-sm italic text-slate-600 relative before:absolute before:left-0 before:top-4 before:bottom-4 before:w-1 before:bg-blue-300 before:rounded-r-lg">
             "Belajar hari ini, untuk masa depan yang lebih baik."
             <div className="absolute top-2 right-2 text-emerald-400 opacity-50"><Flame className="w-6 h-6"/></div>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
             <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl"><BookOpen className="w-6 h-6"/></div>
             <div>
                <p className="text-xs text-slate-500 font-bold mb-0.5">Mata Pelajaran</p>
                <p className="text-2xl font-bold text-slate-800 leading-none">{totalCourses}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Pelajaran aktif</p>
             </div>
          </Card>
          <Card className="p-5 border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
             <div className="p-3.5 bg-orange-50 text-orange-500 rounded-2xl"><FileText className="w-6 h-6"/></div>
             <div>
                <p className="text-xs text-slate-500 font-bold mb-0.5">Tugas Mendatang</p>
                <p className="text-2xl font-bold text-slate-800 leading-none">{activeExams}</p>
                <p className="text-[10px] text-blue-500 font-semibold mt-1">Dalam 7 hari</p>
             </div>
          </Card>
          <Card className="p-5 border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
             <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl"><Award className="w-6 h-6"/></div>
             <div>
                <p className="text-xs text-slate-500 font-bold mb-0.5">Rata-rata Nilai</p>
                <p className="text-2xl font-bold text-slate-800 leading-none">86.5</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">B+</p>
             </div>
          </Card>
          <Card className="p-5 border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
             <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl"><Flame className="w-6 h-6"/></div>
             <div>
                <p className="text-xs text-slate-500 font-bold mb-0.5">Progress Belajar</p>
                <p className="text-2xl font-bold text-slate-800 leading-none">{avgProgress}%</p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Dari semua mata pelajaran</p>
             </div>
          </Card>
        </div>

        {/* Mata Pelajaran Grid */}
        <Card className="border-slate-100 shadow-sm p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-extrabold flex items-center gap-2"><BookOpen className="w-5 h-5 text-slate-700"/> Mata Pelajaran</h3>
              <Link href="/student/courses" className="text-blue-600 text-sm font-semibold flex items-center hover:text-blue-700">Lihat Semua <ChevronRight className="w-4 h-4 ml-0.5"/></Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data?.courses?.slice(0, 6).map((course, idx) => {
                 const colors = ['bg-indigo-50 text-indigo-600', 'bg-blue-50 text-blue-600', 'bg-emerald-50 text-emerald-600', 'bg-orange-50 text-orange-600', 'bg-rose-50 text-rose-600', 'bg-teal-50 text-teal-600'];
                 const barColors = ['bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-rose-500', 'bg-teal-500'];
                 const colorClass = colors[idx % colors.length];
                 const barColorClass = barColors[idx % barColors.length];
                 
                 return (
                 <div key={course.id} className="border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-shadow bg-white">
                    <div className="flex gap-4 mb-5">
                       <div className={`p-3.5 rounded-2xl ${colorClass}`}><BookOpen className="w-5 h-5"/></div>
                       <div>
                          <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{course.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 font-medium">Guru: {course.instructor}</p>
                       </div>
                    </div>
                    <div className="mt-auto">
                       <div className="flex justify-end mb-1.5">
                          <span className="text-[11px] font-bold text-slate-600">{course.progress}%</span>
                       </div>
                       <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${barColorClass}`} style={{ width: `${course.progress}%` }}></div>
                       </div>
                    </div>
                 </div>
              )})}
              
              {(!data?.courses || data.courses.length === 0) && (
                 <div className="col-span-full py-10 text-center text-slate-500 border-2 border-dashed border-slate-100 rounded-2xl font-medium">Belum ada mata pelajaran aktif.</div>
              )}
           </div>
        </Card>

        {/* Dua Kolom: Tugas & Deadline | Nilai Terbaru */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Tugas & Deadline */}
           <Card className="border-slate-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-extrabold flex items-center gap-2"><FileText className="w-5 h-5 text-slate-700"/> Tugas & Deadline</h3>
                 <Link href="/student/assignments" className="text-blue-600 text-sm font-semibold flex items-center hover:text-blue-700">Lihat Semua <ChevronRight className="w-4 h-4 ml-0.5"/></Link>
              </div>
              <div className="space-y-4">
                 {data?.upcomingExams?.slice(0, 4).map((exam, idx) => {
                    const icons = [
                       { bg: "bg-red-50", text: "text-red-500", icon: <FileText className="w-5 h-5"/>, badge: "bg-red-50 text-red-600", badgeText: "2 hari lagi" },
                       { bg: "bg-orange-50", text: "text-orange-500", icon: <Bell className="w-5 h-5"/>, badge: "bg-orange-50 text-orange-600", badgeText: "4 hari lagi" },
                       { bg: "bg-emerald-50", text: "text-emerald-500", icon: <CheckCircle className="w-5 h-5"/>, badge: "bg-emerald-50 text-emerald-600", badgeText: "7 hari lagi" },
                       { bg: "bg-blue-50", text: "text-blue-500", icon: <PlayCircle className="w-5 h-5"/>, badge: "bg-slate-100 text-slate-600", badgeText: "10 hari lagi" },
                    ];
                    const st = icons[idx % icons.length];
                    return (
                    <div key={exam.id} className="flex gap-4 items-center p-3.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                       <div className={`p-3 ${st.bg} ${st.text} rounded-2xl shrink-0`}>{st.icon}</div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{exam.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">{exam.course} • Batas: {exam.scheduledDate.split(", ")[0]}</p>
                       </div>
                       <div className="shrink-0">
                          <span className={`px-3 py-1 text-[11px] font-bold rounded-full ${st.badge}`}>{st.badgeText}</span>
                       </div>
                    </div>
                 )})}
                 {(!data?.upcomingExams || data.upcomingExams.length === 0) && (
                    <div className="py-10 text-center text-slate-500 text-sm font-medium border-2 border-dashed border-slate-100 rounded-2xl">Tidak ada tugas mendatang.</div>
                 )}
              </div>
           </Card>

           {/* Nilai Terbaru */}
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
                       {/* Mock Data based on design */}
                       <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3.5 font-bold text-slate-800">Bahasa Indonesia</td>
                          <td className="px-4 py-3.5 text-center font-extrabold text-slate-700">88</td>
                          <td className="px-4 py-3.5 text-center font-extrabold text-emerald-600">B+</td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3.5 font-bold text-slate-800">Matematika</td>
                          <td className="px-4 py-3.5 text-center font-extrabold text-slate-700">82</td>
                          <td className="px-4 py-3.5 text-center font-extrabold text-slate-600">B-</td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3.5 font-bold text-slate-800">IPA</td>
                          <td className="px-4 py-3.5 text-center font-extrabold text-slate-700">90</td>
                          <td className="px-4 py-3.5 text-center font-extrabold text-emerald-600">A-</td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3.5 font-bold text-slate-800">IPS</td>
                          <td className="px-4 py-3.5 text-center font-extrabold text-slate-700">85</td>
                          <td className="px-4 py-3.5 text-center font-extrabold text-emerald-600">B+</td>
                       </tr>
                       <tr className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                          <td className="px-4 py-3.5 font-bold text-slate-800">Bahasa Inggris</td>
                          <td className="px-4 py-3.5 text-center font-extrabold text-slate-700">87</td>
                          <td className="px-4 py-3.5 text-center font-extrabold text-emerald-600">B+</td>
                       </tr>
                    </tbody>
                 </table>
                 <div className="mt-auto pt-4 px-2">
                    <Link href="/student/grades" className="text-blue-600 text-sm font-bold flex items-center hover:text-blue-700">Lihat Semua Nilai <ChevronRight className="w-4 h-4 ml-1"/></Link>
                 </div>
              </div>
           </Card>
        </div>

        {/* Lanjutkan Belajar */}
        <Card className="border-slate-100 shadow-sm p-6 overflow-hidden">
           <div className="flex items-center gap-4 mb-5">
              <div className="p-2.5 bg-blue-700 text-white rounded-full shadow-md shadow-blue-500/30"><PlayCircle className="w-5 h-5"/></div>
              <div>
                 <h3 className="text-lg font-extrabold text-slate-800">Lanjutkan Belajar</h3>
                 <p className="text-xs text-slate-500 font-medium mt-0.5">Materi terakhir yang kamu akses</p>
              </div>
           </div>
           
           <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
              {data?.courses?.slice(0, 3).map((course, idx) => {
                 const icons = [<BookOpen key="1" className="w-6 h-6"/>, <CheckCircle key="2" className="w-6 h-6"/>, <BookOpen key="3" className="w-6 h-6"/>];
                 const colors = ['bg-emerald-50 text-emerald-600 border-emerald-100', 'bg-blue-50 text-blue-600 border-blue-100', 'bg-rose-50 text-rose-600 border-rose-100'];
                 return (
                 <div key={course.id} className="min-w-[300px] flex-1 flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:border-blue-300 hover:shadow-md cursor-pointer snap-start transition-all">
                    <div className={`p-4 rounded-2xl border ${colors[idx % colors.length]}`}>
                       {icons[idx % icons.length]}
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{course.name}</h4>
                       <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-medium">{course.shortName} • {idx+2}/5 materi</p>
                       <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                          <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${course.progress}%` }}></div>
                       </div>
                    </div>
                    <div className="text-slate-300 bg-slate-50 p-1.5 rounded-full">
                       <ChevronRight className="w-4 h-4 text-blue-500"/>
                    </div>
                 </div>
              )})}
              {(!data?.courses || data.courses.length === 0) && (
                 <div className="text-sm text-slate-500 font-medium">Belum ada kelas yang dipelajari.</div>
              )}
           </div>
        </Card>

      </div>
      
      {/* RIGHT RAIL */}
      <div className="w-full xl:w-96 shrink-0 space-y-6">
        
        {/* Kalender */}
        <Card className="border-slate-100 shadow-sm p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-extrabold flex items-center gap-2"><Calendar className="w-5 h-5 text-slate-700"/> Kalender</h3>
           </div>
           
           {/* Mock Calendar */}
           <div className="mb-4">
              <div className="flex justify-between items-center mb-6">
                 <button className="text-slate-400 hover:text-slate-600 p-1"><ChevronLeft className="w-4 h-4"/></button>
                 <span className="font-bold text-sm text-slate-800">April 2025</span>
                 <button className="text-slate-400 hover:text-slate-600 p-1"><ChevronRight className="w-4 h-4"/></button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mb-3">
                 <div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div><div>Min</div>
              </div>
              <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-sm font-semibold">
                 {/* Mock dates */}
                 <div className="py-1.5 text-slate-300">30</div><div className="py-1.5 text-slate-300">31</div>
                 <div className="py-1.5 text-slate-700">1</div><div className="py-1.5 text-slate-700">2</div>
                 <div className="py-1.5 text-slate-700 relative">3<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full"></span></div>
                 <div className="py-1.5 text-slate-700 relative">4</div>
                 <div className="py-1.5 text-slate-700">5</div>
                 <div className="py-1.5 bg-blue-50 text-blue-600 rounded-lg relative">6</div>
                 <div className="py-1.5 text-slate-700 relative">7<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span></div>
                 <div className="py-1.5 text-slate-700">8</div>
                 <div className="py-1.5 text-slate-700 relative">9<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full"></span></div>
                 <div className="py-1.5 bg-blue-600 text-white rounded-full shadow-md shadow-blue-500/40 relative z-10 scale-110">10</div>
                 <div className="py-1.5 text-slate-700">11</div><div className="py-1.5 text-slate-700">12</div><div className="py-1.5 text-slate-700">13</div>
                 <div className="py-1.5 text-slate-700">14</div><div className="py-1.5 text-slate-700">15</div>
                 <div className="py-1.5 text-slate-700 relative">16<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full"></span></div>
                 <div className="py-1.5 text-slate-700 relative">17<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span></div>
                 <div className="py-1.5 text-slate-700">18</div><div className="py-1.5 text-slate-700">19</div><div className="py-1.5 text-slate-700">20</div>
                 <div className="py-1.5 text-slate-700">21</div><div className="py-1.5 text-slate-700">22</div>
                 <div className="py-1.5 text-slate-700 relative">23<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full"></span></div>
                 <div className="py-1.5 text-slate-700 relative">24<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full"></span></div>
                 <div className="py-1.5 text-slate-700 relative">25<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full"></span></div>
                 <div className="py-1.5 text-slate-700 relative">26<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span></div>
                 <div className="py-1.5 text-slate-700">27</div>
                 <div className="py-1.5 text-slate-700">28</div><div className="py-1.5 text-slate-700 relative">29<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full"></span></div>
                 <div className="py-1.5 text-slate-700 relative">30<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full"></span></div>
                 
                 <div className="col-span-7 mt-6 flex justify-between text-slate-500 px-1">
                    <span className="flex items-center text-[10px] font-bold"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>Tugas</span>
                    <span className="flex items-center text-[10px] font-bold"><span className="w-2 h-2 rounded-full bg-orange-500 mr-1.5"></span>Ujian</span>
                    <span className="flex items-center text-[10px] font-bold"><span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>Kegiatan</span>
                    <span className="flex items-center text-[10px] font-bold"><span className="w-2 h-2 rounded-full bg-slate-400 mr-1.5"></span>Lainnya</span>
                 </div>
              </div>
           </div>
        </Card>

        {/* Jadwal Pelajaran Hari Ini */}
        <Card className="border-slate-100 shadow-sm p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-extrabold flex items-center gap-2"><Clock className="w-5 h-5 text-slate-700"/> Jadwal Hari Ini</h3>
              <Link href="/student/schedule" className="text-blue-600 text-[11px] font-bold flex items-center hover:text-blue-700">Lihat Semua <ChevronRight className="w-3 h-3 ml-0.5"/></Link>
           </div>
           
           <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-slate-100">
              {/* Mock Timeline */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-5">
                 <div className="flex items-center justify-center w-3 h-3 rounded-full border-[3px] border-white bg-blue-600 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative left-0 md:left-0"></div>
                 <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-5 md:pl-0 md:group-even:pl-5 md:group-odd:pr-5 flex flex-col md:flex-row gap-1 md:gap-4 md:items-start">
                    <div className="text-[11px] font-bold text-slate-400 md:w-20 pt-1 shrink-0">07:00 - 08:30</div>
                    <div>
                       <h4 className="text-[13px] font-bold text-slate-800">Bahasa Indonesia</h4>
                       <p className="text-[11px] text-slate-500 font-medium mt-0.5">Kelas 8A • Ruang 12</p>
                    </div>
                 </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-5">
                 <div className="flex items-center justify-center w-3 h-3 rounded-full border-[3px] border-white bg-blue-600 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative left-0 md:left-0"></div>
                 <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-5 md:pl-0 md:group-even:pl-5 md:group-odd:pr-5 flex flex-col md:flex-row gap-1 md:gap-4 md:items-start">
                    <div className="text-[11px] font-bold text-slate-400 md:w-20 pt-1 shrink-0">09:00 - 10:30</div>
                    <div>
                       <h4 className="text-[13px] font-bold text-slate-800">Matematika</h4>
                       <p className="text-[11px] text-slate-500 font-medium mt-0.5">Kelas 8A • Ruang 12</p>
                    </div>
                 </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-5">
                 <div className="flex items-center justify-center w-3 h-3 rounded-full border-[3px] border-white bg-slate-300 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative left-0 md:left-0"></div>
                 <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-5 md:pl-0 md:group-even:pl-5 md:group-odd:pr-5 flex flex-col md:flex-row gap-1 md:gap-4 md:items-start">
                    <div className="text-[11px] font-bold text-slate-400 md:w-20 pt-1 shrink-0">11:00 - 12:30</div>
                    <div>
                       <h4 className="text-[13px] font-bold text-slate-800">IPA</h4>
                       <p className="text-[11px] text-slate-500 font-medium mt-0.5">Kelas 8A • Ruang 14</p>
                    </div>
                 </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-2">
                 <div className="flex items-center justify-center w-3 h-3 rounded-full border-[3px] border-white bg-slate-300 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative left-0 md:left-0"></div>
                 <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-5 md:pl-0 md:group-even:pl-5 md:group-odd:pr-5 flex flex-col md:flex-row gap-1 md:gap-4 md:items-start">
                    <div className="text-[11px] font-bold text-slate-400 md:w-20 pt-1 shrink-0">13:00 - 14:30</div>
                    <div>
                       <h4 className="text-[13px] font-bold text-slate-800">Bahasa Inggris</h4>
                       <p className="text-[11px] text-slate-500 font-medium mt-0.5">Kelas 8A • Ruang 12</p>
                    </div>
                 </div>
              </div>
           </div>
        </Card>

        {/* Pengumuman Terbaru */}
        <Card className="border-slate-100 shadow-sm p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-extrabold flex items-center gap-2"><Bell className="w-5 h-5 text-slate-700"/> Pengumuman Terbaru</h3>
              <Link href="/student/announcements" className="text-blue-600 text-[11px] font-bold flex items-center hover:text-blue-700">Lihat Semua <ChevronRight className="w-3 h-3 ml-0.5"/></Link>
           </div>
           
           <div className="space-y-5">
              <div className="flex gap-4 items-start">
                 <div className="p-2.5 bg-red-50 text-red-500 rounded-full shrink-0"><Bell className="w-4 h-4"/></div>
                 <div>
                    <h4 className="text-[13px] font-bold text-slate-800 leading-snug">Libur Nasional - Hari Raya Idul Fitri</h4>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">28 Mar 2025 • Admin Sekolah</p>
                 </div>
              </div>
              <div className="flex gap-4 items-start">
                 <div className="p-2.5 bg-blue-50 text-blue-500 rounded-full shrink-0"><FileText className="w-4 h-4"/></div>
                 <div>
                    <h4 className="text-[13px] font-bold text-slate-800 leading-snug">Jadwal Ujian Tengah Semester</h4>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">25 Mar 2025 • Wakil Kurikulum</p>
                 </div>
              </div>
              <div className="flex gap-4 items-start">
                 <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-full shrink-0"><Award className="w-4 h-4"/></div>
                 <div>
                    <h4 className="text-[13px] font-bold text-slate-800 leading-snug">Pengumpulan Tugas Proyek IPA</h4>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">22 Mar 2025 • Ibu Rini Wulandari</p>
                 </div>
              </div>
           </div>
        </Card>

        {/* Aktivitas Terbaru */}
        <Card className="border-slate-100 shadow-sm p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-extrabold flex items-center gap-2"><CheckCircle className="w-5 h-5 text-slate-700"/> Aktivitas Terbaru</h3>
              <Link href="/student/activities" className="text-blue-600 text-[11px] font-bold flex items-center hover:text-blue-700">Lihat Semua <ChevronRight className="w-3 h-3 ml-0.5"/></Link>
           </div>
           
           <div className="space-y-5">
              <div className="flex gap-4 items-start">
                 <div className="p-2.5 bg-teal-50 text-teal-600 rounded-full shrink-0"><CheckCircle className="w-4 h-4"/></div>
                 <div>
                    <h4 className="text-[13px] font-semibold text-slate-700 leading-snug">Anda menyelesaikan tugas "Latihan Soal Matematika"</h4>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">2 jam yang lalu</p>
                 </div>
              </div>
              <div className="flex gap-4 items-start">
                 <div className="p-2.5 bg-orange-50 text-orange-500 rounded-full shrink-0"><Award className="w-4 h-4"/></div>
                 <div>
                    <h4 className="text-[13px] font-semibold text-slate-700 leading-snug">Guru memberikan nilai untuk tugas "Laporan IPA"</h4>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">5 jam yang lalu</p>
                 </div>
              </div>
              <div className="flex gap-4 items-start">
                 <div className="p-2.5 bg-purple-50 text-purple-600 rounded-full shrink-0"><PlayCircle className="w-4 h-4"/></div>
                 <div>
                    <h4 className="text-[13px] font-semibold text-slate-700 leading-snug">Anda mengakses materi "Ekosistem dan Lingkungan"</h4>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">1 hari yang lalu</p>
                 </div>
              </div>
           </div>
        </Card>

      </div>
    </div>
  );
}
