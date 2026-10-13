"use client";
import { X } from "lucide-react";
import { type ReactNode, useEffect, useId, useRef } from "react";
import Button from "@/shared-ui/component/Button";
export function AuditDialog({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      trigger.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      dialog.showModal();
    } else if (!open && dialog.open) dialog.close();
    return () => {
      if (dialog.open) dialog.close();
      if (open) trigger.current?.focus();
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (open) onClose();
        trigger.current?.focus();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50"
    >
      <header className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-5">
        <h2 id={titleId} className="text-lg font-semibold">
          {title}
        </h2>
        <Button
          iconOnly
          leftIcon={X}
          variant="ghost"
          color="secondary"
          aria-label="Tutup dialog"
          onClick={onClose}
          className="min-h-11 min-w-11"
        />
      </header>
      <div className="p-5">{children}</div>
    </dialog>
  );
}
