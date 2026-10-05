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
import Typography from "@/shared-ui/component/Typography";

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
    <Card className="border border-slate-200/70 bg-white/70 backdrop-blur-xl  ">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <Typography variant="h2" className="text-slate-900 ">
            Pertumbuhan Tenant
          </Typography>
          <Typography variant="body" className="text-slate-500 ">
            Tenant baru per bulan ({points.length} bulan terakhir)
          </Typography>
        </div>
        {!loading && (
          <Typography variant="body" className="text-slate-500 ">
            <span className="font-semibold text-indigo-600 ">
              +{formatCount(totalNew)}
            </span>{" "}
            · total {formatCount(latestTotal)}
          </Typography>
        )}
      </div>

      {loading ? (
        <Skeleton height={CHART_HEIGHT} />
      ) : totalNew === 0 ? (
        <div
          className="flex items-center justify-center rounded-xl border border-dashed border-slate-300 "
          style={{ height: CHART_HEIGHT }}
        >
          <Typography variant="body" className="text-slate-500 ">
            Belum ada tenant baru pada periode ini.
          </Typography>
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
