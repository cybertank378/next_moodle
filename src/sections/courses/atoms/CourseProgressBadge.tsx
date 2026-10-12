"use client";

interface Props {
  progress: number | null;
  isCompleted?: boolean;
}

export default function CourseProgressBadge({ progress, isCompleted }: Props) {
  if (progress === null || progress === undefined) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-medium text-slate-500 border border-slate-500/20">
        Belum tersedia
      </span>
    );
  }

  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  if (isCompleted || clampedProgress === 100) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 border border-emerald-500/20">
        Selesai
      </span>
    );
  }

  if (clampedProgress > 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-600 border border-indigo-500/20">
        {clampedProgress}% Selesai
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-medium text-slate-500 border border-slate-500/20">
      Belum dimulai
    </span>
  );
}
