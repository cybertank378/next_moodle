// Files: src/sections/dashboard/molecules/TenantGrowthChart.tsx

"use client";

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
      label: formatPeriodLabel(p.period),
      value: p.newTenants,
    }));
  }, [points]);

  const maxVal = useMemo(() => {
    const rawMax = Math.max(...chartData.map((d) => d.value), 5);
    return Math.ceil(rawMax / 2) * 2; // round up to nearest even number
  }, [chartData]);

  const yTicks = useMemo(() => {
    const count = 5;
    const step = maxVal / count;
    return Array.from({ length: count + 1 }, (_, i) => Math.round(i * step));
  }, [maxVal]);

  const totalNew = points.reduce((sum, p) => sum + p.newTenants, 0);

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
          <h2 className="text-lg font-bold text-slate-900">Pertumbuhan Tenant</h2>
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
        <div className="relative w-full" style={{ height: CHART_HEIGHT }}>
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 500 200"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {yTicks.map((tick, i) => {
              const y = 170 - (tick / maxVal) * 140;
              return (
                <g key={`ytick-${tick}-${i}`}>
                  <line
                    x1="30"
                    y1={y}
                    x2="495"
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                  <text
                    x="20"
                    y={y + 3}
                    textAnchor="end"
                    className="fill-slate-400 text-[10px] font-medium"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Area Path */}
            {(() => {
              const count = chartData.length;
              const stepX = (490 - 45) / Math.max(count - 1, 1);
              const coords = chartData.map((d, index) => {
                const x = 45 + index * stepX;
                const y = 170 - (d.value / maxVal) * 140;
                return { x, y, value: d.value, label: d.label };
              });

              const linePoints = coords
                .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
                .join(" ");

              const areaPoints = `${linePoints} L ${coords[coords.length - 1].x} 170 L ${coords[0].x} 170 Z`;

              return (
                <>
                  {/* Shaded Area */}
                  <path d={areaPoints} fill="url(#areaGradient)" />

                  {/* Connecting Line */}
                  <path
                    d={linePoints}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Points & Value Badges */}
                  {coords.map((c, i) => (
                    <g key={`pt-${i}`}>
                      {/* Outer Dot */}
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r="4.5"
                        fill="#2563eb"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-transform hover:scale-125"
                      />
                      {/* Data Value above dot */}
                      <text
                        x={c.x}
                        y={c.y - 8}
                        textAnchor="middle"
                        className="fill-blue-600 font-bold text-[10px]"
                      >
                        {c.value}
                      </text>
                      {/* X-axis Label below axis */}
                      <text
                        x={c.x}
                        y="190"
                        textAnchor="middle"
                        className="fill-slate-500 font-medium text-[10px]"
                      >
                        {c.label}
                      </text>
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>
      )}
    </Card>
  );
}
