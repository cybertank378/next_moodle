"use client";

import type { QuizAccessStatus } from "@/modules/quiz/domain/types/QuizTypes";

interface Props {
  status: QuizAccessStatus;
}

export default function QuizStatusBadge({ status }: Props) {
  if (status === "OPEN") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
        Aktif / Terbuka
      </span>
    );
  }

  if (status === "UPCOMING") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
        Akan Datang
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-400 border border-rose-500/20">
      Ditutup
    </span>
  );
}
