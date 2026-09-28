"use client";

interface Props {
  categoryId?: number | null;
  format?: string;
}

export default function CourseCategoryBadge({ format = "topics" }: Props) {
  return (
    <span className="inline-flex items-center rounded-md bg-sky-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-sky-400 border border-sky-500/20">
      {format}
    </span>
  );
}
