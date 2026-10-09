// Files: src/sections/dashboard/molecules/TenantStatusChart.tsx

"use client";

import type { TenantStatusSummary } from "@/modules/dashboard/domain/types/DashboardTypes";
import { formatCount } from "@/modules/dashboard/presentation/helpers/dashboardFormatters";
import Card from "@/shared-ui/component/Card";
import Skeleton from "@/shared-ui/component/Skeleton";

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

  // Donut SVG circumference math
  const radius = 60;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  const activeRatio = total > 0 ? active / total : 0;
  const maintenanceRatio = total > 0 ? maintenance / total : 0;
  const suspendedRatio = total > 0 ? suspended / total : 0;

  const activeDash = activeRatio * circumference;
  const maintenanceDash = maintenanceRatio * circumference;
  const suspendedDash = suspendedRatio * circumference;

  // Offsets
  const activeOffset = 0;
  const maintenanceOffset = -activeDash;
  const suspendedOffset = -(activeDash + maintenanceDash);

  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm p-5 rounded-2xl flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Distribusi Status</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Komposisi status seluruh tenant terdaftar.
        </p>
      </div>

      <div className="py-6 flex flex-col sm:flex-row items-center justify-around gap-6">
        {loading ? (
          <Skeleton circle width={160} height={160} />
        ) : (
          /* Donut Chart with Center Text */
          <div className="relative flex items-center justify-center shrink-0">
            <svg
              width="160"
              height="160"
              viewBox="0 0 160 160"
              className="-rotate-90 transform"
            >
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
                fill="none"
              />

              {total > 0 && (
                <>
                  {/* Active Segment (Green) */}
                  {active > 0 && (
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="#10b981"
                      strokeWidth={strokeWidth}
                      fill="none"
                      strokeDasharray={`${activeDash} ${circumference}`}
                      strokeDashoffset={activeOffset}
                      strokeLinecap="round"
                    />
                  )}

                  {/* Maintenance Segment (Amber) */}
                  {maintenance > 0 && (
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="#f59e0b"
                      strokeWidth={strokeWidth}
                      fill="none"
                      strokeDasharray={`${maintenanceDash} ${circumference}`}
                      strokeDashoffset={maintenanceOffset}
                      strokeLinecap="round"
                    />
                  )}

                  {/* Suspended Segment (Rose) */}
                  {suspended > 0 && (
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="#ef4444"
                      strokeWidth={strokeWidth}
                      fill="none"
                      strokeDasharray={`${suspendedDash} ${circumference}`}
                      strokeDashoffset={suspendedOffset}
                      strokeLinecap="round"
                    />
                  )}
                </>
              )}
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {formatCount(total)}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Total tenant
              </span>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-col gap-3 min-w-[130px]">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-2 text-slate-600 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
              Aktif
            </span>
            <span className="font-bold text-slate-900">{formatCount(active)}</span>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-2 text-slate-600 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
              Pemeliharaan
            </span>
            <span className="font-bold text-slate-900">
              {formatCount(maintenance)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-2 text-slate-600 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0" />
              Ditangguhkan
            </span>
            <span className="font-bold text-slate-900">
              {formatCount(suspended)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
