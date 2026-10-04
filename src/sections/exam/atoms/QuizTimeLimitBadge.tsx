"use client";

import { Clock } from "lucide-react";

interface Props {
  seconds: number;
}

export default function QuizTimeLimitBadge({ seconds }: Props) {
  if (!seconds || seconds <= 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
        <Clock size={13} className="text-slate-500" />
        Tanpa Batas Waktu
      </span>
    );
  }

  const minutes = Math.round(seconds / 60);

  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
      <Clock size={13} className="text-indigo-400" />
      {minutes} Menit
    </span>
  );
}
