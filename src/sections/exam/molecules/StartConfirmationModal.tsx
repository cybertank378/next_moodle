"use client";

import { AlertCircle, Clock, Play, X } from "lucide-react";
import Button from "@/shared-ui/component/Button";

export interface StartConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmStart: () => void;
  quizName: string;
  timeLimitMinutes?: number;
  maxAttempts?: number;
  isLoading?: boolean;
}

export default function StartConfirmationModal({
  isOpen,
  onClose,
  onConfirmStart,
  quizName,
  timeLimitMinutes,
  maxAttempts,
  isLoading = false,
}: StartConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      data-testid="start-confirmation-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Play size={18} />
            </div>
            <div>
              <h3
                id="start-modal-title"
                className="text-base font-bold text-slate-900"
              >
                Konfirmasi Mulai Ujian
              </h3>
              <p className="text-xs text-slate-500">
                Pastikan Anda telah siap sebelum memulai sesi.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            color="secondary"
            iconOnly
            leftIcon={X}
            onClick={onClose}
            disabled={isLoading}
            aria-label="Tutup modal konfirmasi mulai ujian"
          />
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <h4 className="text-sm font-bold text-slate-900">{quizName}</h4>
            <div className="flex flex-wrap gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-indigo-500" />
                {timeLimitMinutes && timeLimitMinutes > 0
                  ? `Durasi: ${timeLimitMinutes} Menit`
                  : "Tanpa Batas Waktu"}
              </span>
              <span>
                {maxAttempts && maxAttempts > 0
                  ? `Batas: ${maxAttempts}x Percobaan`
                  : "Percobaan Tak Terbatas"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-800 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-amber-900">
              <AlertCircle size={14} className="shrink-0" />
              <span>Ketentuan Waktu & Percobaan</span>
            </div>
            <p className="leading-relaxed">
              Penghitung waktu mundur akan langsung berjalan setelah Anda
              menekan tombol mulai. Waktu tidak dapat dihentikan sementara
              (pause).
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            size="md"
            variant="outline"
            color="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            size="md"
            variant="filled"
            color="warning"
            leftIcon={Play}
            loading={isLoading}
            onClick={onConfirmStart}
          >
            Mulai Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
}
