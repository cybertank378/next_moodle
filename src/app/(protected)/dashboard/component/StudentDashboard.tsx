export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Portal Peserta Ujian</h1>
        <p className="text-sm text-gray-400">
          Daftar mata pelajaran dan ujian yang tersedia untuk Anda.
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#151521] p-8 text-center">
        <p className="mb-2 text-base text-gray-300">
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
