// Files: src/sections/dashboard/organisms/AdminDashboardOverview.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Ban,
  CheckCircle2,
  Home,
  Plus,
  RotateCw,
  Settings,
  Users,
} from "lucide-react";
import { ADMIN_DASHBOARD_DEFAULT_MONTHS } from "@/modules/dashboard/domain/types/DashboardTypes";
import { formatCount } from "@/modules/dashboard/presentation/helpers/dashboardFormatters";
import { useDashboardApi } from "@/modules/dashboard/presentation/hooks/useDashboardApi";
import Button from "@/shared-ui/component/Button";
import AdminTenantAttentionBanner from "@/sections/dashboard/molecules/AdminTenantAttentionBanner";
import RecentTenantsTable from "@/sections/dashboard/molecules/RecentTenantsTable";
import StatCard from "@/sections/dashboard/molecules/StatCard";
import TenantGrowthChart from "@/sections/dashboard/molecules/TenantGrowthChart";
import TenantStatusChart from "@/sections/dashboard/molecules/TenantStatusChart";
import { ROUTES } from "@/libs/routes";

const EMPTY_SUMMARY = { total: 0, active: 0, maintenance: 0, suspended: 0 };

export default function AdminDashboardOverview() {
  const { adminState, fetchAdminOverview } = useDashboardApi();
  const [selectedMonths, setSelectedMonths] = useState<number>(
    ADMIN_DASHBOARD_DEFAULT_MONTHS,
  );

  useEffect(() => {
    void fetchAdminOverview(selectedMonths);
  }, [fetchAdminOverview, selectedMonths]);

  const { data, loading, error } = adminState;
  const summary = data?.summary ?? EMPTY_SUMMARY;
  const unavailable = !data && !!error;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"
      >
        <Home size={14} className="text-slate-400" />
        <span>Admin</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-bold">Dashboard</span>
      </nav>

      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
            DASHBOARD ADMIN
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
            Ikhtisar Platform
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola tenant dan pantau pertumbuhan platform Anda.
          </p>
        </div>

        {/* Top Actions: Refresh & Daftarkan Tenant */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            aria-label="Muat ulang data platform"
            onClick={() => void fetchAdminOverview(selectedMonths)}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all disabled:opacity-60"
          >
            <RotateCw
              size={17}
              className={loading ? "animate-spin text-blue-600" : ""}
            />
          </button>

          <Link
            href={`${ROUTES.ADMIN.TENANTS}?action=create`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-all"
          >
            <Plus size={16} />
            <span>Daftarkan Tenant</span>
          </Link>
        </div>
      </div>

      {/* Error Alert Bar with Retry */}
      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm"
        >
          <span>{error}</span>
          <Button
            size="sm"
            variant="outline"
            color="error"
            onClick={() => void fetchAdminOverview(selectedMonths)}
            className="border-rose-300 text-rose-700"
          >
            Coba lagi
          </Button>
        </div>
      )}

      {/* Attention Banner (if maintenance or suspended > 0) */}
      <AdminTenantAttentionBanner summary={summary} />

      {/* 4 Top KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Tenant"
          value={formatCount(summary.total)}
          hint="Seluruh tenant yang terdaftar di platform."
          accent="blue"
          icon={Users}
          loading={loading && !data}
          unavailable={unavailable}
        />
        <StatCard
          label="Tenant Aktif"
          value={formatCount(summary.active)}
          hint="Tenant yang aktif digunakan oleh pengguna."
          accent="emerald"
          icon={CheckCircle2}
          loading={loading && !data}
          unavailable={unavailable}
        />
        <StatCard
          label="Pemeliharaan"
          value={formatCount(summary.maintenance)}
          hint="Tenant dalam mode pemeliharaan."
          accent="amber"
          icon={Settings}
          loading={loading && !data}
          unavailable={unavailable}
        />
        <StatCard
          label="Ditangguhkan"
          value={formatCount(summary.suspended)}
          hint="Tenant yang ditangguhkan sementara."
          accent="rose"
          icon={Ban}
          loading={loading && !data}
          unavailable={unavailable}
        />
      </div>

      {/* Middle Charts Grid (2 columns: 2/3 and 1/3) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TenantGrowthChart
            points={data?.growth ?? []}
            loading={loading && !data}
            selectedMonths={selectedMonths}
            onSelectMonths={(m) => {
              setSelectedMonths(m);
              void fetchAdminOverview(m);
            }}
          />
        </div>
        <div>
          <TenantStatusChart summary={summary} loading={loading && !data} />
        </div>
      </div>

      {/* Bottom Table: Tenant Terbaru */}
      <RecentTenantsTable
        tenants={data?.recentTenants ?? []}
        loading={loading && !data}
      />
    </div>
  );
}
