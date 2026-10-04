"use client";

import { DonutChart } from "@derpdaderp/chartkit";
import type { ThemeName } from "@derpdaderp/chartkit/themes";
import type { TenantStatusSummary } from "@/modules/dashboard/domain/types/DashboardTypes";
import { formatCount } from "@/modules/dashboard/presentation/helpers/dashboardFormatters";
import Card from "@/shared-ui/component/Card";
import Skeleton from "@/shared-ui/component/Skeleton";

const DONUT_SIZE = 200;

interface TenantStatusChartProps {
  summary: TenantStatusSummary;
  loading: boolean;
  theme: ThemeName;
}

export default function TenantStatusChart({
  summary,
  loading,
  theme,
}: TenantStatusChartProps) {
  const data = [
    { label: "Active", value: summary.active },
    { label: "Maintenance", value: summary.maintenance },
    { label: "Suspended", value: summary.suspended },
  ].filter((d) => d.value > 0);

  return (
    <Card className="border border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/60">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        Distribusi Status
      </h2>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Komposisi status seluruh tenant
      </p>

      <div className="flex min-h-[220px] items-center justify-center">
        {loading ? (
          <Skeleton circle width={DONUT_SIZE} height={DONUT_SIZE} />
        ) : data.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Belum ada tenant terdaftar.
          </p>
        ) : (
          <DonutChart
            data={data}
            dataKey="value"
            labelKey="label"
            size={DONUT_SIZE}
            theme={theme}
            innerRadius={0.65}
            showLegend
            legendPosition="bottom"
            format={formatCount}
            centerContent={
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCount(summary.total)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tenant
                </p>
              </div>
            }
          />
        )}
      </div>
    </Card>
  );
}
