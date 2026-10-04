"use client";

import { BarChart, ResponsiveChart } from "@derpdaderp/chartkit";
import type { ThemeName } from "@derpdaderp/chartkit/themes";
import type { TenantGrowthPoint } from "@/modules/dashboard/domain/types/DashboardTypes";
import {
  formatCount,
  formatPeriodLabel,
} from "@/modules/dashboard/presentation/helpers/dashboardFormatters";
import Card from "@/shared-ui/component/Card";
import Skeleton from "@/shared-ui/component/Skeleton";

const CHART_HEIGHT = 260;

interface TenantGrowthChartProps {
  points: TenantGrowthPoint[];
  loading: boolean;
  theme: ThemeName;
}

export default function TenantGrowthChart({
  points,
  loading,
  theme,
}: TenantGrowthChartProps) {
  const data = points.map((p) => ({
    label: formatPeriodLabel(p.period),
    newTenants: p.newTenants,
  }));
  const totalNew = points.reduce((sum, p) => sum + p.newTenants, 0);
  const latestTotal = points.at(-1)?.cumulativeTenants ?? 0;

  return (
    <Card className="border border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/60">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Pertumbuhan Tenant
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tenant baru per bulan ({points.length} bulan terakhir)
          </p>
        </div>
        {!loading && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              +{formatCount(totalNew)}
            </span>{" "}
            · total {formatCount(latestTotal)}
          </p>
        )}
      </div>

      {loading ? (
        <Skeleton height={CHART_HEIGHT} />
      ) : totalNew === 0 ? (
        <div
          className="flex items-center justify-center rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
          style={{ height: CHART_HEIGHT }}
        >
          Belum ada tenant baru pada periode ini.
        </div>
      ) : (
        <ResponsiveChart height={CHART_HEIGHT}>
          {({ width }) => (
            <BarChart
              data={data}
              dataKey="newTenants"
              categoryKey="label"
              width={width}
              height={CHART_HEIGHT}
              theme={theme}
              barRadius={6}
              showLabels
              format={formatCount}
            />
          )}
        </ResponsiveChart>
      )}
    </Card>
  );
}
