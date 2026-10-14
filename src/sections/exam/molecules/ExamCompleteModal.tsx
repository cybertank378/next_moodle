"use client";

import { CheckCircle2, FileText, Home } from "lucide-react";
import Button from "@/shared-ui/component/Button";

export interface ExamCompleteModalProps {
  isOpen: boolean;
  attemptId: number;
  quizName?: string;
  onBackToExams: () => void;
  onViewResults?: () => void;
}

export default function ExamCompleteModal({
  isOpen,
  attemptId,
  quizName = "Ujian",
  onBackToExams,
  onViewResults,
}: ExamCompleteModalProps) {
  if (!isOpen) return null;

  return (
    <div
      data-testid="exam-complete-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="complete-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-center space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          <CheckCircle2 size={32} />
        </div>

        <div className="space-y-2">
          <h3
            id="complete-modal-title"
            className="text-xl font-bold text-slate-900"
          >
            Ujian Telah Selesai Dikirim
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            Jawaban Anda untuk <strong>{quizName}</strong> (Attempt #{attemptId}
            ) telah berhasil disimpan dan diserahkan ke sistem.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 text-left space-y-1">
          <p className="font-semibold text-slate-800">Status Pengerjaan:</p>
          <p>
            Sesi ujian ditutup secara permanen. Nilai akhir akan ditampilkan
            sesuai kebijakan pengumuman guru/instruktur.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            size="md"
            variant="outline"
            color="secondary"
            fullWidth
            leftIcon={Home}
            onClick={onBackToExams}
          >
            Kembali ke Portal Ujian
          </Button>

          {onViewResults && (
            <Button
              size="md"
              variant="filled"
              color="primary"
              fullWidth
              leftIcon={FileText}
              onClick={onViewResults}
            >
              Lihat Daftar Nilai
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
