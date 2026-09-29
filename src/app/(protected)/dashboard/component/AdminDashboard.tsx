import Card from "@/shared-ui/component/Card";
import Typography from "@/shared-ui/component/Typography";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h1">Admin Dashboard</Typography>
        <Typography variant="subheading" className="mt-1">
          Manajemen platform SaaS, konfigurasi tenant, dan pemantauan sistem.
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <Typography variant="subheading" className="mb-1">
            Total Tenants
          </Typography>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            0
          </p>
        </Card>

        <Card>
          <Typography variant="subheading" className="mb-1">
            Active Integrations
          </Typography>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            0
          </p>
        </Card>

        <Card>
          <Typography variant="subheading" className="mb-1">
            System Status
          </Typography>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-green-400">
            Optimal
          </p>
        </Card>
      </div>
    </div>
  );
}
