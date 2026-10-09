"use client";

import { AlertTriangle, CheckCircle2, Send, WifiOff, X } from "lucide-react";
import Button from "@/shared-ui/component/Button";

export interface SubmitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  totalQuestions: number;
  answeredCount: number;
  isSubmitting?: boolean;
  isOffline?: boolean;
}

export default function SubmitConfirmationModal({
  isOpen,
  onClose,
  onConfirmSubmit,
  totalQuestions,
  answeredCount,
  isSubmitting = false,
  isOffline = false,
}: SubmitConfirmationModalProps) {
  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredCount;
  const hasUnanswered = unansweredCount > 0;

  return (
    <div
      data-testid="submit-confirmation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200  bg-white  p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200  pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500  border border-amber-500/20">
              <Send size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 ">
                Kumpulkan Ujian?
              </h3>
              <p className="text-xs text-slate-500 ">
                Konfirmasi penyelesaian dan submit jawaban.
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
            disabled={isSubmitting}
            aria-label="Tutup modal"
          />
        </div>

        {isOffline && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-start gap-3 text-amber-600 ">
            <WifiOff size={18} className="shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold">
                Koneksi Internet Terputus (Offline)
              </p>
              <p className="text-amber-700  leading-relaxed">
                Terdapat jawaban yang masih berada pada antrean lokal. Harap
                hubungkan internet kembali agar jawaban tersinkronisasi sebelum
                submit.
              </p>
            </div>
          </div>
        )}

        {hasUnanswered && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 flex items-start gap-3 text-rose-600 ">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold">Perhatian: Soal Belum Lengkap</p>
              <p className="text-rose-700  leading-relaxed">
                Anda masih memiliki{" "}
                <span className="font-bold underline">{unansweredCount}</span>{" "}
                soal yang belum terjawab. Jawaban yang belum diisi tidak akan
                memperoleh nilai.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="rounded-xl border border-slate-200  bg-slate-50  p-3 space-y-1">
            <span className="text-[11px] text-slate-500 ">Sudah Terjawab</span>
            <p className="text-lg font-bold text-emerald-600  flex items-center gap-1.5">
              <CheckCircle2 size={16} />
              {answeredCount}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200  bg-slate-50  p-3 space-y-1">
            <span className="text-[11px] text-slate-500 ">Belum Terjawab</span>
            <p
              className={`text-lg font-bold ${hasUnanswered ? "text-rose-600 " : "text-slate-400"}`}
            >
              {unansweredCount}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500  leading-relaxed">
          Setelah menekan tombol{" "}
          <strong className="text-slate-900 ">Kumpulkan Sekarang</strong>, sesi
          ujian Anda akan ditutup dan Anda tidak dapat lagi mengubah jawaban.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            size="md"
            variant="outline"
            color="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Kembali Periksa
          </Button>
          <Button
            size="md"
            variant="filled"
            color="warning"
            leftIcon={Send}
            loading={isSubmitting}
            onClick={onConfirmSubmit}
          >
            Kumpulkan Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
}
