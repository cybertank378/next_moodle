// Files: src/sections/notification-management/molecules/NotificationActionModal.tsx
"use client";

import { Send, Trash2 } from "lucide-react";
import Button from "@/shared-ui/component/Button";
import { Modal } from "@/shared-ui/component/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  variant?: "primary" | "danger";
  loading?: boolean;
}

export default function NotificationActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  variant = "primary",
  loading = false,
}: Props) {
  const isDanger = variant === "danger";

  return (
    <Modal open={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-full shrink-0 ${
              isDanger
                ? "bg-rose-100 text-rose-600"
                : "bg-indigo-100 text-indigo-600"
            }`}
          >
            {isDanger ? (
              <Trash2 className="w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="filled"
            color={isDanger ? "danger" : "primary"}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
