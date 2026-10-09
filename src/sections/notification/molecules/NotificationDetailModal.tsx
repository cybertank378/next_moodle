// Files: src/sections/notification/molecules/NotificationDetailModal.tsx
"use client";

import type { NotificationResponseDto } from "@/modules/notification/domain/dto/NotificationResponseDto";
import Button from "@/shared-ui/component/Button";
import { Modal } from "@/shared-ui/component/Modal";

interface NotificationDetailModalProps {
  notification: NotificationResponseDto | null;
  onClose: () => void;
}

function formatDetailDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(date);
  } catch {
    return isoDate;
  }
}

export default function NotificationDetailModal({
  notification,
  onClose,
}: NotificationDetailModalProps) {
  if (!notification) return null;

  return (
    <Modal
      open={Boolean(notification)}
      onClose={onClose}
      title={notification.title}
      size="md"
    >
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 pb-2">
          <span>Waktu Pengiriman</span>
          <span className="font-medium text-slate-600">
            {formatDetailDate(notification.createdAt)}
          </span>
        </div>

        <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
          {notification.body}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
}
