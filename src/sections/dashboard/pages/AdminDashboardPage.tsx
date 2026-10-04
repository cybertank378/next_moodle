import AdminDashboardOverview from "@/sections/dashboard/organisms/AdminDashboardOverview";
import LinkButton from "@/shared-ui/component/LinkButton";
import Typography from "@/shared-ui/component/Typography";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography
            variant="h1"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400"
          >
            Platform Overview
          </Typography>
          <Typography
            variant="subheading"
            className="mt-1 text-slate-600 dark:text-slate-400"
          >
            Manajemen platform SaaS, konfigurasi tenant, dan pemantauan sistem.
          </Typography>
        </div>
        <LinkButton href="/dashboard/tenants/create" variant="primary">
          + Register New Tenant
        </LinkButton>
      </header>

      <AdminDashboardOverview />
    </div>
  );
}
