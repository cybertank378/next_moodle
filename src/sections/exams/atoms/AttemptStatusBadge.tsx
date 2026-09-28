import { CheckCircle2, Clock, RefreshCw, WifiOff } from "lucide-react";
import type { AttemptSyncState } from "@/modules/quiz-attempts/presentation/helpers/AutosaveQueueManager";

export interface AttemptStatusBadgeProps {
  status: AttemptSyncState;
  className?: string;
}

export default function AttemptStatusBadge({
  status,
  className = "",
}: AttemptStatusBadgeProps) {
  switch (status) {
    case "saving":
      return (
        <div
          data-testid="status-saving"
          className={`inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-400 ${className}`}
        >
          <RefreshCw size={13} className="animate-spin text-sky-400" />
          <span>Menyimpan...</span>
        </div>
      );

    case "saved":
      return (
        <div
          data-testid="status-saved"
          className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ${className}`}
        >
          <CheckCircle2 size={13} className="text-emerald-400" />
          <span>Tersimpan</span>
        </div>
      );

    case "offline":
      return (
        <div
          data-testid="status-offline"
          className={`inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 ${className}`}
        >
          <WifiOff size={13} className="text-amber-400" />
          <span>Offline (Antrean Aktif)</span>
        </div>
      );

    case "submitting":
      return (
        <div
          data-testid="status-submitting"
          className={`inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400 ${className}`}
        >
          <RefreshCw size={13} className="animate-spin text-purple-400" />
          <span>Mengirim Ujian...</span>
        </div>
      );

    default:
      return (
        <div
          data-testid="status-ready"
          className={`inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300 ${className}`}
        >
          <Clock size={13} className="text-slate-400" />
          <span>Siap</span>
        </div>
      );
  }
}
