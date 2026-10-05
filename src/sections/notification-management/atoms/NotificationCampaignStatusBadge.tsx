// Files: src/sections/notification-management/atoms/NotificationCampaignStatusBadge.tsx

import { NotificationDispatchStatus } from "@/modules/notification/domain/types/NotificationTypes";
import clsx from "clsx";

interface Props {
  status: NotificationDispatchStatus | string;
  isArchived?: boolean;
}

export default function NotificationCampaignStatusBadge({ status, isArchived }: Props) {
  if (isArchived) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        Diarsipkan
      </span>
    );
  }

  const config: Record<
    string,
    { label: string; bg: string; text: string; dot: string; border: string }
  > = {
    [NotificationDispatchStatus.DRAFT]: {
      label: "Draft",
      bg: "bg-slate-50",
      text: "text-slate-600",
      dot: "bg-slate-400",
      border: "border-slate-200",
    },
    [NotificationDispatchStatus.SCHEDULED]: {
      label: "Terjadwal",
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
      border: "border-amber-200",
    },
    [NotificationDispatchStatus.QUEUED]: {
      label: "Dalam Antrean",
      bg: "bg-sky-50",
      text: "text-sky-700",
      dot: "bg-sky-500",
      border: "border-sky-200",
    },
    [NotificationDispatchStatus.PROCESSING]: {
      label: "Memproses",
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      dot: "bg-indigo-500 animate-pulse",
      border: "border-indigo-200",
    },
    [NotificationDispatchStatus.COMPLETED]: {
      label: "Selesai",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      border: "border-emerald-200",
    },
    [NotificationDispatchStatus.PARTIAL_FAILED]: {
      label: "Sebagian Gagal",
      bg: "bg-orange-50",
      text: "text-orange-700",
      dot: "bg-orange-500",
      border: "border-orange-200",
    },
    [NotificationDispatchStatus.FAILED]: {
      label: "Gagal",
      bg: "bg-rose-50",
      text: "text-rose-700",
      dot: "bg-rose-500",
      border: "border-rose-200",
    },
    [NotificationDispatchStatus.CANCELLED]: {
      label: "Dibatalkan",
      bg: "bg-slate-100",
      text: "text-slate-600",
      dot: "bg-slate-400",
      border: "border-slate-300",
    },
  };

  const current = config[status] || {
    label: status,
    bg: "bg-slate-50",
    text: "text-slate-600",
    dot: "bg-slate-400",
    border: "border-slate-200",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
        current.bg,
        current.text,
        current.border,
      )}
    >
      <span className={clsx("w-1.5 h-1.5 rounded-full", current.dot)} />
      {current.label}
    </span>
  );
}
