"use client";

import type { ThemeName } from "@derpdaderp/chartkit/themes";
import { useEffect, useState } from "react";
import { ADMIN_DASHBOARD_DEFAULT_MONTHS } from "@/modules/dashboard/domain/types/DashboardTypes";
import { formatCount } from "@/modules/dashboard/presentation/helpers/dashboardFormatters";
import { useDashboardApi } from "@/modules/dashboard/presentation/hooks/useDashboardApi";
import Button from "@/shared-ui/component/Button";
import DashboardHeader from "@/sections/dashboard/molecules/DashboardHeader";
import RecentTenantsTable from "@/sections/dashboard/molecules/RecentTenantsTable";
import StatCard from "@/sections/dashboard/molecules/StatCard";
import TenantGrowthChart from "@/sections/dashboard/molecules/TenantGrowthChart";
import TenantStatusChart from "@/sections/dashboard/molecules/TenantStatusChart";

const EMPTY_SUMMARY = { total: 0, active: 0, maintenance: 0, suspended: 0 };


export default function AdminDashboardOverview() {
  const { adminState, fetchAdminOverview } = useDashboardApi();

  useEffect(() => {
    void fetchAdminOverview(ADMIN_DASHBOARD_DEFAULT_MONTHS);
  }, [fetchAdminOverview]);

  const { data, loading, error } = adminState;
  const summary = data?.summary ?? EMPTY_SUMMARY;
  const unavailable = !data && !!error;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader
        title="Ikhtisar Platform"
        subtitle="Manajemen platform SaaS, konfigurasi tenant, dan pemantauan sistem."
        titleClassName="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent  "
        action={
          <Button color="primary" variant="filled" leftIcon={undefined}>
            + Daftarkan Tenant Baru
          </Button>
        }
      />

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700   "
        >
          <span>{error}</span>
          <Button
            size="sm"
            variant="outline"
            color="error"
            onClick={() => void fetchAdminOverview(ADMIN_DASHBOARD_DEFAULT_MONTHS)}
            className="border-rose-300  text-rose-700 "
          >
            Coba lagi
          </Button>
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
          label="Pemeliharaan"
          value={formatCount(summary.maintenance)}
          hint="Sedang dalam pemeliharaan"
          accent="amber"
          loading={loading && !data}
          unavailable={unavailable}
        />
        <StatCard
          label="Ditangguhkan"
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
            theme="pearl"
          />
        </div>
        <TenantStatusChart
          summary={summary}
          loading={loading && !data}
          theme="pearl"
        />
      </div>

      <RecentTenantsTable
        tenants={data?.recentTenants ?? []}
        loading={loading && !data}
      />
    </div>
  );
}
