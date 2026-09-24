export default function TenantDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Instansi</h1>
        <p className="text-sm text-gray-400">
          Kelola ujian, peserta, bank soal, dan pemantauan sesi ujian Moodle.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-[#151521] p-6">
          <h2 className="mb-1 text-sm font-semibold text-gray-400">
            Ujian Aktif
          </h2>
          <p className="text-3xl font-extrabold text-white">0</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#151521] p-6">
          <h2 className="mb-1 text-sm font-semibold text-gray-400">
            Peserta Terdaftar
          </h2>
          <p className="text-3xl font-extrabold text-white">0</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#151521] p-6">
          <h2 className="mb-1 text-sm font-semibold text-gray-400">
            Status Moodle
          </h2>
          <p className="text-3xl font-extrabold text-green-400">
            Belum diverifikasi
          </p>
        </div>
      </div>
    </div>
  );
}
