// Files: src/sections/dashboard/molecules/TenantGrowthChart.tsx

"use client";

import { LineChart } from "@derpdaderp/chartkit";
import { useMemo } from "react";
import type { TenantGrowthPoint } from "@/modules/dashboard/domain/types/DashboardTypes";
import { formatPeriodLabel } from "@/modules/dashboard/presentation/helpers/dashboardFormatters";
import Button from "@/shared-ui/component/Button";
import Card from "@/shared-ui/component/Card";
import Skeleton from "@/shared-ui/component/Skeleton";

const CHART_HEIGHT = 220;

interface TenantGrowthChartProps {
  points: TenantGrowthPoint[];
  loading: boolean;
  selectedMonths?: number;
  onSelectMonths?: (months: number) => void;
}

export default function TenantGrowthChart({
  points,
  loading,
  selectedMonths = 6,
  onSelectMonths,
}: TenantGrowthChartProps) {
  const chartData = useMemo(() => {
    return points.map((p) => ({
      period: formatPeriodLabel(p.period),
      newTenants: p.newTenants,
      cumulativeTenants: p.cumulativeTenants,
    }));
  }, [points]);

  const totalNew = useMemo(() => {
    return points.reduce((sum, p) => sum + p.newTenants, 0);
  }, [points]);

  const handleSelectSixMonths = () => {
    onSelectMonths?.(6);
  };

  const handleSelectTwelveMonths = () => {
    onSelectMonths?.(12);
  };

  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm p-5 rounded-2xl">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Pertumbuhan Tenant
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tenant baru yang terdaftar setiap bulan.
          </p>
        </div>

        {/* 6 bulan / 12 bulan Period Pills */}
        <div
          role="radiogroup"
          aria-label="Pilihan periode grafik pertumbuhan tenant"
          className="inline-flex items-center rounded-xl bg-slate-100 p-1 self-start sm:self-auto text-xs font-semibold"
        >
          <Button
            type="button"
            role="radio"
            aria-checked={selectedMonths === 6}
            variant={selectedMonths === 6 ? "filled" : "ghost"}
            color={selectedMonths === 6 ? "primary" : "secondary"}
            size="sm"
            onClick={handleSelectSixMonths}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              selectedMonths === 6 ? "shadow-sm" : ""
            }`}
          >
            6 bulan
          </Button>
          <Button
            type="button"
            role="radio"
            aria-checked={selectedMonths === 12}
            variant={selectedMonths === 12 ? "filled" : "ghost"}
            color={selectedMonths === 12 ? "primary" : "secondary"}
            size="sm"
            onClick={handleSelectTwelveMonths}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              selectedMonths === 12 ? "shadow-sm" : ""
            }`}
          >
            12 bulan
          </Button>
        </div>
      </div>

      {/* Chart Canvas */}
      {loading ? (
        <Skeleton height={CHART_HEIGHT} />
      ) : chartData.length === 0 || totalNew === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500"
          style={{ height: CHART_HEIGHT }}
        >
          <p className="text-sm font-medium">
            Belum ada data pertumbuhan untuk periode ini.
          </p>
        </div>
      ) : (
        <div className="w-full" style={{ height: CHART_HEIGHT }}>
          <LineChart
            data={chartData}
            timeKey="period"
            series={[
              {
                key: "newTenants",
                label: "Tenant Baru",
                area: true,
                areaOpacity: 0.18,
                color: "#2563eb",
                strokeWidth: 2.5,
              },
            ]}
            theme="silver"
            curve="monotone"
            showDots={true}
            dotSize={4}
            height={CHART_HEIGHT}
            responsive={true}
            unit="tenant"
            showLegend={false}
          />
        </div>
      )}
    </Card>
  );
}
