// Files: src/sections/auth/molecules/LoginHelpPanel.tsx

import clsx from "clsx";

export interface LoginHelpPanelProps {
  readonly className?: string;
}

export default function LoginHelpPanel({ className }: LoginHelpPanelProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3.5 rounded-2xl p-4 transition-colors text-left",
        "border border-blue-100 bg-blue-50/70",
        "dark:border-blue-900/40 dark:bg-blue-950/40",
        className,
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white border border-blue-200 text-blue-600 font-bold text-sm shadow-2xs dark:bg-slate-900 dark:border-blue-800 dark:text-blue-400">
        ?
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          Mengalami kendala masuk?
        </span>
        <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Hubungi administrator sekolah Anda.
        </span>
      </div>
    </div>
  );
}
