// Files: src/sections/notification-management/atoms/NotificationCampaignStatusBadge.tsx

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  XCircle,
} from "lucide-react";
import { NotificationDispatchStatus } from "@/modules/notification/domain/types/NotificationTypes";

interface Props {
  status: NotificationDispatchStatus | string;
  isArchived?: boolean;
}

export default function NotificationCampaignStatusBadge({
  status,
  isArchived,
}: Props) {
  if (isArchived) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        Diarsipkan
      </span>
    );
  }

  if (status === NotificationDispatchStatus.COMPLETED) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        Terkirim
      </span>
    );
  }

  if (status === NotificationDispatchStatus.SCHEDULED) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
        <Clock className="w-3.5 h-3.5 text-blue-600" />
        Terjadwal
      </span>
    );
  }

  if (status === NotificationDispatchStatus.DRAFT) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
        <FileText className="w-3.5 h-3.5 text-slate-500" />
        Draft
      </span>
    );
  }

  if (status === NotificationDispatchStatus.FAILED) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
        <XCircle className="w-3.5 h-3.5 text-rose-600" />
        Gagal
      </span>
    );
  }

  if (status === NotificationDispatchStatus.PARTIAL_FAILED) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
        <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
        Sebagian Gagal
      </span>
    );
  }

  if (status === NotificationDispatchStatus.PROCESSING) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        Memproses
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      {status}
    </span>
  );
}
