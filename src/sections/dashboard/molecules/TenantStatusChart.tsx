"use client";

import { DonutChart } from "@derpdaderp/chartkit";
import type { ThemeName } from "@derpdaderp/chartkit/themes";
import type { TenantStatusSummary } from "@/modules/dashboard/domain/types/DashboardTypes";
import { formatCount } from "@/modules/dashboard/presentation/helpers/dashboardFormatters";
import Card from "@/shared-ui/component/Card";
import Skeleton from "@/shared-ui/component/Skeleton";
import Typography from "@/shared-ui/component/Typography";

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
    { label: "Aktif", value: summary.active },
    { label: "Pemeliharaan", value: summary.maintenance },
    { label: "Ditangguhkan", value: summary.suspended },
  ].filter((d) => d.value > 0);

  return (
    <Card className="border border-slate-200/70 bg-white/70 backdrop-blur-xl  ">
      <Typography variant="h2" className="text-slate-900 ">
        Distribusi Status
      </Typography>
      <Typography variant="body" className="mb-4 text-slate-500 ">
        Komposisi status seluruh tenant
      </Typography>

      <div className="flex min-h-[220px] items-center justify-center">
        {loading ? (
          <Skeleton circle width={DONUT_SIZE} height={DONUT_SIZE} />
        ) : data.length === 0 ? (
          <Typography variant="body" className="text-slate-500 ">
            Belum ada tenant terdaftar.
          </Typography>
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
                <p className="text-2xl font-bold text-slate-900 ">
                  {formatCount(summary.total)}
                </p>
                <Typography variant="body" className="text-xs text-slate-500 ">
                  Tenant
                </Typography>
              </div>
            }
          />
        )}
      </div>
    </Card>
  );
}
