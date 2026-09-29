export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Portal Peserta Ujian
        </h1>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Daftar mata pelajaran dan ujian yang tersedia untuk Anda.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151521] p-8 text-center shadow-sm">
        <p className="mb-2 text-base text-slate-700 dark:text-gray-300">
          Belum ada ujian aktif yang dijadwalkan saat ini.
        </p>
        <p className="text-xs text-slate-500 dark:text-gray-500">
          Silakan hubungi pengawas atau guru jika ujian seharusnya sudah
          dimulai.
        </p>
      </div>
    </div>
  );
}
