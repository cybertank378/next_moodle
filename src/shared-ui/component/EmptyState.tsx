// Files: src/shared-ui/component/EmptyState.tsx

import clsx from "clsx";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  title = "Tidak ada data",
  description = "Belum ada item yang tersedia saat ini.",
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-slate-200",
        className,
      )}
    >
      <div className="p-3 bg-slate-50 text-slate-400 rounded-full mb-3">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-slate-500 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
