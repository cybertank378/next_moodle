import { CheckCircle2, MinusCircle, XCircle } from "lucide-react";

export interface GradeStatusBadgeProps {
  isPassed: boolean | null;
  className?: string;
}

export default function GradeStatusBadge({
  isPassed,
  className = "",
}: GradeStatusBadgeProps) {
  if (isPassed === true) {
    return (
      <div
        data-testid="status-passed"
        className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ${className}`}
      >
        <CheckCircle2 size={13} className="text-emerald-400" />
        <span>Lulus</span>
      </div>
    );
  }

  if (isPassed === false) {
    return (
      <div
        data-testid="status-failed"
        className={`inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-400 ${className}`}
      >
        <XCircle size={13} className="text-rose-400" />
        <span>Tidak Lulus</span>
      </div>
    );
  }

  return (
    <div
      data-testid="status-unassessed"
      className={`inline-flex items-center gap-1.5 rounded-full border border-gray-600/30 bg-gray-700/30 px-2.5 py-0.5 text-xs font-medium text-gray-400 ${className}`}
    >
      <MinusCircle size={13} className="text-gray-400" />
      <span>Belum Dinilai</span>
    </div>
  );
}
