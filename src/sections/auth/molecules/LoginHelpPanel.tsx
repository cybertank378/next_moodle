// Files: src/sections/auth/molecules/LoginHelpPanel.tsx

import clsx from "clsx";
import { LifeBuoy } from "lucide-react";

export interface LoginHelpPanelProps {
  readonly className?: string;
}

export default function LoginHelpPanel({ className }: LoginHelpPanelProps) {
  return (
    <div
      className={clsx(
        "flex items-start gap-3 rounded-2xl p-4 transition-colors",
        "border border-slate-200/80 bg-slate-50/80 text-slate-800",
        "dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200",
        className,
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400">
        <LifeBuoy aria-hidden="true" size={18} />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Mengalami kendala masuk?
        </span>
        <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Hubungi administrator sekolah Anda untuk mendapatkan bantuan akun.
        </span>
      </div>
    </div>
  );
}
