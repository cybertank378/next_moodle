"use client";

import type { ThemeName } from "@derpdaderp/chartkit/themes";
import { useEffect, useState } from "react";
import { ADMIN_DASHBOARD_DEFAULT_MONTHS } from "@/modules/dashboard/domain/types/DashboardTypes";
import { formatCount } from "@/modules/dashboard/presentation/helpers/dashboardFormatters";
import { useDashboardApi } from "@/modules/dashboard/presentation/hooks/useDashboardApi";
import RecentTenantsTable from "@/sections/dashboard/molecules/RecentTenantsTable";
import StatCard from "@/sections/dashboard/molecules/StatCard";
import TenantGrowthChart from "@/sections/dashboard/molecules/TenantGrowthChart";
import TenantStatusChart from "@/sections/dashboard/molecules/TenantStatusChart";

const CHART_THEME_LIGHT: ThemeName = "pearl";
const CHART_THEME_DARK: ThemeName = "midnight";

const EMPTY_SUMMARY = { total: 0, active: 0, maintenance: 0, suspended: 0 };

/** Tracks the `dark` class toggled on <html> by ThemeSwitch. */
function useChartTheme(): ThemeName {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsDark(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark ? CHART_THEME_DARK : CHART_THEME_LIGHT;
}

export default function AdminDashboardOverview() {
  const { adminState, fetchAdminOverview } = useDashboardApi();
  const chartTheme = useChartTheme();

  useEffect(() => {
    void fetchAdminOverview(ADMIN_DASHBOARD_DEFAULT_MONTHS);
  }, [fetchAdminOverview]);

  const { data, loading, error } = adminState;
  const summary = data?.summary ?? EMPTY_SUMMARY;
  const unavailable = !data && !!error;

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
        >
          <span>{error}</span>
          <button
            type="button"
            id="admin-dashboard-retry"
            onClick={() => void fetchAdminOverview(ADMIN_DASHBOARD_DEFAULT_MONTHS)}
            className="font-semibold underline-offset-2 hover:underline"
          >
            Coba lagi
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Tenant"
          value={formatCount(summary.total)}
          hint="Seluruh tenant terdaftar"
          accent="indigo"
          loading={loading && !data}
          unavailable={unavailable}
        />
        <StatCard
          label="Aktif"
          value={formatCount(summary.active)}
          hint="Tenant beroperasi normal"
          accent="emerald"
          loading={loading && !data}
          unavailable={unavailable}
        />
        <StatCard
          label="Maintenance"
          value={formatCount(summary.maintenance)}
          hint="Sedang dalam pemeliharaan"
          accent="amber"
          loading={loading && !data}
          unavailable={unavailable}
        />
        <StatCard
          label="Suspended"
          value={formatCount(summary.suspended)}
          hint={summary.suspended > 0 ? "Perlu ditinjau" : "Tidak ada tindakan"}
          accent="rose"
          loading={loading && !data}
          unavailable={unavailable}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TenantGrowthChart
            points={data?.growth ?? []}
            loading={loading && !data}
            theme={chartTheme}
          />
        </div>
        <TenantStatusChart
          summary={summary}
          loading={loading && !data}
          theme={chartTheme}
        />
      </div>

      <RecentTenantsTable
        tenants={data?.recentTenants ?? []}
        loading={loading && !data}
      />
    </div>
  );
}
