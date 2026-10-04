import Card from "@/shared-ui/component/Card";
import LinkButton from "@/shared-ui/component/LinkButton";
import Typography from "@/shared-ui/component/Typography";

export default function TeacherDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography
            variant="h1"
            className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent"
          >
            Teacher Workspace
          </Typography>
          <Typography
            variant="subheading"
            className="mt-1 text-slate-600 dark:text-slate-400"
          >
            Kelola soal, kelas, dan pantau kemajuan peserta didik Anda.
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 shadow-lg shadow-emerald-500/5 dark:shadow-none transition-all duration-300 hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-800/50">
          <Typography
            variant="subheading"
            className="mb-1 text-slate-500 dark:text-slate-400 relative z-10"
          >
            Kelas Aktif
          </Typography>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white relative z-10">
            5
          </p>
        </Card>

        <Card className="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 shadow-lg shadow-emerald-500/5 dark:shadow-none transition-all duration-300 hover:shadow-xl hover:border-teal-200 dark:hover:border-teal-800/50">
          <Typography
            variant="subheading"
            className="mb-1 text-slate-500 dark:text-slate-400 relative z-10"
          >
            Total Soal Dibuat
          </Typography>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white relative z-10">
            324
          </p>
        </Card>

        <Card className="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 shadow-lg shadow-emerald-500/5 dark:shadow-none transition-all duration-300 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800/50">
          <Typography
            variant="subheading"
            className="mb-1 text-slate-500 dark:text-slate-400 relative z-10"
          >
            Ujian Mendatang
          </Typography>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white relative z-10">
            2
          </p>
        </Card>
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
            View All
          </LinkButton>
        </div>
        <div className="p-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Belum ada ujian kelas yang sedang berjalan hari ini.
          </p>
        </div>
      </Card>
    </div>
  );
}
