"use client";
import { AlertTriangle, Trash2 } from "lucide-react";
import { AuditDialog } from "@/sections/audit/atoms/AuditDialog";
import Button from "@/shared-ui/component/Button";
export function AuditCleanupDialog({
  open,
  count,
  busy,
  onClose,
  onConfirm,
}: {
  open: boolean;
  count: number;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <AuditDialog
      open={open}
      onClose={busy ? () => {} : onClose}
      title="Konfirmasi Penghapusan Log Audit"
    >
      <div className="space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <Trash2 size={30} />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900">
            Hapus log yang melewati masa retensi?
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Hanya log yang memenuhi batas usia tiga bulan yang dapat
            dibersihkan. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div
          role="note"
          className="flex gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertTriangle className="shrink-0" />
          <span>
            Data yang dihapus tidak dapat dipulihkan. Database akan memvalidasi
            kembali batas usia setiap record.
          </span>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">Log memenuhi syarat</span>
            <strong>{count.toLocaleString("id-ID")}</strong>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Setiap eksekusi memproses maksimal 500 log.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            fullWidth
            variant="outline"
            disabled={busy}
            onClick={onClose}
            className="min-h-11"
          >
            Batal
          </Button>
          <Button
            fullWidth
            color="danger"
            loading={busy}
            disabled={busy || count === 0}
            onClick={onConfirm}
            className="min-h-11"
          >
            Hapus Log
          </Button>
        </div>
      </div>
    </AuditDialog>
  );
}
