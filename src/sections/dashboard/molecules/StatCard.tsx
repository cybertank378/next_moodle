import type { ReactNode } from "react";
import StatValue from "@/sections/dashboard/atoms/StatValue";
import {
  type StatAccent,
  StatAccentDot,
  StatAccentGlow,
} from "@/sections/dashboard/atoms/StatAccent";
import Card from "@/shared-ui/component/Card";
import Typography from "@/shared-ui/component/Typography";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint: string;
  accent: StatAccent;
  loading: boolean;
  unavailable: boolean;
}

export default function StatCard({
  label,
  value,
  hint,
  accent,
  loading,
  unavailable,
}: StatCardProps) {
  return (
    <Card className="group relative overflow-hidden border border-slate-200/70 bg-white/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl  ">
      <StatAccentGlow accent={accent} />
      <div className="relative z-10 space-y-2">
        <Typography variant="body" className="flex items-center gap-2 text-sm font-medium text-slate-500 ">
          <StatAccentDot accent={accent} />
          {label}
        </Typography>
        <div className="text-3xl font-extrabold tracking-tight text-slate-900 ">
          <StatValue loading={loading} unavailable={unavailable}>
            {value}
          </StatValue>
        </div>
        <Typography variant="body" className="text-xs text-slate-500 ">{hint}</Typography>
      </div>
    </Card>
  );
}
