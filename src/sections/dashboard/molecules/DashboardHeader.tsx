import type { ReactNode } from "react";
import Typography from "@/shared-ui/component/Typography";

export interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  titleClassName?: string;
  action?: ReactNode;
  borderBottom?: boolean;
}

export default function DashboardHeader({
  title,
  subtitle,
  titleClassName = "text-slate-900 dark:text-white",
  action,
  borderBottom = true,
}: DashboardHeaderProps) {
  return (
    <header
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${borderBottom ? "border-b border-slate-200/60 dark:border-slate-800 pb-4" : ""}`}
    >
      <div>
        <Typography variant="h1" className={titleClassName}>
          {title}
        </Typography>
        <Typography variant="subheading" className="mt-1 text-slate-600 dark:text-slate-400">
          {subtitle}
        </Typography>
      </div>
      {action && <div>{action}</div>}
    </header>
  );
}
