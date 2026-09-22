export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Portal Peserta Ujian</h1>
        <p className="text-sm text-gray-400">
          Daftar mata pelajaran dan ujian yang tersedia untuk Anda.
        </p>
      </div>
      <div className="p-8 rounded-xl bg-[#151521] border border-slate-800 text-center">
        <p className="text-base text-gray-300 mb-2">
          Belum ada ujian aktif yang dijadwalkan saat ini.
        </p>
        <p className="text-xs text-gray-500">
          Silakan hubungi pengawas atau guru jika ujian seharusnya sudah
          dimulai.
        </p>
      </div>
    </div>
  );
}
