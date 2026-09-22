export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-sm text-gray-400">
          Manajemen platform SaaS, konfigurasi tenant, dan pemantauan sistem.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-[#151521] border border-slate-800">
          <h2 className="text-sm font-semibold text-gray-400 mb-1">
            Total Tenants
          </h2>
          <p className="text-3xl font-extrabold text-white">0</p>
        </div>
        <div className="p-6 rounded-xl bg-[#151521] border border-slate-800">
          <h2 className="text-sm font-semibold text-gray-400 mb-1">
            Active Integrations
          </h2>
          <p className="text-3xl font-extrabold text-white">0</p>
        </div>
        <div className="p-6 rounded-xl bg-[#151521] border border-slate-800">
          <h2 className="text-sm font-semibold text-gray-400 mb-1">
            System Status
          </h2>
          <p className="text-3xl font-extrabold text-green-400">Optimal</p>
        </div>
      </div>
    </div>
  );
}
