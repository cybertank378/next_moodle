import type { ReactNode } from "react";

export interface GradeScoreCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  icon?: ReactNode;
  variant?: "primary" | "success" | "warning" | "info";
  className?: string;
}

export default function GradeScoreCard({
  label,
  value,
  subLabel,
  icon,
  variant = "primary",
  className = "",
}: GradeScoreCardProps) {
  const variantStyles = {
    primary: "border-sky-500/20 bg-sky-500/5 text-sky-400",
    success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    warning: "border-amber-500/20 bg-amber-500/5 text-amber-400",
    info: "border-purple-500/20 bg-purple-500/5 text-purple-400",
  }[variant];

  return (
    <div
      data-testid="grade-score-card"
      className={`rounded-2xl border p-4 shadow-sm backdrop-blur-sm transition-all ${variantStyles} ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 ">
          {label}
        </p>
        {icon && (
          <div className="text-slate-500 ">{icon}</div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 ">
          {value}
        </span>
        {subLabel && (
          <span className="text-xs text-slate-500 ">
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
}
