import { CheckCircle2, Clock, RefreshCw, WifiOff } from "lucide-react";
import type { AttemptSyncState } from "@/modules/quiz/presentation/helpers/AutosaveQueueManager";
import Badge from "@/shared-ui/component/Badge";

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
        <div data-testid="status-saving" className={className}>
          <Badge variant="soft" color="info" className="gap-1.5 py-1">
            <RefreshCw size={13} className="animate-spin text-sky-600" />
            <span>Menyimpan...</span>
          </Badge>
        </div>
      );

    case "saved":
      return (
        <div data-testid="status-saved" className={className}>
          <Badge variant="soft" color="success" className="gap-1.5 py-1">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Tersimpan</span>
          </Badge>
        </div>
      );

    case "offline":
      return (
        <div data-testid="status-offline" className={className}>
          <Badge variant="soft" color="warning" className="gap-1.5 py-1">
            <WifiOff size={13} className="text-amber-600" />
            <span>Offline (Antrean Aktif)</span>
          </Badge>
        </div>
      );

    case "submitting":
      return (
        <div data-testid="status-submitting" className={className}>
          <Badge variant="soft" color="primary" className="gap-1.5 py-1">
            <RefreshCw size={13} className="animate-spin text-sky-600" />
            <span>Mengirim Ujian...</span>
          </Badge>
        </div>
      );

    default:
      return (
        <div data-testid="status-ready" className={className}>
          <Badge variant="soft" color="secondary" className="gap-1.5 py-1">
            <Clock size={13} className="text-gray-500" />
            <span>Siap</span>
          </Badge>
        </div>
      );
  }
}
