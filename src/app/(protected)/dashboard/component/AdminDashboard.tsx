export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Manajemen platform SaaS, konfigurasi tenant, dan pemantauan sistem.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151521] p-6 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold text-slate-500 dark:text-gray-400">
            Total Tenants
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            0
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151521] p-6 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold text-slate-500 dark:text-gray-400">
            Active Integrations
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            0
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151521] p-6 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold text-slate-500 dark:text-gray-400">
            System Status
          </h2>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-green-400">
            Optimal
          </p>
        </div>
      </div>
    </div>
  );
}
