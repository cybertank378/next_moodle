// Files: src/sections/dashboard/molecules/StatCard.tsx

import type { ElementType, ReactNode } from "react";
import StatValue from "@/sections/dashboard/atoms/StatValue";
import {
  type StatAccent,
  StatAccentDot,
  StatAccentGlow,
} from "@/sections/dashboard/atoms/StatAccent";
import Card from "@/shared-ui/component/Card";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint: string;
  accent: StatAccent;
  loading: boolean;
  unavailable: boolean;
  icon?: ElementType;
}

const ICON_STYLES: Record<StatAccent, string> = {
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  rose: "bg-rose-50 text-rose-600 border-rose-100",
  cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
  teal: "bg-teal-50 text-teal-600 border-teal-100",
};

export default function StatCard({
  label,
  value,
  hint,
  accent,
  loading,
  unavailable,
  icon: Icon,
}: StatCardProps) {
  const iconClass = ICON_STYLES[accent] ?? ICON_STYLES.blue;

  return (
    <Card className="group relative overflow-hidden border border-slate-200/80 bg-white p-5 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <StatAccentGlow accent={accent} />
      <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
        {Icon ? (
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${iconClass} shadow-sm`}
            >
              <Icon size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">{label}</p>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-0.5">
                <StatValue loading={loading} unavailable={unavailable}>
                  {value}
                </StatValue>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <StatAccentDot accent={accent} />
              {label}
            </p>
            <div className="text-3xl font-black tracking-tight text-slate-900 mt-1">
              <StatValue loading={loading} unavailable={unavailable}>
                {value}
              </StatValue>
            </div>
          </div>
        )}
        <p className="text-xs text-slate-400 font-medium">{hint}</p>
      </div>
    </Card>
  );
}
