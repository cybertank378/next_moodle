// Files: src/sections/dashboard/molecules/TenantStatusChart.tsx

"use client";

import { DonutChart, themes } from "@derpdaderp/chartkit";
import { useMemo } from "react";
import type { TenantStatusSummary } from "@/modules/dashboard/domain/types/DashboardTypes";
import { formatCount } from "@/modules/dashboard/presentation/helpers/dashboardFormatters";
import Card from "@/shared-ui/component/Card";
import Skeleton from "@/shared-ui/component/Skeleton";

// Harmonize semantic status palette in ChartKit silver theme
if (themes?.silver) {
  themes.silver.colors = [
    "#10b981", // Emerald -> Aktif
    "#f59e0b", // Amber -> Pemeliharaan
    "#ef4444", // Rose -> Ditangguhkan
    "#3b82f6",
    "#8b5cf6",
  ];
}

interface TenantStatusChartProps {
  summary: TenantStatusSummary;
  loading: boolean;
}

export default function TenantStatusChart({
  summary,
  loading,
}: TenantStatusChartProps) {
  const active = summary?.active ?? 0;
  const maintenance = summary?.maintenance ?? 0;
  const suspended = summary?.suspended ?? 0;
  const total = summary?.total ?? active + maintenance + suspended;

  const chartData = useMemo(() => {
    return [
      { status: "Aktif", count: active },
      { status: "Pemeliharaan", count: maintenance },
      { status: "Ditangguhkan", count: suspended },
    ];
  }, [active, maintenance, suspended]);

  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm p-5 rounded-2xl flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Distribusi Status</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Komposisi status seluruh tenant terdaftar.
        </p>
      </div>

      <div className="py-4 flex items-center justify-center min-h-[220px]">
        {loading ? (
          <Skeleton circle width={160} height={160} />
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <p className="text-sm font-medium">Belum ada data status tenant.</p>
          </div>
        ) : (
          <DonutChart
            data={chartData}
            dataKey="count"
            labelKey="status"
            theme="silver"
            size={170}
            innerRadius={0.65}
            showLegend={true}
            legendPosition="right"
            padAngle={3}
            cornerRadius={4}
            format={(val) => `${formatCount(val)} tenant`}
            centerContent={
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  {formatCount(total)}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  Total
                </span>
              </div>
            }
          />
        )}
      </div>
    </Card>
  );
}
