// Files: src/sections/auth/molecules/LoginHelpPanel.tsx

import clsx from "clsx";

export interface LoginHelpPanelProps {
  readonly className?: string;
  readonly supportEmail?: string | null;
  readonly supportUrl?: string | null;
}

export default function LoginHelpPanel({
  className,
  supportEmail,
  supportUrl,
}: LoginHelpPanelProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3.5 rounded-2xl p-4 text-left transition-colors",
        "border border-blue-100 bg-blue-50/70",
        "dark:border-blue-900/40 dark:bg-blue-950/40",
        className,
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-sm font-bold text-blue-600 shadow-2xs dark:border-blue-800 dark:bg-slate-900 dark:text-blue-400">
        ?
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          Mengalami kendala masuk?
        </span>
        <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Hubungi administrator sekolah Anda.
        </span>
        {(supportEmail || supportUrl) && (
          <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-indigo-700">
            {supportEmail && (
              <a href={`mailto:${supportEmail}`} className="hover:underline">
                Hubungi dukungan
              </a>
            )}
            {supportUrl && (
              <a
                href={supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Bantuan
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
