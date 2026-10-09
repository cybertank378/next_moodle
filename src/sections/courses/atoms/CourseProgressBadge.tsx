"use client";

interface Props {
  progress: number | null;
  isCompleted?: boolean;
}

export default function CourseProgressBadge({ progress, isCompleted }: Props) {
  if (isCompleted || progress === 100) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
        Selesai
      </span>
    );
  }

  if (progress !== null && progress > 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400 border border-indigo-500/20">
        {Math.round(progress)}% Selesai
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-medium text-slate-400 border border-slate-500/20">
      Belum dimulai
    </span>
  );
}
