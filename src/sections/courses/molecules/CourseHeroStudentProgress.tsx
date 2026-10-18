"use client";

interface CourseHeroStudentProgressProps {
  progress: number | null | undefined;
  topicCount: number;
  moduleCount: number;
}

export default function CourseHeroStudentProgress({
  progress,
  topicCount,
  moduleCount,
}: CourseHeroStudentProgressProps) {
  const roundedProgress =
    progress !== null && progress !== undefined ? Math.round(progress) : null;

  return (
    <div className="w-full md:w-64 shrink-0 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-500">
          Kemajuan Belajar
        </span>
        <span className="text-sm font-bold text-slate-900">
          {roundedProgress !== null ? `${roundedProgress}%` : "—"}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        {roundedProgress !== null && (
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.max(0, roundedProgress))}%`,
            }}
          />
        )}
      </div>
      <div className="pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-500">
        <span>Total Topik: {topicCount}</span>
        <span>Modul: {moduleCount}</span>
      </div>
    </div>
  );
}
